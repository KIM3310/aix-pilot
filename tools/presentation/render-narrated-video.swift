import AppKit
import AVFoundation
import Foundation

struct Scene: Decodable {
    let id: String
    let slide: String
    let title: String
    let subtitle: String
    let narration: String
    let image: String
    let audio: String
    let audioDuration: Double
    let duration: Double
    let start: Double
    let end: Double
}

struct ScenePayload: Decodable {
    let width: Int
    let height: Int
    let fps: Int
    let scenes: [Scene]
}

enum RenderError: Error, CustomStringConvertible {
    case missingArgument
    case imageLoad(String)
    case writer(String)
    case pixelBuffer
    case export(String)

    var description: String {
        switch self {
        case .missingArgument:
            return "Usage: swift render-narrated-video.swift <video-scenes.json> <silent.mov> <final.mp4> <stills-dir>"
        case .imageLoad(let path):
            return "Could not load image: \(path)"
        case .writer(let message):
            return "Video writer failed: \(message)"
        case .pixelBuffer:
            return "Could not create pixel buffer"
        case .export(let message):
            return "Video export failed: \(message)"
        }
    }
}

func nsColor(_ hex: String, alpha: CGFloat = 1) -> NSColor {
    let clean = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
    var value: UInt64 = 0
    Scanner(string: clean).scanHexInt64(&value)
    let r = CGFloat((value >> 16) & 0xff) / 255
    let g = CGFloat((value >> 8) & 0xff) / 255
    let b = CGFloat(value & 0xff) / 255
    return NSColor(calibratedRed: r, green: g, blue: b, alpha: alpha)
}

func drawText(_ string: String, in rect: NSRect, size: CGFloat, weight: NSFont.Weight, color: NSColor, align: NSTextAlignment = .left, lineSpacing: CGFloat = 4) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = align
    paragraph.lineSpacing = lineSpacing
    let font = NSFont.systemFont(ofSize: size, weight: weight)
    let attrs: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: color,
        .paragraphStyle: paragraph
    ]
    NSAttributedString(string: string, attributes: attrs).draw(in: rect)
}

func drawRounded(_ rect: NSRect, radius: CGFloat, fill: NSColor, stroke: NSColor? = nil, lineWidth: CGFloat = 1) {
    let path = NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius)
    fill.setFill()
    path.fill()
    if let stroke {
        stroke.setStroke()
        path.lineWidth = lineWidth
        path.stroke()
    }
}

final class SlideCache {
    private var images: [String: NSImage] = [:]

    func image(path: String) throws -> NSImage {
        if let cached = images[path] {
            return cached
        }
        guard let loaded = NSImage(contentsOfFile: path) else {
            throw RenderError.imageLoad(path)
        }
        images[path] = loaded
        return loaded
    }
}

func drawFrame(scene: Scene, image: NSImage, progress: Double, width: Int, height: Int, frameIndex: Int, totalFrames: Int) {
    let W = CGFloat(width)
    let H = CGFloat(height)
    nsColor("#F7F5EE").setFill()
    NSRect(x: 0, y: 0, width: W, height: H).fill()

    let baseScale = max(W / max(1, image.size.width), H / max(1, image.size.height))
    let zoom = baseScale * CGFloat(1.005 + progress * 0.028)
    let drawW = image.size.width * zoom
    let drawH = image.size.height * zoom
    let panX = CGFloat(progress - 0.5) * 22
    let panY = CGFloat(progress - 0.5) * 12
    let imageRect = NSRect(x: (W - drawW) / 2 + panX, y: (H - drawH) / 2 + panY, width: drawW, height: drawH)
    image.draw(in: imageRect, from: .zero, operation: .copy, fraction: 1)

    let barRect = NSRect(x: 260, y: 64, width: W - 520, height: 118)
    drawRounded(barRect, radius: 18, fill: nsColor("#071D1A", alpha: 0.66), stroke: nsColor("#6FCBC0", alpha: 0.24))
    drawText(scene.subtitle, in: NSRect(x: barRect.minX + 48, y: barRect.minY + 22, width: barRect.width - 96, height: 76), size: 32, weight: .semibold, color: .white, align: .center, lineSpacing: 6)

    let progressW = (W - 520) * CGFloat(frameIndex) / CGFloat(max(totalFrames, 1))
    drawRounded(NSRect(x: 260, y: 38, width: W - 520, height: 5), radius: 3, fill: nsColor("#FFFFFF", alpha: 0.22))
    drawRounded(NSRect(x: 260, y: 38, width: progressW, height: 5), radius: 3, fill: nsColor("#F36B4F", alpha: 0.9))

    let localSeconds = progress * scene.duration
    let fade = min(1.0, max(0.0, min(localSeconds / 0.55, (scene.duration - localSeconds) / 0.55)))
    if fade < 1 {
        nsColor("#000000", alpha: CGFloat(1 - fade)).setFill()
        NSRect(x: 0, y: 0, width: W, height: H).fill()
    }
}

