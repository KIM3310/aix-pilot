const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  });
}

function getClientId(request) {
  const clientId = request.headers.get("x-aix-client-id") || "";
  return /^[a-z0-9-]{16,80}$/i.test(clientId) ? clientId : "";
}

async function ensureSchema(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS documents (
        client_id TEXT NOT NULL,
        id TEXT NOT NULL,
        source TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        owner TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        sensitivity TEXT NOT NULL,
        PRIMARY KEY (client_id, id)
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS audit_events (
        client_id TEXT NOT NULL,
        id INTEGER NOT NULL,
        time TEXT NOT NULL,
        type TEXT NOT NULL,
        summary TEXT NOT NULL,
        risk TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (client_id, id)
      )`
    )
    .run();
}

function getDatabase(context) {
  return context.env && context.env.AIX_DB ? context.env.AIX_DB : null;
}

export async function onRequestGet(context) {
  const db = getDatabase(context);
  const clientId = getClientId(context.request);

  if (!db) {
    return json({ status: "unconfigured", message: "AIX_DB binding is not configured." }, { status: 503 });
  }

  if (!clientId) {
    return json({ status: "invalid_client", message: "Missing x-aix-client-id header." }, { status: 400 });
  }

  await ensureSchema(db);

  const documents = await db
    .prepare(
      `SELECT id, source, title, content, owner, updated_at AS updatedAt, sensitivity
       FROM documents
       WHERE client_id = ?
       ORDER BY updated_at DESC, title ASC`
    )
    .bind(clientId)
    .all();

  const auditEvents = await db
    .prepare(
      `SELECT id, time, type, summary, risk
       FROM audit_events
       WHERE client_id = ?
       ORDER BY id ASC`
    )
    .bind(clientId)
    .all();

  return json({
    status: "ok",
    documents: documents.results || [],
    auditEvents: auditEvents.results || []
  });
}

export async function onRequestPost(context) {
  const db = getDatabase(context);
  const clientId = getClientId(context.request);

  if (!db) {
    return json({ status: "unconfigured", message: "AIX_DB binding is not configured." }, { status: 503 });
  }

  if (!clientId) {
    return json({ status: "invalid_client", message: "Missing x-aix-client-id header." }, { status: 400 });
  }

  const payload = await context.request.json();
  const documents = Array.isArray(payload.documents) ? payload.documents.slice(0, 80) : [];
  const auditEvents = Array.isArray(payload.auditEvents) ? payload.auditEvents.slice(0, 200) : [];

  await ensureSchema(db);

  const statements = [
    db.prepare("DELETE FROM documents WHERE client_id = ?").bind(clientId),
    db.prepare("DELETE FROM audit_events WHERE client_id = ?").bind(clientId),
    ...documents.map((doc) =>
      db
        .prepare(
          `INSERT INTO documents (client_id, id, source, title, content, owner, updated_at, sensitivity)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          clientId,
          String(doc.id || crypto.randomUUID()),
          String(doc.source || "사내지식"),
          String(doc.title || "Untitled"),
          String(doc.content || ""),
          String(doc.owner || "Unknown"),
          String(doc.updatedAt || new Date().toISOString().slice(0, 10)),
          String(doc.sensitivity || "Internal")
        )
    ),
    ...auditEvents.map((event, index) =>
      db
        .prepare(
          `INSERT INTO audit_events (client_id, id, time, type, summary, risk)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          clientId,
          Number.isFinite(Number(event.id)) ? Number(event.id) : index + 1,
          String(event.time || ""),
          String(event.type || "System"),
          String(event.summary || ""),
          String(event.risk || "낮음")
        )
    )
  ];

  await db.batch(statements);

  return json({
    status: "ok",
    stored: {
      documents: documents.length,
      auditEvents: auditEvents.length
    }
  });
}
