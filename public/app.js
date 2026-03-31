const { createApp, ref, computed, reactive, onMounted } = Vue;

createApp({
  setup() {
    // ── Estado ─────────────────────────────────────────────────────
    const form = reactive({
      tema: "",
      nivel: "medio",
      tipo: "tarea",
      idioma: "es",
      personas: null,
    });

    const secciones = reactive({
      resumen: "",
      explicacion: "",
      exposicion: "",
      ideas_visuales: "",
      preguntas: "",
    });

    const textoCompleto = ref("");
    const loading = ref(false);
    const error = ref("");
    const activeTab = ref("resumen");
    const copiado = ref(false);
    const sidebarOpen = ref(false);
    const darkMode = ref(true);
    const historial = ref([]);

    const hasResult = computed(() =>
      Object.values(secciones).some((v) => v.length > 0)
    );

    const tabs = [
      { key: "resumen", label: "Resumen", icon: "📋" },
      { key: "explicacion", label: "Explicación", icon: "📖" },
      { key: "exposicion", label: "Exposición", icon: "🎤" },
      { key: "ideas_visuales", label: "Ideas Visuales", icon: "💡" },
      { key: "preguntas", label: "Preguntas y Respuestas", icon: "❓" },
    ];

    const tipoLabel = computed(() => {
      const map = {
        tarea: "Tarea", exposicion: "Exposición", resumen: "Resumen",
        ensayo: "Ensayo", mapa_conceptual: "Mapa Conceptual", linea_tiempo: "Línea de Tiempo"
      };
      return map[form.tipo] || form.tipo;
    });

    const nivelLabel = computed(() => {
      const map = { facil: "Fácil", medio: "Medio", dificil: "Difícil" };
      return map[form.nivel] || form.nivel;
    });

    const wordCount = computed(() => {
      return countWords(textoCompleto.value);
    });

    // ── Helpers ────────────────────────────────────────────────────
    function countWords(text) {
      if (!text) return 0;
      return text.trim().split(/\s+/).filter(w => w.length > 0).length;
    }

    function showError(msg) {
      error.value = msg;
      setTimeout(() => (error.value = ""), 4000);
    }

    function updateSections(data) {
      Object.assign(secciones, data.secciones);
      textoCompleto.value = data.textoCompleto;
    }

    function renderMarkdown(text) {
      if (!text) return '<p class="empty-section">Esta sección no tiene contenido aún.</p>';
      return marked.parse(text);
    }

    // ── Tema claro/oscuro ──────────────────────────────────────────
    function toggleTheme() {
      darkMode.value = !darkMode.value;
      document.body.classList.toggle("light-mode", !darkMode.value);
      localStorage.setItem("schoolia-theme", darkMode.value ? "dark" : "light");
    }

    // ── Historial ──────────────────────────────────────────────────
    function guardarHistorial() {
      const entry = {
        tema: form.tema,
        nivel: form.nivel,
        tipo: form.tipo,
        idioma: form.idioma,
        personas: form.personas,
        tipoLabel: tipoLabel.value,
        fecha: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
        secciones: { ...secciones },
        textoCompleto: textoCompleto.value,
      };
      historial.value.unshift(entry);
      if (historial.value.length > 20) historial.value.pop();
      localStorage.setItem("schoolia-historial", JSON.stringify(historial.value));
    }

    function cargarHistorial(index) {
      const item = historial.value[index];
      form.tema = item.tema;
      form.nivel = item.nivel;
      form.tipo = item.tipo;
      form.idioma = item.idioma || "es";
      form.personas = item.personas;
      Object.assign(secciones, item.secciones);
      textoCompleto.value = item.textoCompleto;
      activeTab.value = "resumen";
      sidebarOpen.value = false;
    }

    function limpiarHistorial() {
      historial.value = [];
      localStorage.removeItem("schoolia-historial");
    }

    // ── Exportar PDF ───────────────────────────────────────────────
    function exportarPDF() {
      const content = buildExportHTML();
      const win = window.open("", "_blank");
      win.document.write(content);
      win.document.close();
      setTimeout(() => { win.print(); }, 500);
    }

    // ── Exportar Word ──────────────────────────────────────────────
    function exportarWord() {
      const content = buildExportHTML();
      const blob = new Blob([content], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.tema || "tarea"}.doc`;
      a.click();
      URL.revokeObjectURL(url);
    }

    function buildExportHTML() {
      let html = `<html><head><meta charset="UTF-8"><title>${form.tema}</title>
        <style>body{font-family:Arial,sans-serif;padding:40px;color:#222;line-height:1.8;}
        h1{color:#10a37f;border-bottom:2px solid #10a37f;padding-bottom:8px;}
        h2{color:#333;margin-top:28px;}
        ul,ol{margin-left:20px;}
        .meta{color:#666;font-size:14px;margin-bottom:24px;}
        .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;margin-right:6px;background:#e0f5ee;color:#10a37f;}
        </style></head><body>`;
      html += `<h1>${form.tema}</h1>`;
      html += `<div class="meta"><span class="badge">${tipoLabel.value}</span><span class="badge">${nivelLabel.value}</span><span class="badge">${wordCount.value} palabras</span></div>`;
      for (const tab of tabs) {
        if (secciones[tab.key]) {
          html += `<h2>${tab.icon} ${tab.label}</h2>`;
          html += marked.parse(secciones[tab.key]);
        }
      }
      html += `<hr><p style="color:#999;font-size:12px;text-align:center;">Generado con SchoolIA</p></body></html>`;
      return html;
    }

    // ── API calls ──────────────────────────────────────────────────
    async function generar() {
      if (!form.tema.trim()) return;
      loading.value = true;
      error.value = "";
      activeTab.value = "resumen";
      sidebarOpen.value = false;

      try {
        const res = await fetch("/api/generar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tema: form.tema.trim(),
            nivel: form.nivel,
            tipo: form.tipo,
            idioma: form.idioma,
            personas: form.personas || null,
          }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        updateSections(data);
        guardarHistorial();
      } catch {
        showError("Error de conexión. Verifica que el servidor esté corriendo.");
      } finally {
        loading.value = false;
      }
    }

    async function humanizar() {
      if (!textoCompleto.value) return;
      loading.value = true;
      try {
        const res = await fetch("/api/humanizar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto: textoCompleto.value }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        updateSections(data);
      } catch {
        showError("Error de conexión.");
      } finally {
        loading.value = false;
      }
    }

    async function acortar() {
      if (!textoCompleto.value) return;
      loading.value = true;
      try {
        const res = await fetch("/api/acortar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto: textoCompleto.value }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        updateSections(data);
      } catch {
        showError("Error de conexión.");
      } finally {
        loading.value = false;
      }
    }

    async function copiarTodo() {
      const parts = [];
      for (const tab of tabs) {
        if (secciones[tab.key]) {
          parts.push(`${tab.label.toUpperCase()}\n${"=".repeat(tab.label.length)}\n${secciones[tab.key]}`);
        }
      }
      try {
        await navigator.clipboard.writeText(parts.join("\n\n"));
        copiado.value = true;
        setTimeout(() => (copiado.value = false), 2000);
      } catch {
        showError("No se pudo copiar al portapapeles.");
      }
    }

    // ── Init ───────────────────────────────────────────────────────
    onMounted(() => {
      // Load theme
      const savedTheme = localStorage.getItem("schoolia-theme");
      if (savedTheme === "light") {
        darkMode.value = false;
        document.body.classList.add("light-mode");
      }
      // Load history
      try {
        const saved = localStorage.getItem("schoolia-historial");
        if (saved) historial.value = JSON.parse(saved);
      } catch {}
    });

    return {
      form, secciones, textoCompleto, loading, error,
      activeTab, copiado, sidebarOpen, hasResult, darkMode, historial,
      tabs, tipoLabel, nivelLabel, wordCount,
      generar, humanizar, acortar, copiarTodo, renderMarkdown,
      toggleTheme, cargarHistorial, limpiarHistorial,
      exportarPDF, exportarWord, countWords,
    };
  },
}).mount("#app");
