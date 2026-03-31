import "dotenv/config";
import express from "express";
import Groq from "groq-sdk";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { OAuth2Client } from "google-auth-library";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { randomBytes } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

// ── Middlewares ────────────────────────────────────────────────────
app.use(compression());
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Google Auth & MongoDB ─────────────────────────────────────────
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || "schoolia_default_secret";
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

let db = null;
let usersCol = null;
let tasksCol = null;

async function connectDB() {
  if (!process.env.MONGODB_URI) return;
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db("schoolia");
    usersCol = db.collection("users");
    tasksCol = db.collection("tasks");
    await usersCol.createIndex({ googleId: 1 }, { unique: true });
    await tasksCol.createIndex({ userId: 1, createdAt: -1 });
    console.log("MongoDB conectado");
  } catch (err) {
    console.error("MongoDB error:", err.message);
  }
}
connectDB();

// ── Auth middleware ────────────────────────────────────────────────
function authOptional(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(auth.slice(7), JWT_SECRET);
      req.user = payload;
    } catch {}
  }
  next();
}

function authRequired(req, res, next) {
  authOptional(req, res, () => {
    if (!req.user) return res.status(401).json({ error: "No autenticado." });
    next();
  });
}

// ── Auth endpoints ────────────────────────────────────────────────
app.post("/api/auth/google", async (req, res) => {
  if (!googleClient) return res.status(500).json({ error: "Auth no configurado." });
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Falta el token." });

  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (usersCol) {
      await usersCol.updateOne(
        { googleId },
        { $set: { email, name, picture, lastLogin: new Date() }, $setOnInsert: { googleId, createdAt: new Date() } },
        { upsert: true }
      );
    }

    const token = jwt.sign({ googleId, email, name, picture }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name, email, picture } });
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Token inválido." });
  }
});

app.get("/api/auth/me", authRequired, (req, res) => {
  res.json({ user: req.user });
});

// ── User tasks (cloud storage) ────────────────────────────────────
app.get("/api/tareas", authRequired, async (req, res) => {
  if (!tasksCol) return res.json({ tareas: [] });
  try {
    const tareas = await tasksCol.find({ userId: req.user.googleId }).sort({ createdAt: -1 }).limit(50).toArray();
    res.json({ tareas });
  } catch (err) {
    res.status(500).json({ error: "Error al cargar tareas." });
  }
});

app.post("/api/tareas", authRequired, async (req, res) => {
  if (!tasksCol) return res.status(500).json({ error: "Base de datos no disponible." });
  const { tema, nivel, tipo, idioma, secciones, textoCompleto } = req.body;
  try {
    const result = await tasksCol.insertOne({
      userId: req.user.googleId,
      tema, nivel, tipo, idioma, secciones, textoCompleto,
      createdAt: new Date(),
    });
    res.json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar." });
  }
});

app.delete("/api/tareas/:id", authRequired, async (req, res) => {
  if (!tasksCol) return res.status(500).json({ error: "Base de datos no disponible." });
  try {
    const { ObjectId } = await import("mongodb");
    await tasksCol.deleteOne({ _id: new ObjectId(req.params.id), userId: req.user.googleId });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar." });
  }
});

app.get("/api/auth/config", (req, res) => {
  res.json({ clientId: GOOGLE_CLIENT_ID || null });
});

// ── Rate limiting ─────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Espera un momento antes de intentar de nuevo." },
});

app.use("/api/", apiLimiter);

// ── In-memory stores ──────────────────────────────────────────────
const sharedTasks = new Map();
const responseCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 min

function getCacheKey(params) {
  return JSON.stringify(params);
}

function getCached(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  if (responseCache.size > 200) {
    const oldest = responseCache.keys().next().value;
    responseCache.delete(oldest);
  }
  responseCache.set(key, { data, timestamp: Date.now() });
}

async function generateText(prompt) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 4096,
  });
  return chatCompletion.choices[0]?.message?.content || "";
}

// ── Streaming generation ───────────────────────────────────────────
app.post("/api/generar-stream", async (req, res) => {
  const { tema, nivel, tipo, idioma, personas } = req.body;

  if (!tema || !nivel || !tipo) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  const prompt = buildPrompt(tema, nivel, tipo, idioma || "es", personas);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    });

    let fullText = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullText += content;
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
      }
    }

    const secciones = parseSections(fullText);
    const result = { done: true, secciones, textoCompleto: fullText };
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    res.end();

    // Cache the result
    const cacheKey = getCacheKey({ tema, nivel, tipo, idioma, personas });
    setCache(cacheKey, { secciones, textoCompleto: fullText });
  } catch (err) {
    console.error("Error AI stream:", err.message);
    res.write(`data: ${JSON.stringify({ error: "Error al generar. Intenta de nuevo." })}\n\n`);
    res.end();
  }
});