func makePixelBuffer(width: Int, height: Int, pool: CVPixelBufferPool, draw: (CGContext) throws -> Void) throws -> CVPixelBuffer {
    var maybeBuffer: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool, &maybeBuffer)
    guard let buffer = maybeBuffer else {
        throw RenderError.pixelBuffer
    }

    CVPixelBufferLockBaseAddress(buffer, [])
    defer { CVPixelBufferUnlockBaseAddress(buffer, []) }

    guard
        let base = CVPixelBufferGetBaseAddress(buffer),
        let context = CGContext(
            data: base,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
        )
    else {
        throw RenderError.pixelBuffer
    }

    try draw(context)
    return buffer
}

func renderSilentVideo(payload: ScenePayload, outputURL: URL) throws {
    try? FileManager.default.removeItem(at: outputURL)
    let width = payload.width
    let height = payload.height
    let fps = payload.fps
    let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mov)
    let settings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 9_000_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
        ]
    ]
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
    input.expectsMediaDataInRealTime = false
    guard writer.canAdd(input) else {
        throw RenderError.writer("Cannot add video input")
    }
    writer.add(input)

    let attrs: [String: Any] = [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
        kCVPixelBufferCGImageCompatibilityKey as String: true,
        kCVPixelBufferCGBitmapContextCompatibilityKey as String: true,
        kCVPixelBufferIOSurfacePropertiesKey as String: [:]
    ]
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: attrs)

    guard writer.startWriting() else {
        throw RenderError.writer(writer.error?.localizedDescription ?? "startWriting returned false")
    }
    writer.startSession(atSourceTime: .zero)

    let cache = SlideCache()
    var frameIndex: Int64 = 0
    let totalFrames = max(1, Int(payload.scenes.reduce(0) { $0 + $1.duration } * Double(fps)))

    for scene in payload.scenes {
        let image = try cache.image(path: scene.image)
        let frames = max(1, Int(round(scene.duration * Double(fps))))
        for localFrame in 0..<frames {
            while !input.isReadyForMoreMediaData {
                Thread.sleep(forTimeInterval: 0.01)
            }
            let progress = frames <= 1 ? 1.0 : Double(localFrame) / Double(frames - 1)
            let buffer = try makePixelBuffer(width: width, height: height, pool: adaptor.pixelBufferPool!) { context in
                let graphics = NSGraphicsContext(cgContext: context, flipped: false)
                NSGraphicsContext.saveGraphicsState()
                NSGraphicsContext.current = graphics
                drawFrame(scene: scene, image: image, progress: progress, width: width, height: height, frameIndex: Int(frameIndex), totalFrames: totalFrames)
                graphics.flushGraphics()
                NSGraphicsContext.restoreGraphicsState()
            }
            let time = CMTime(value: frameIndex, timescale: CMTimeScale(fps))
            if !adaptor.append(buffer, withPresentationTime: time) {
                throw RenderError.writer(writer.error?.localizedDescription ?? "append failed")
            }
            frameIndex += 1
        }
    }

    input.markAsFinished()
    let done = DispatchSemaphore(value: 0)
    writer.finishWriting {
        done.signal()
    }
    done.wait()
    if writer.status != .completed {
        throw RenderError.writer(writer.error?.localizedDescription ?? "finishWriting did not complete")
    }
}

