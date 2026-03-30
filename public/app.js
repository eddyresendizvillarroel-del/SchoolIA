const { createApp, ref, computed, reactive } = Vue;

createApp({
  setup() {
    // ── Estado ─────────────────────────────────────────────────────
    const form = reactive({
      tema: "",
      nivel: "medio",
      tipo: "tarea",
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
      const map = { tarea: "Tarea", exposicion: "Exposición", resumen: "Resumen" };
      return map[form.tipo] || form.tipo;
    });

    const nivelLabel = computed(() => {
      const map = { facil: "Fácil", medio: "Medio", dificil: "Difícil" };
      return map[form.nivel] || form.nivel;
    });

    // ── Helpers ────────────────────────────────────────────────────
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
            personas: form.personas || null,
          }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        updateSections(data);
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

    return {
      form, secciones, textoCompleto, loading, error,
      activeTab, copiado, sidebarOpen, hasResult,
      tabs, tipoLabel, nivelLabel,
      generar, humanizar, acortar, copiarTodo, renderMarkdown,
    };
  },
}).mount("#app");