// ── Endpoint principal: Generar tarea ──────────────────────────────
app.post("/api/generar", async (req, res) => {
  const { tema, nivel, tipo, idioma, personas } = req.body;

  if (!tema || !nivel || !tipo) {
    return res.status(400).json({ error: "Faltan campos requeridos: tema, nivel y tipo." });
  }

  const cacheKey = getCacheKey({ tema, nivel, tipo, idioma, personas });
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  const prompt = buildPrompt(tema, nivel, tipo, idioma || "es", personas);

  try {
    const text = await generateText(prompt);
    const secciones = parseSections(text);
    const result = { secciones, textoCompleto: text };
    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al generar la tarea. Intenta de nuevo." });
  }
});

// ── Endpoint: Hazlo más humano ─────────────────────────────────────
app.post("/api/humanizar", async (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: "Falta el texto." });

  const prompt = `Reescribe el siguiente texto escolar para que suene más natural y humano.
Usa un tono de estudiante real: vocabulario cotidiano, conectores simples, alguna opinión personal.
Evita sonar como inteligencia artificial. No cambies la información, solo el estilo.
Mantén las mismas secciones con los mismos encabezados exactos.

Texto original:
${texto}`;

  try {
    const text = await generateText(prompt);
    const secciones = parseSections(text);
    res.json({ secciones, textoCompleto: text });
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al humanizar. Intenta de nuevo." });
  }
});

// ── Endpoint: Más corto ────────────────────────────────────────────
app.post("/api/acortar", async (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: "Falta el texto." });

  const prompt = `Resume y acorta significativamente el siguiente texto escolar.
Mantén los puntos clave y la información esencial, pero hazlo mucho más conciso.
Mantén las mismas secciones con los mismos encabezados exactos.
Reduce cada sección a la mitad o menos.

Texto original:
${texto}`;

  try {
    const text = await generateText(prompt);
    const secciones = parseSections(text);
    res.json({ secciones, textoCompleto: text });
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al acortar. Intenta de nuevo." });
  }
});

// ── Endpoint: Ampliar sección ──────────────────────────────────────
app.post("/api/ampliar", async (req, res) => {
  const { seccion, tema } = req.body;
  if (!seccion) return res.status(400).json({ error: "Falta la sección." });

  const prompt = `Amplía y desarrolla con mucho más detalle la siguiente sección de un trabajo escolar sobre "${tema || 'el tema'}".
Agrega más información, ejemplos, datos interesantes y explicaciones más profundas.
Mantén el mismo formato markdown.

Sección a ampliar:
${seccion}`;

  try {
    const text = await generateText(prompt);
    res.json({ texto: text });
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al ampliar. Intenta de nuevo." });
  }
});

// ── Endpoint: Chat sobre el tema ───────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { pregunta, contexto } = req.body;
  if (!pregunta) return res.status(400).json({ error: "Falta la pregunta." });

  const prompt = `Eres un tutor educativo amigable. El estudiante tiene un trabajo sobre un tema y quiere hacerte preguntas.

Contexto del trabajo:
${contexto || "(sin contexto)"}

Pregunta del estudiante: ${pregunta}

Responde de forma clara, educativa y amigable. Si no sabes algo, dilo honestamente. Usa markdown para formatear.`;

  try {
    const text = await generateText(prompt);
    res.json({ respuesta: text });
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al responder. Intenta de nuevo." });
  }
});

// ── Endpoint: Generar quiz ─────────────────────────────────────────
app.post("/api/quiz", async (req, res) => {
  const { tema, texto } = req.body;
  if (!tema) return res.status(400).json({ error: "Falta el tema." });

  const prompt = `Genera un quiz de opción múltiple sobre "${tema}" basado en el siguiente contenido.

Contenido:
${texto || tema}

Genera EXACTAMENTE 8 preguntas en formato JSON. Cada pregunta debe tener:
- "pregunta": la pregunta
- "opciones": array de 4 opciones (a, b, c, d)
- "correcta": índice de la respuesta correcta (0-3)
- "explicacion": breve explicación de por qué esa es la respuesta

Responde SOLO con el JSON, sin texto adicional. El formato debe ser:
[{"pregunta":"...","opciones":["a","b","c","d"],"correcta":0,"explicacion":"..."}]`;

  try {
    const text = await generateText(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const quiz = JSON.parse(jsonMatch[0]);
      res.json({ quiz });
    } else {
      res.status(500).json({ error: "Error al parsear el quiz." });
    }
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al generar quiz. Intenta de nuevo." });
  }
});