func muxAudio(payload: ScenePayload, silentURL: URL, outputURL: URL) throws {
    try? FileManager.default.removeItem(at: outputURL)
    let composition = AVMutableComposition()
    let videoAsset = AVAsset(url: silentURL)
    guard let sourceVideo = videoAsset.tracks(withMediaType: .video).first else {
        throw RenderError.export("Silent video has no video track")
    }
    guard let videoTrack = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid) else {
        throw RenderError.export("Could not create composition video track")
    }
    try videoTrack.insertTimeRange(CMTimeRange(start: .zero, duration: videoAsset.duration), of: sourceVideo, at: .zero)
    videoTrack.preferredTransform = sourceVideo.preferredTransform

    guard let audioTrack = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) else {
        throw RenderError.export("Could not create composition audio track")
    }

    for scene in payload.scenes {
        let asset = AVAsset(url: URL(fileURLWithPath: scene.audio))
        guard let sourceAudio = asset.tracks(withMediaType: .audio).first else {
            throw RenderError.export("Missing audio track for scene \(scene.id)")
        }
        let start = CMTime(seconds: scene.start, preferredTimescale: 600)
        try audioTrack.insertTimeRange(CMTimeRange(start: .zero, duration: asset.duration), of: sourceAudio, at: start)
    }

    guard let exporter = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetHighestQuality) else {
        throw RenderError.export("Could not create export session")
    }
    exporter.outputURL = outputURL
    exporter.outputFileType = .mp4
    exporter.shouldOptimizeForNetworkUse = true
    let done = DispatchSemaphore(value: 0)
    exporter.exportAsynchronously {
        done.signal()
    }
    done.wait()
    if exporter.status != .completed {
        throw RenderError.export(exporter.error?.localizedDescription ?? "export status \(exporter.status.rawValue)")
    }
}

func writePNG(_ cgImage: CGImage, to url: URL) throws {
    let rep = NSBitmapImageRep(cgImage: cgImage)
    guard let data = rep.representation(using: .png, properties: [:]) else {
        throw RenderError.export("Could not encode PNG")
    }
    try data.write(to: url)
}

func exportStills(videoURL: URL, outputDir: URL) throws {
    try FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)
    let asset = AVAsset(url: videoURL)
    let duration = max(1, CMTimeGetSeconds(asset.duration))
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.maximumSize = CGSize(width: 1920, height: 1080)
    let times = [2.0, duration * 0.5, max(2, duration - 2)]
    for (index, seconds) in times.enumerated() {
        let time = CMTime(seconds: seconds, preferredTimescale: 600)
        let image = try generator.copyCGImage(at: time, actualTime: nil)
        try writePNG(image, to: outputDir.appendingPathComponent(String(format: "video-still-%02d.png", index + 1)))
    }
}

func main() throws {
    guard CommandLine.arguments.count >= 5 else {
        throw RenderError.missingArgument
    }
    let scenesURL = URL(fileURLWithPath: CommandLine.arguments[1])
    let silentURL = URL(fileURLWithPath: CommandLine.arguments[2])
    let finalURL = URL(fileURLWithPath: CommandLine.arguments[3])
    let stillsURL = URL(fileURLWithPath: CommandLine.arguments[4])
    let payload = try JSONDecoder().decode(ScenePayload.self, from: Data(contentsOf: scenesURL))
    try FileManager.default.createDirectory(at: silentURL.deletingLastPathComponent(), withIntermediateDirectories: true)
    try renderSilentVideo(payload: payload, outputURL: silentURL)
    try muxAudio(payload: payload, silentURL: silentURL, outputURL: finalURL)
    try exportStills(videoURL: finalURL, outputDir: stillsURL)
    let size = (try FileManager.default.attributesOfItem(atPath: finalURL.path)[.size] as? NSNumber)?.int64Value ?? 0
    print("{\"output\":\"\(finalURL.path)\",\"bytes\":\(size),\"duration\":\(payload.scenes.last?.end ?? 0)}")
}

do {
    try main()
} catch {
    fputs("\(error)\n", stderr)
    exit(1)
}
