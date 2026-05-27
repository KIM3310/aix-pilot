import type { KnowledgeDocument } from "../data/sampleDocs";

export type Chunk = {
  id: string;
  docId: string;
  title: string;
  source: string;
  owner: string;
  updatedAt: string;
  sensitivity: KnowledgeDocument["sensitivity"];
  tags: string[];
  text: string;
  terms: string[];
};

export type SearchResult = Chunk & {
  score: number;
  highlights: string[];
};

export type RagAnswer = {
  answer: string;
  confidence: number;
  citations: SearchResult[];
  followUps: string[];
};

const stopwords = new Set([
  "그리고",
  "또는",
  "으로",
  "에서",
  "에게",
  "하는",
  "한다",
  "있다",
  "없는",
  "어떤",
  "무엇",
  "알려줘",
  "해주세요",
  "때",
  "수",
  "및",
  "등",
  "the",
  "and",
  "or"
]);

function normalizeTerm(term: string) {
  return term
    .replace(/(입니다|합니다|한다|해야|에는|에서|으로|부터|까지|에게|하고)$/u, "")
    .replace(/(은|는|이|가|을|를|에|의|도|만|로|과|와)$/u, "");
}

export function tokenize(text: string) {
  const normalized = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map(normalizeTerm)
    .filter((term) => term.length > 1 && !stopwords.has(term));

  const koreanNgrams = Array.from(text.matchAll(/[\u3131-\uD79D]{3,}/g)).flatMap((match) => {
    const word = match[0].toLowerCase();
    const grams: string[] = [];
    for (let i = 0; i < word.length - 1; i += 1) grams.push(word.slice(i, i + 2));
    for (let i = 0; i < word.length - 2; i += 1) grams.push(word.slice(i, i + 3));
    return grams;
  });

  return [...normalized, ...koreanNgrams];
}

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function chunkDocuments(documents: KnowledgeDocument[]): Chunk[] {
  return documents.flatMap((doc) => {
    const sentences = splitSentences(doc.content);
    const chunks: Chunk[] = [];
    let buffer: string[] = [];
    let charCount = 0;
    let chunkIndex = 0;

    for (const sentence of sentences) {
      buffer.push(sentence);
      charCount += sentence.length;
      if (charCount > 260 || buffer.length >= 4) {
        const text = buffer.join(" ");
        chunks.push({
          id: `${doc.id}-${chunkIndex}`,
          docId: doc.id,
          title: doc.title,
          source: doc.source,
          owner: doc.owner,
          updatedAt: doc.updatedAt,
          sensitivity: doc.sensitivity,
          tags: doc.tags,
          text,
          terms: tokenize(`${doc.title} ${doc.tags.join(" ")} ${text}`)
        });
        chunkIndex += 1;
        buffer = [];
        charCount = 0;
      }
    }

    if (buffer.length) {
      const text = buffer.join(" ");
      chunks.push({
        id: `${doc.id}-${chunkIndex}`,
        docId: doc.id,
        title: doc.title,
        source: doc.source,
        owner: doc.owner,
        updatedAt: doc.updatedAt,
        sensitivity: doc.sensitivity,
        tags: doc.tags,
        text,
        terms: tokenize(`${doc.title} ${doc.tags.join(" ")} ${text}`)
      });
    }

    return chunks;
  });
}

function makeIdf(chunks: Chunk[]) {
  const counts = new Map<string, number>();
  chunks.forEach((chunk) => {
    new Set(chunk.terms).forEach((term) => counts.set(term, (counts.get(term) ?? 0) + 1));
  });
  const total = chunks.length || 1;
  return new Map(Array.from(counts.entries()).map(([term, count]) => [term, Math.log((total + 1) / (count + 0.5)) + 1]));
}

function topHighlights(text: string, terms: string[]) {
  const sentences = splitSentences(text);
  return sentences
    .map((sentence) => ({
      sentence,
      hits: terms.filter((term) => sentence.toLowerCase().includes(term)).length
    }))
    .filter((item) => item.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 2)
    .map((item) => item.sentence);
}

function queryWordsAndPhrases(query: string) {
  const words = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map(normalizeTerm)
    .filter((term) => term.length > 1 && !stopwords.has(term));
  const phrases = words
    .slice(0, -1)
    .map((word, index) => `${word} ${words[index + 1]}`)
    .filter((phrase) => phrase.length > 3);
  return { words, phrases };
}