// ── Endpoint: Calificar respuesta ──────────────────────────────────
app.post("/api/calificar", async (req, res) => {
  const { tema, pregunta, respuesta } = req.body;
  if (!respuesta) return res.status(400).json({ error: "Falta la respuesta." });

  const prompt = `Eres un profesor evaluando la respuesta de un estudiante.

Tema: ${tema || "General"}
Pregunta: ${pregunta || "Explica el tema"}
Respuesta del estudiante: ${respuesta}

Evalúa la respuesta y responde en este formato exacto JSON:
{"calificacion": (número del 1 al 10), "retroalimentacion": "(feedback detallado)", "puntos_buenos": ["punto1", "punto2"], "areas_mejora": ["area1", "area2"]}

Responde SOLO con el JSON.`;

  try {
    const text = await generateText(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al parsear calificación." });
    }
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al calificar. Intenta de nuevo." });
  }
});

// ── Endpoint: Compartir tarea ──────────────────────────────────────
app.post("/api/compartir", (req, res) => {
  const { tema, tipo, nivel, secciones, textoCompleto } = req.body;
  const id = randomBytes(4).toString("hex");
  sharedTasks.set(id, { tema, tipo, nivel, secciones, textoCompleto, createdAt: Date.now() });
  for (const [key, val] of sharedTasks) {
    if (Date.now() - val.createdAt > 86400000) sharedTasks.delete(key);
  }
  res.json({ id });
});

app.get("/api/compartir/:id", (req, res) => {
  const data = sharedTasks.get(req.params.id);
  if (!data) return res.status(404).json({ error: "Tarea no encontrada o expirada." });
  res.json(data);
});

// ── Endpoint: Generar flashcards ───────────────────────────────────
app.post("/api/flashcards", async (req, res) => {
  const { tema, texto } = req.body;
  if (!tema) return res.status(400).json({ error: "Falta el tema." });

  const prompt = `Genera 10 flashcards de estudio sobre "${tema}" basadas en este contenido:

${texto || tema}

Responde SOLO en formato JSON:
[{"frente": "pregunta o concepto", "reverso": "respuesta o definición"}]`;

  try {
    const text = await generateText(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const flashcards = JSON.parse(jsonMatch[0]);
      res.json({ flashcards });
    } else {
      res.status(500).json({ error: "Error al generar flashcards." });
    }
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al generar flashcards. Intenta de nuevo." });
  }
});

// ── Endpoint: Generar examen ───────────────────────────────────────
app.post("/api/examen", async (req, res) => {
  const { tema, texto, numPreguntas } = req.body;
  if (!tema) return res.status(400).json({ error: "Falta el tema." });

  const n = numPreguntas || 5;
  const prompt = `Genera un examen de ${n} preguntas abiertas sobre "${tema}" basado en este contenido:

${texto || tema}

Las preguntas deben requerir respuestas desarrolladas (no sí/no). Varía la dificultad.
Responde SOLO en formato JSON:
[{"pregunta": "...", "respuesta_esperada": "puntos clave que debería mencionar una buena respuesta"}]`;

  try {
    const text = await generateText(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const preguntas = JSON.parse(jsonMatch[0]);
      res.json({ preguntas });
    } else {
      res.status(500).json({ error: "Error al generar examen." });
    }
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al generar examen. Intenta de nuevo." });
  }
});

// ── Endpoint: Evaluar examen completo ─────────────────────────────
app.post("/api/evaluar-examen", async (req, res) => {
  const { tema, respuestas } = req.body;
  if (!respuestas || !respuestas.length) return res.status(400).json({ error: "Faltan respuestas." });

  const resumenRespuestas = respuestas.map((r, i) =>
    `Pregunta ${i + 1}: ${r.pregunta}\nRespuesta esperada: ${r.respuesta_esperada}\nRespuesta del estudiante: ${r.respuesta || "(sin respuesta)"}`
  ).join("\n\n");

  const prompt = `Eres un profesor evaluando un examen de un estudiante sobre "${tema}".

${resumenRespuestas}

Evalúa cada respuesta y da una calificación general. Responde en JSON:
{"calificacion_general": (1-10), "detalle": [{"pregunta": 1, "puntaje": (1-10), "comentario": "..."}], "resumen": "feedback general"}

Responde SOLO con el JSON.`;

  try {
    const text = await generateText(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al evaluar examen." });
    }
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al evaluar. Intenta de nuevo." });
  }
});

