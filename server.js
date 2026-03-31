import "dotenv/config";
import express from "express";
import Groq from "groq-sdk";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, "public")));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateText(prompt) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 4096,
  });
  return chatCompletion.choices[0]?.message?.content || "";
}

// ── Endpoint principal: Generar tarea ──────────────────────────────
app.post("/api/generar", async (req, res) => {
  const { tema, nivel, tipo, idioma, personas } = req.body;

  if (!tema || !nivel || !tipo) {
    return res.status(400).json({ error: "Faltan campos requeridos: tema, nivel y tipo." });
  }

  const prompt = buildPrompt(tema, nivel, tipo, idioma || "es", personas);

  try {
    const text = await generateText(prompt);
    const secciones = parseSections(text);
    res.json({ secciones, textoCompleto: text });
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
(5-8 preguntas con sus respuestas sobre el tema, útiles para estudiar o preparar una exposición)`;

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
  };

  const patterns = [
    { key: "resumen", regex: /##\s*Resumen\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "explicacion", regex: /##\s*Explicaci[oó]n\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "exposicion", regex: /##\s*Exposici[oó]n\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "ideas_visuales", regex: /##\s*Ideas?\s*Visuales?\s*\n([\s\S]*?)(?=##\s|$)/ },
    { key: "preguntas", regex: /##\s*Preguntas?\s*(y|&)\s*Respuestas?\s*\n([\s\S]*?)(?=##\s|$)/ },
  ];

  for (const { key, regex } of patterns) {
    const match = text.match(regex);
    if (match) {
      // For "preguntas" the content is in group 2 (because of the (y|&) group)
      sectionMap[key] = (key === "preguntas" ? match[2] : match[1]).trim();
    }
  }

  // If parsing failed, put everything in "resumen" as fallback
  const hasContent = Object.values(sectionMap).some((v) => v.length > 0);
  if (!hasContent) {
    sectionMap.resumen = text;
  }

  return sectionMap;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`SchoolIA corriendo en http://localhost:${PORT}`));