export function searchKnowledge(query: string, chunks: Chunk[], selectedSources: string[] = []) {
  const queryTerms = tokenize(query);
  if (!queryTerms.length) return [];
  const { phrases: queryPhrases } = queryWordsAndPhrases(query);
  const idf = makeIdf(chunks);
  const querySet = new Set(queryTerms);
  const sourceSet = new Set(selectedSources);
  const filtered = selectedSources.length ? chunks.filter((chunk) => sourceSet.has(chunk.source)) : chunks;

  return filtered
    .map((chunk) => {
      const termCounts = new Map<string, number>();
      chunk.terms.forEach((term) => termCounts.set(term, (termCounts.get(term) ?? 0) + 1));
      let score = 0;
      querySet.forEach((term) => {
        const tf = termCounts.get(term) ?? 0;
        if (tf) score += Math.log(1 + tf) * (idf.get(term) ?? 1);
      });
      const rawText = `${chunk.title} ${chunk.tags.join(" ")} ${chunk.text}`.toLowerCase();
      const phraseBoost = queryPhrases.reduce((boost, phrase) => (rawText.includes(phrase) ? boost + 5.5 : boost), 0);
      const tagBoost = chunk.tags.some((tag) => query.includes(tag)) ? 1.4 : 1;
      const titleBoost = queryTerms.some((term) => chunk.title.toLowerCase().includes(term)) ? 1.25 : 1;
      return {
        ...chunk,
        score: Number(((score + phraseBoost) * tagBoost * titleBoost).toFixed(3)),
        highlights: topHighlights(chunk.text, Array.from(querySet))
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function selectAnswerSentences(query: string, results: SearchResult[]) {
  const terms = tokenize(query);
  const { phrases } = queryWordsAndPhrases(query);
  const seen = new Set<string>();
  const candidates = results
    .flatMap((result) =>
      splitSentences(result.text).map((sentence) => ({
        sentence,
        title: result.title,
        hits: terms.filter((term) => sentence.toLowerCase().includes(term)).length,
        phraseHits: phrases.filter((phrase) => sentence.toLowerCase().includes(phrase)).length,
        score: result.score
      }))
    )
    .filter((item) => item.hits > 0)
    .sort((a, b) => b.phraseHits * 8 + b.hits + b.score - (a.phraseHits * 8 + a.hits + a.score))
    .filter((item) => {
      const key = item.sentence.slice(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const exactPhraseCandidates = candidates.filter((item) => item.phraseHits > 0);
  return (exactPhraseCandidates.length ? exactPhraseCandidates : candidates).slice(0, 4);
}

function uniqueDocuments(results: SearchResult[]) {
  const seen = new Set<string>();
  return results.filter((result) => {
    if (seen.has(result.docId)) return false;
    seen.add(result.docId);
    return true;
  });
}

export function generateRagAnswer(query: string, results: SearchResult[]): RagAnswer {
  if (!results.length) {
    return {
      answer:
        "현재 색인된 문서에서는 충분한 근거를 찾지 못했습니다. 문서를 추가로 업로드하거나 검색 범위를 넓힌 뒤 다시 시도하세요.",
      confidence: 24,
      citations: [],
      followUps: ["관련 문서를 업로드하기", "검색 범위 전체로 변경하기", "질문을 더 구체화하기"]
    };
  }

  const topScore = results[0].score || 1;
  const citationCandidates = uniqueDocuments(results.filter((result) => result.score >= topScore * 0.16)).slice(0, 3);
  const { phrases } = queryWordsAndPhrases(query);
  const phraseMatchedCitations = citationCandidates.filter((result) => {
    const rawText = `${result.title} ${result.text}`.toLowerCase();
    return phrases.some((phrase) => rawText.includes(phrase));
  });
  const finalCitations = phraseMatchedCitations.length ? phraseMatchedCitations : citationCandidates;
  const answerSentences = selectAnswerSentences(query, finalCitations.length ? finalCitations : results);
  const body =
    answerSentences.length > 0
      ? answerSentences.map((item) => item.sentence).join(" ")
      : citationCandidates
          .slice(0, 2)
          .map((result) => result.text)
          .join(" ");
  const confidence = Math.min(96, Math.max(42, Math.round(results[0].score * 17 + results.length * 8)));

  return {
    answer: `${body} 근거 문서는 ${finalCitations
      .map((result) => `「${result.title}」`)
      .join(", ")}입니다.`,
    confidence,
    citations: finalCitations,
    followUps: [
      "이 답변을 고객 안내 메일로 변환",
      "관련 정책만 다시 검색",
      "보안 검토 후 보고서 초안 생성"
    ]
  };
}

export function createDocumentFromUpload(title: string, rawText: string): KnowledgeDocument {
  return {
    id: `upload-${Date.now()}`,
    title: title.trim() || "업로드 문서",
    source: "사내지식",
    owner: "파일럿 사용자",
    updatedAt: new Date().toISOString().slice(0, 10),
    sensitivity: "Internal",
    tags: ["업로드", "파일럿"],
    content: rawText.trim()
  };
}