// ── Endpoint: Detector de originalidad ─────────────────────────────
app.post("/api/originalidad", async (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: "Falta el texto." });

  const prompt = `Analiza el siguiente texto escolar y evalúa qué tan natural/humano suena vs generado por IA.

Texto:
${texto.slice(0, 3000)}

Responde SOLO en formato JSON:
{
  "puntaje_humano": (0-100, donde 100 = suena completamente humano),
  "indicadores_ia": ["lista de frases o patrones que suenan artificiales"],
  "indicadores_humanos": ["lista de elementos que suenan naturales"],
  "sugerencias": ["cómo hacerlo sonar más natural"],
  "veredicto": "breve resumen de 1-2 oraciones"
}`;

  try {
    const text = await generateText(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al analizar originalidad." });
    }
  } catch (err) {
    console.error("Error AI:", err.message);
    res.status(500).json({ error: "Error al analizar. Intenta de nuevo." });
  }
});

// ── Endpoint: Buscar imágenes (Wikimedia Commons) ──────────────────
app.get("/api/imagenes", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Falta el término de búsqueda." });

  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=8&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=400&format=json&origin=*`;
    const response = await fetch(url);
    const data = await response.json();

    const images = [];
    if (data.query && data.query.pages) {
      for (const page of Object.values(data.query.pages)) {
        if (page.imageinfo && page.imageinfo[0]) {
          const info = page.imageinfo[0];
          const meta = info.extmetadata || {};
          images.push({
            thumb: info.thumburl || info.url,
            full: info.url,
            title: page.title.replace("File:", "").replace(/\.\w+$/, ""),
            author: meta.Artist ? meta.Artist.value.replace(/<[^>]*>/g, "") : "Wikimedia Commons",
            license: meta.LicenseShortName ? meta.LicenseShortName.value : "CC",
          });
        }
      }
    }
    res.json({ images });
  } catch (err) {
    console.error("Error images:", err.message);
    res.status(500).json({ error: "Error al buscar imágenes." });
  }
});

// ── Socket.io: Colaboración en tiempo real ─────────────────────────
const collabRooms = new Map();

io.on("connection", (socket) => {
  let currentRoom = null;

  socket.on("create-room", (data) => {
    const roomId = randomBytes(3).toString("hex");
    collabRooms.set(roomId, {
      host: socket.id,
      tema: data.tema || "",
      secciones: data.secciones || {},
      textoCompleto: data.textoCompleto || "",
      users: new Set([socket.id]),
      notes: [],
      createdAt: Date.now(),
    });
    currentRoom = roomId;
    socket.join(roomId);
    socket.emit("room-created", { roomId, isHost: true });
  });

  socket.on("join-room", (roomId) => {
    const room = collabRooms.get(roomId);
    if (!room) { socket.emit("room-error", "Sala no encontrada."); return; }
    currentRoom = roomId;
    room.users.add(socket.id);
    socket.join(roomId);
    socket.emit("room-joined", {
      roomId,
      tema: room.tema,
      secciones: room.secciones,
      textoCompleto: room.textoCompleto,
      notes: room.notes,
      userCount: room.users.size,
      isHost: false,
    });
    io.to(roomId).emit("user-count", room.users.size);
  });

  socket.on("update-content", (data) => {
    if (!currentRoom) return;
    const room = collabRooms.get(currentRoom);
    if (!room) return;
    room.secciones = data.secciones;
    room.textoCompleto = data.textoCompleto;
    room.tema = data.tema || room.tema;
    socket.to(currentRoom).emit("content-updated", {
      secciones: room.secciones,
      textoCompleto: room.textoCompleto,
      tema: room.tema,
    });
  });

  socket.on("send-note", (text) => {
    if (!currentRoom) return;
    const room = collabRooms.get(currentRoom);
    if (!room) return;
    const note = { text, id: socket.id.slice(0, 4), timestamp: Date.now() };
    room.notes.push(note);
    if (room.notes.length > 50) room.notes.shift();
    io.to(currentRoom).emit("new-note", note);
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      const room = collabRooms.get(currentRoom);
      if (room) {
        room.users.delete(socket.id);
        io.to(currentRoom).emit("user-count", room.users.size);
        if (room.users.size === 0) collabRooms.delete(currentRoom);
      }
    }
  });
});

// Clean old rooms every hour
setInterval(() => {
  for (const [key, room] of collabRooms) {
    if (Date.now() - room.createdAt > 3600000) collabRooms.delete(key);
  }
}, 3600000);

// ── Construir prompt estructurado ──────────────────────────────────
function buildPrompt(tema, nivel, tipo, idioma, personas) {
  const nivelTexto = { facil: "básico y sencillo", medio: "intermedio con buen detalle", dificil: "avanzado y profundo" };
  const tipoTexto = {
    tarea: "tarea escolar",
    exposicion: "exposición oral",
    resumen: "resumen académico",
    ensayo: "ensayo argumentativo",
    mapa_conceptual: "mapa conceptual detallado (usar listas jerárquicas y relaciones entre conceptos)",
    linea_tiempo: "línea de tiempo cronológica (listar eventos con fechas y descripciones)"
  };

  const idiomaTexto = {
    es: "español", en: "inglés", fr: "francés", pt: "portugués", de: "alemán"
  };

  let prompt = `Eres un asistente educativo. Genera un trabajo escolar completo sobre el tema indicado.
IMPORTANTE: Escribe TODO el contenido en ${idiomaTexto[idioma] || "español"}.

TEMA: ${tema}
NIVEL DE DIFICULTAD: ${nivelTexto[nivel] || nivel}
TIPO DE TRABAJO: ${tipoTexto[tipo] || tipo}`;

  if (personas && personas > 1) {
    prompt += `\nNÚMERO DE PERSONAS: ${personas} (distribuye el contenido para que ${personas} personas puedan participar equitativamente)`;
  }

  prompt += `

INSTRUCCIONES IMPORTANTES:
- Escribe como un estudiante real, con lenguaje natural y accesible.
- El contenido debe ser preciso, educativo y bien organizado.
- Adapta la complejidad y extensión al nivel de dificultad indicado.
- TODO debe estar en ${idiomaTexto[idioma] || "español"}.

Genera el contenido usando EXACTAMENTE estas secciones con estos encabezados:

## Resumen
(Un resumen claro y conciso del tema)

## Explicación
(Explicación detallada del tema, con conceptos clave bien desarrollados)

## Exposición
(Contenido preparado para presentar oralmente: introducción, desarrollo, cierre${personas && personas > 1 ? `, dividido para ${personas} participantes` : ""})

## Ideas Visuales
(Sugerencias de recursos visuales: diagramas, mapas mentales, imágenes, gráficos que complementen el trabajo)

## Preguntas y Respuestas
(5-8 preguntas con sus respuestas sobre el tema, útiles para estudiar o preparar una exposición)

## Bibliografía
(5-8 referencias bibliográficas relevantes sobre el tema: libros, artículos, sitios web educativos. Usa formato APA.)`;

  return prompt;
}

// ── Parsear secciones del texto generado ───────────────────────────
function parseSections(text) {
  const sectionMap = {
    resumen: "",
    explicacion: "",
    exposicion: "",
    ideas_visuales: "",
    preguntas: "",
    bibliografia: "",
  };

  const patterns = [
    { key: "resumen", regex: /##\s*Resumen\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "explicacion", regex: /##\s*Explicaci[oó]n\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "exposicion", regex: /##\s*Exposici[oó]n\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "ideas_visuales", regex: /##\s*Ideas?\s*Visuales?\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "preguntas", regex: /##\s*Preguntas?\s*(y|&)\s*Respuestas?\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "bibliografia", regex: /##\s*Bibliograf[ií]a\s*\n([\s\S]*?)(?=##\s|$)/ },
  ];

  for (const { key, regex } of patterns) {
    const match = text.match(regex);
    if (match) {
      sectionMap[key] = (key === "preguntas" ? match[2] : match[1]).trim();
    }
  }

  const hasContent = Object.values(sectionMap).some((v) => v.length > 0);
  if (!hasContent) {
    sectionMap.resumen = text;
  }

  return sectionMap;
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, "0.0.0.0", () => console.log(`SchoolIA corriendo en http://localhost:${PORT}`));
