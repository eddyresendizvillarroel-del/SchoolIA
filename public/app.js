const { createApp, ref, computed, reactive, onMounted, watch } = Vue;

// ── Traducciones ─────────────────────────────────────────────────
const i18n = {
  es: {
    generateTask: "Genera tu tarea",
    topic: "Tema",
    topicPlaceholder: "Ej: La Revolución Francesa",
    language: "Idioma",
    difficulty: "Nivel de dificultad",
    easy: "Fácil", medium: "Medio", hard: "Difícil",
    workType: "Tipo de trabajo",
    task: "Tarea", presentation: "Exposición", summary: "Resumen",
    essay: "Ensayo", conceptMap: "Mapa Conceptual", timeline: "Línea de Tiempo",
    people: "Personas", optional: "(opcional)",
    generating: "Generando...", generate: "Generar tarea",
    history: "Historial", clearHistory: "Limpiar historial",
    welcome: "Bienvenido a SchoolIA",
    welcomeDesc: "Ingresa un tema en el panel izquierdo y genera tu tarea escolar completa al instante con inteligencia artificial.",
    summaryExpl: "Resumen y explicación",
    readyPresent: "Listo para exponer",
    visualIdeas: "Ideas visuales",
    qAndA: "Preguntas y respuestas",
    exportPdf: "Exportar a PDF",
    multiLang: "Multi-idioma",
    generatingAbout: "Generando tu tarea sobre",
    analyzing: "Analizando el tema...",
    creating: "Creando contenido estructurado...",
    preparing: "Preparando las secciones...",
    humanize: "Humanizar", shorten: "Más corto",
    copyAll: "Copiar todo", copied: "¡Copiado!",
    processing: "Procesando cambios...",
    words: "palabras",
    tabSummary: "Resumen", tabExplanation: "Explicación",
    tabPresentation: "Exposición", tabVisualIdeas: "Ideas Visuales",
    tabQA: "Preguntas y Respuestas", tabBibliography: "Bibliografía",
    expand: "Ampliar",
    chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Calificador", share: "Compartir", timer: "Pomodoro",
    chatPlaceholder: "Pregunta algo sobre el tema...",
    send: "Enviar",
    quizTitle: "Quiz - Pon a prueba tu conocimiento",
    checkAnswers: "Verificar respuestas",
    score: "Puntuación",
    correct: "Correcta", incorrect: "Incorrecta",
    flashcardsTitle: "Flashcards de estudio",
    clickToFlip: "Click para voltear",
    prev: "Anterior", next: "Siguiente",
    graderTitle: "Calificador de respuestas",
    questionLabel: "Pregunta",
    questionPlaceholder: "Escribe la pregunta...",
    answerLabel: "Tu respuesta",
    answerPlaceholder: "Escribe tu respuesta aquí...",
    grade: "Calificar",
    gradeResult: "Calificación",
    goodPoints: "Puntos buenos",
    improvements: "Áreas de mejora",
    shareTitle: "Compartir tarea",
    shareDesc: "Genera un link para compartir esta tarea. El link expira en 24 horas.",
    shareGenerate: "Generar link",
    shareCopied: "¡Link copiado!",
    timerWork: "Trabajo", timerBreak: "Descanso",
    timerStart: "Iniciar", timerPause: "Pausar", timerReset: "Reiniciar",
    poweredBy: "Powered by IA",
    loadingQuiz: "Generando quiz...",
    loadingFlashcards: "Generando flashcards...",
    loadingGrade: "Calificando...",
    loadingChat: "Pensando...",
    loadingShare: "Generando link...",
    loadingExpand: "Ampliando sección...",
    of: "de",
  },
  en: {
    generateTask: "Generate your task",
    topic: "Topic",
    topicPlaceholder: "E.g.: The French Revolution",
    language: "Language",
    difficulty: "Difficulty level",
    easy: "Easy", medium: "Medium", hard: "Hard",
    workType: "Work type",
    task: "Homework", presentation: "Presentation", summary: "Summary",
    essay: "Essay", conceptMap: "Concept Map", timeline: "Timeline",
    people: "People", optional: "(optional)",
    generating: "Generating...", generate: "Generate task",
    history: "History", clearHistory: "Clear history",
    welcome: "Welcome to SchoolIA",
    welcomeDesc: "Enter a topic in the left panel and generate your complete school assignment instantly with artificial intelligence.",
    summaryExpl: "Summary and explanation",
    readyPresent: "Ready to present",
    visualIdeas: "Visual ideas",
    qAndA: "Questions and answers",
    exportPdf: "Export to PDF",
    multiLang: "Multi-language",
    generatingAbout: "Generating your task about",
    analyzing: "Analyzing the topic...",
    creating: "Creating structured content...",
    preparing: "Preparing sections...",
    humanize: "Humanize", shorten: "Shorten",
    copyAll: "Copy all", copied: "Copied!",
    processing: "Processing changes...",
    words: "words",
    tabSummary: "Summary", tabExplanation: "Explanation",
    tabPresentation: "Presentation", tabVisualIdeas: "Visual Ideas",
    tabQA: "Questions & Answers", tabBibliography: "Bibliography",
    expand: "Expand",
    chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Grader", share: "Share", timer: "Pomodoro",
    chatPlaceholder: "Ask something about the topic...",
    send: "Send",
    quizTitle: "Quiz - Test your knowledge",
    checkAnswers: "Check answers",
    score: "Score",
    correct: "Correct", incorrect: "Incorrect",
    flashcardsTitle: "Study Flashcards",
    clickToFlip: "Click to flip",
    prev: "Previous", next: "Next",
    graderTitle: "Answer Grader",
    questionLabel: "Question",
    questionPlaceholder: "Write the question...",
    answerLabel: "Your answer",
    answerPlaceholder: "Write your answer here...",
    grade: "Grade",
    gradeResult: "Grade",
    goodPoints: "Good points",
    improvements: "Areas to improve",
    shareTitle: "Share task",
    shareDesc: "Generate a link to share this task. Link expires in 24 hours.",
    shareGenerate: "Generate link",
    shareCopied: "Link copied!",
    timerWork: "Work", timerBreak: "Break",
    timerStart: "Start", timerPause: "Pause", timerReset: "Reset",
    poweredBy: "Powered by AI",
    loadingQuiz: "Generating quiz...",
    loadingFlashcards: "Generating flashcards...",
    loadingGrade: "Grading...",
    loadingChat: "Thinking...",
    loadingShare: "Generating link...",
    loadingExpand: "Expanding section...",
    of: "of",
  },
  fr: {
    generateTask: "Génère ton devoir",
    topic: "Sujet",
    topicPlaceholder: "Ex: La Révolution Française",
    language: "Langue",
    difficulty: "Niveau de difficulté",
    easy: "Facile", medium: "Moyen", hard: "Difficile",
    workType: "Type de travail",
    task: "Devoir", presentation: "Exposé", summary: "Résumé",
    essay: "Essai", conceptMap: "Carte Conceptuelle", timeline: "Chronologie",
    people: "Personnes", optional: "(optionnel)",
    generating: "Génération...", generate: "Générer le devoir",
    history: "Historique", clearHistory: "Effacer l'historique",
    welcome: "Bienvenue sur SchoolIA",
    welcomeDesc: "Entrez un sujet dans le panneau de gauche et générez votre devoir scolaire complet instantanément avec l'intelligence artificielle.",
    summaryExpl: "Résumé et explication",
    readyPresent: "Prêt à présenter",
    visualIdeas: "Idées visuelles",
    qAndA: "Questions et réponses",
    exportPdf: "Exporter en PDF",
    multiLang: "Multi-langue",
    generatingAbout: "Génération de votre devoir sur",
    analyzing: "Analyse du sujet...",
    creating: "Création du contenu...",
    preparing: "Préparation des sections...",
    humanize: "Humaniser", shorten: "Raccourcir",
    copyAll: "Tout copier", copied: "Copié!",
    processing: "Traitement en cours...",
    words: "mots",
    tabSummary: "Résumé", tabExplanation: "Explication",
    tabPresentation: "Exposé", tabVisualIdeas: "Idées Visuelles",
    tabQA: "Questions et Réponses", tabBibliography: "Bibliographie",
    expand: "Développer",
    chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Correcteur", share: "Partager", timer: "Pomodoro",
    chatPlaceholder: "Posez une question sur le sujet...",
    send: "Envoyer",
    quizTitle: "Quiz - Testez vos connaissances",
    checkAnswers: "Vérifier",
    score: "Score",
    correct: "Correct", incorrect: "Incorrect",
    flashcardsTitle: "Flashcards d'étude",
    clickToFlip: "Cliquez pour retourner",
    prev: "Précédent", next: "Suivant",
    graderTitle: "Correcteur de réponses",
    questionLabel: "Question",
    questionPlaceholder: "Écrivez la question...",
    answerLabel: "Votre réponse",
    answerPlaceholder: "Écrivez votre réponse ici...",
    grade: "Corriger",
    gradeResult: "Note",
    goodPoints: "Points positifs",
    improvements: "Points à améliorer",
    shareTitle: "Partager le devoir",
    shareDesc: "Générez un lien pour partager ce devoir. Le lien expire dans 24 heures.",
    shareGenerate: "Générer le lien",
    shareCopied: "Lien copié!",
    timerWork: "Travail", timerBreak: "Pause",
    timerStart: "Démarrer", timerPause: "Pause", timerReset: "Réinitialiser",
    poweredBy: "Propulsé par IA",
    loadingQuiz: "Génération du quiz...",
    loadingFlashcards: "Génération des flashcards...",
    loadingGrade: "Correction...",
    loadingChat: "Réflexion...",
    loadingShare: "Génération du lien...",
    loadingExpand: "Développement...",
    of: "de",
  },
  pt: {
    generateTask: "Gere sua tarefa",
    topic: "Tema",
    topicPlaceholder: "Ex: A Revolução Francesa",
    language: "Idioma",
    difficulty: "Nível de dificuldade",
    easy: "Fácil", medium: "Médio", hard: "Difícil",
    workType: "Tipo de trabalho",
    task: "Tarefa", presentation: "Apresentação", summary: "Resumo",
    essay: "Ensaio", conceptMap: "Mapa Conceitual", timeline: "Linha do Tempo",
    people: "Pessoas", optional: "(opcional)",
    generating: "Gerando...", generate: "Gerar tarefa",
    history: "Histórico", clearHistory: "Limpar histórico",
    welcome: "Bem-vindo ao SchoolIA",
    welcomeDesc: "Digite um tema no painel esquerdo e gere sua tarefa escolar completa instantaneamente com inteligência artificial.",
    summaryExpl: "Resumo e explicação", readyPresent: "Pronto para apresentar",
    visualIdeas: "Ideias visuais", qAndA: "Perguntas e respostas",
    exportPdf: "Exportar para PDF", multiLang: "Multi-idioma",
    generatingAbout: "Gerando sua tarefa sobre",
    analyzing: "Analisando o tema...", creating: "Criando conteúdo...", preparing: "Preparando seções...",
    humanize: "Humanizar", shorten: "Encurtar",
    copyAll: "Copiar tudo", copied: "Copiado!",
    processing: "Processando...", words: "palavras",
    tabSummary: "Resumo", tabExplanation: "Explicação",
    tabPresentation: "Apresentação", tabVisualIdeas: "Ideias Visuais",
    tabQA: "Perguntas e Respostas", tabBibliography: "Bibliografia",
    expand: "Expandir",
    chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Avaliador", share: "Compartilhar", timer: "Pomodoro",
    chatPlaceholder: "Pergunte algo sobre o tema...", send: "Enviar",
    quizTitle: "Quiz - Teste seu conhecimento", checkAnswers: "Verificar",
    score: "Pontuação", correct: "Correta", incorrect: "Incorreta",
    flashcardsTitle: "Flashcards de estudo", clickToFlip: "Clique para virar",
    prev: "Anterior", next: "Próximo",
    graderTitle: "Avaliador de respostas",
    questionLabel: "Pergunta", questionPlaceholder: "Escreva a pergunta...",
    answerLabel: "Sua resposta", answerPlaceholder: "Escreva sua resposta aqui...",
    grade: "Avaliar", gradeResult: "Nota",
    goodPoints: "Pontos positivos", improvements: "Áreas para melhorar",
    shareTitle: "Compartilhar tarefa",
    shareDesc: "Gere um link para compartilhar esta tarefa. O link expira em 24 horas.",
    shareGenerate: "Gerar link", shareCopied: "Link copiado!",
    timerWork: "Trabalho", timerBreak: "Pausa",
    timerStart: "Iniciar", timerPause: "Pausar", timerReset: "Reiniciar",
    poweredBy: "Powered by IA",
    loadingQuiz: "Gerando quiz...", loadingFlashcards: "Gerando flashcards...",
    loadingGrade: "Avaliando...", loadingChat: "Pensando...",
    loadingShare: "Gerando link...", loadingExpand: "Expandindo...",
    of: "de",
  },
  de: {
    generateTask: "Aufgabe erstellen",
    topic: "Thema",
    topicPlaceholder: "Z.B.: Die Französische Revolution",
    language: "Sprache",
    difficulty: "Schwierigkeitsgrad",
    easy: "Leicht", medium: "Mittel", hard: "Schwer",
    workType: "Arbeitstyp",
    task: "Hausaufgabe", presentation: "Präsentation", summary: "Zusammenfassung",
    essay: "Aufsatz", conceptMap: "Konzeptkarte", timeline: "Zeitleiste",
    people: "Personen", optional: "(optional)",
    generating: "Wird erstellt...", generate: "Aufgabe erstellen",
    history: "Verlauf", clearHistory: "Verlauf löschen",
    welcome: "Willkommen bei SchoolIA",
    welcomeDesc: "Geben Sie ein Thema im linken Panel ein und erstellen Sie sofort Ihre Schulaufgabe mit künstlicher Intelligenz.",
    summaryExpl: "Zusammenfassung und Erklärung", readyPresent: "Bereit zum Präsentieren",
    visualIdeas: "Visuelle Ideen", qAndA: "Fragen und Antworten",
    exportPdf: "Als PDF exportieren", multiLang: "Mehrsprachig",
    generatingAbout: "Erstelle Aufgabe über",
    analyzing: "Thema analysieren...", creating: "Inhalt erstellen...", preparing: "Abschnitte vorbereiten...",
    humanize: "Vermenschlichen", shorten: "Kürzen",
    copyAll: "Alles kopieren", copied: "Kopiert!",
    processing: "Verarbeitung...", words: "Wörter",
    tabSummary: "Zusammenfassung", tabExplanation: "Erklärung",
    tabPresentation: "Präsentation", tabVisualIdeas: "Visuelle Ideen",
    tabQA: "Fragen & Antworten", tabBibliography: "Bibliografie",
    expand: "Erweitern",
    chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Bewerter", share: "Teilen", timer: "Pomodoro",
    chatPlaceholder: "Stellen Sie eine Frage zum Thema...", send: "Senden",
    quizTitle: "Quiz - Testen Sie Ihr Wissen", checkAnswers: "Überprüfen",
    score: "Punktzahl", correct: "Richtig", incorrect: "Falsch",
    flashcardsTitle: "Lernkarten", clickToFlip: "Klicken zum Umdrehen",
    prev: "Zurück", next: "Weiter",
    graderTitle: "Antwortbewerter",
    questionLabel: "Frage", questionPlaceholder: "Schreiben Sie die Frage...",
    answerLabel: "Ihre Antwort", answerPlaceholder: "Schreiben Sie Ihre Antwort hier...",
    grade: "Bewerten", gradeResult: "Note",
    goodPoints: "Gute Punkte", improvements: "Verbesserungsbereiche",
    shareTitle: "Aufgabe teilen",
    shareDesc: "Erstellen Sie einen Link zum Teilen. Der Link läuft in 24 Stunden ab.",
    shareGenerate: "Link erstellen", shareCopied: "Link kopiert!",
    timerWork: "Arbeit", timerBreak: "Pause",
    timerStart: "Starten", timerPause: "Pausieren", timerReset: "Zurücksetzen",
    poweredBy: "Powered by KI",
    loadingQuiz: "Quiz wird erstellt...", loadingFlashcards: "Flashcards werden erstellt...",
    loadingGrade: "Bewertung...", loadingChat: "Denke nach...",
    loadingShare: "Link wird erstellt...", loadingExpand: "Wird erweitert...",
    of: "von",
  },
};

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
      bibliografia: "",
    });

    const textoCompleto = ref("");
    const loading = ref(false);
    const error = ref("");
    const activeTab = ref("resumen");
    const copiado = ref(false);
    const sidebarOpen = ref(false);
    const darkMode = ref(true);
    const historial = ref([]);
    const streamingText = ref("");
    const isStreaming = ref(false);

    // Tools state
    const activePanel = ref(""); // chat, quiz, flashcards, grader, share, timer
    const chatMessages = ref([]);
    const chatInput = ref("");
    const chatLoading = ref(false);
    const quizData = ref(null);
    const quizAnswers = reactive({});
    const quizChecked = ref(false);
    const quizLoading = ref(false);
    const flashcardsData = ref(null);
    const flashcardIndex = ref(0);
    const flashcardFlipped = ref(false);
    const flashcardsLoading = ref(false);
    const graderQuestion = ref("");
    const graderAnswer = ref("");
    const graderResult = ref(null);
    const graderLoading = ref(false);
    const shareLink = ref("");
    const shareLoading = ref(false);
    const expandLoading = ref(false);

    // Pomodoro
    const pomodoroTime = ref(25 * 60);
    const pomodoroRunning = ref(false);
    const pomodoroIsBreak = ref(false);
    let pomodoroInterval = null;

    // ── Traducción ─────────────────────────────────────────────────
    function t(key) {
      return (i18n[form.idioma] || i18n.es)[key] || i18n.es[key] || key;
    }

    const hasResult = computed(() =>
      Object.values(secciones).some((v) => v.length > 0)
    );

    const tabs = computed(() => [
      { key: "resumen", label: t("tabSummary"), icon: "📋" },
      { key: "explicacion", label: t("tabExplanation"), icon: "📖" },
      { key: "exposicion", label: t("tabPresentation"), icon: "🎤" },
      { key: "ideas_visuales", label: t("tabVisualIdeas"), icon: "💡" },
      { key: "preguntas", label: t("tabQA"), icon: "❓" },
      { key: "bibliografia", label: t("tabBibliography"), icon: "📚" },
    ]);

    const tipoLabel = computed(() => {
      const map = {
        tarea: t("task"), exposicion: t("presentation"), resumen: t("summary"),
        ensayo: t("essay"), mapa_conceptual: t("conceptMap"), linea_tiempo: t("timeline")
      };
      return map[form.tipo] || form.tipo;
    });

    const nivelLabel = computed(() => {
      const map = { facil: t("easy"), medio: t("medium"), dificil: t("hard") };
      return map[form.nivel] || form.nivel;
    });

    const wordCount = computed(() => countWords(textoCompleto.value));

    const quizScore = computed(() => {
      if (!quizData.value || !quizChecked.value) return null;
      let correct = 0;
      quizData.value.forEach((q, i) => {
        if (quizAnswers[i] === q.correcta) correct++;
      });
      return { correct, total: quizData.value.length };
    });

    const pomodoroDisplay = computed(() => {
      const mins = Math.floor(pomodoroTime.value / 60);
      const secs = pomodoroTime.value % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
      if (!text) return '<p class="empty-section">—</p>';
      return marked.parse(text);
    }

    function playNotificationSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = "sine";
        gain.gain.value = 0.15;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.stop(ctx.currentTime + 0.4);
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.value = 1200;
          osc2.type = "sine";
          gain2.gain.value = 0.15;
          osc2.start();
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc2.stop(ctx.currentTime + 0.5);
        }, 200);
      } catch {}
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

    // ── Exportar ───────────────────────────────────────────────────
    function exportarPDF() {
      const content = buildExportHTML();
      const win = window.open("", "_blank");
      win.document.write(content);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }

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
        h2{color:#333;margin-top:28px;}ul,ol{margin-left:20px;}
        .meta{color:#666;font-size:14px;margin-bottom:24px;}
        .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;margin-right:6px;background:#e0f5ee;color:#10a37f;}
        </style></head><body>`;
      html += `<h1>${form.tema}</h1>`;
      html += `<div class="meta"><span class="badge">${tipoLabel.value}</span><span class="badge">${nivelLabel.value}</span><span class="badge">${wordCount.value} ${t("words")}</span></div>`;
      for (const tab of tabs.value) {
        if (secciones[tab.key]) {
          html += `<h2>${tab.icon} ${tab.label}</h2>`;
          html += marked.parse(secciones[tab.key]);
        }
      }
      html += `<hr><p style="color:#999;font-size:12px;text-align:center;">Generado con SchoolIA</p></body></html>`;
      return html;
    }

    // ── API: Generar (streaming) ───────────────────────────────────
    async function generar() {
      if (!form.tema.trim()) return;
      loading.value = true;
      isStreaming.value = true;
      streamingText.value = "";
      error.value = "";
      activeTab.value = "resumen";
      sidebarOpen.value = false;
      // Reset sections
      Object.keys(secciones).forEach(k => secciones[k] = "");

      try {
        const res = await fetch("/api/generar-stream", {
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

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.chunk) {
                  streamingText.value += data.chunk;
                  secciones.resumen = streamingText.value;
                }
                if (data.done) {
                  updateSections(data);
                  guardarHistorial();
                  playNotificationSound();
                }
                if (data.error) {
                  showError(data.error);
                }
              } catch {}
            }
          }
        }
      } catch {
        showError("Error de conexión.");
      } finally {
        loading.value = false;
        isStreaming.value = false;
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
        playNotificationSound();
      } catch { showError("Error de conexión."); }
      finally { loading.value = false; }
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
        playNotificationSound();
      } catch { showError("Error de conexión."); }
      finally { loading.value = false; }
    }

    // ── Ampliar sección ────────────────────────────────────────────
    async function ampliarSeccion() {
      const text = secciones[activeTab.value];
      if (!text) return;
      expandLoading.value = true;
      try {
        const res = await fetch("/api/ampliar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seccion: text, tema: form.tema }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        secciones[activeTab.value] = data.texto;
      } catch { showError("Error de conexión."); }
      finally { expandLoading.value = false; }
    }

    // ── Chat ───────────────────────────────────────────────────────
    async function enviarChat() {
      if (!chatInput.value.trim()) return;
      const pregunta = chatInput.value.trim();
      chatMessages.value.push({ role: "user", text: pregunta });
      chatInput.value = "";
      chatLoading.value = true;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pregunta, contexto: textoCompleto.value }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        chatMessages.value.push({ role: "ai", text: data.respuesta });
      } catch { showError("Error de conexión."); }
      finally { chatLoading.value = false; }
    }

    // ── Quiz ───────────────────────────────────────────────────────
    async function generarQuiz() {
      quizLoading.value = true;
      quizData.value = null;
      quizChecked.value = false;
      Object.keys(quizAnswers).forEach(k => delete quizAnswers[k]);
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tema: form.tema, texto: textoCompleto.value }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        quizData.value = data.quiz;
      } catch { showError("Error de conexión."); }
      finally { quizLoading.value = false; }
    }

    function verificarQuiz() {
      quizChecked.value = true;
      playNotificationSound();
    }

    // ── Flashcards ─────────────────────────────────────────────────
    async function generarFlashcards() {
      flashcardsLoading.value = true;
      flashcardsData.value = null;
      flashcardIndex.value = 0;
      flashcardFlipped.value = false;
      try {
        const res = await fetch("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tema: form.tema, texto: textoCompleto.value }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        flashcardsData.value = data.flashcards;
      } catch { showError("Error de conexión."); }
      finally { flashcardsLoading.value = false; }
    }

    function flipFlashcard() { flashcardFlipped.value = !flashcardFlipped.value; }
    function nextFlashcard() {
      if (flashcardsData.value && flashcardIndex.value < flashcardsData.value.length - 1) {
        flashcardIndex.value++;
        flashcardFlipped.value = false;
      }
    }
    function prevFlashcard() {
      if (flashcardIndex.value > 0) {
        flashcardIndex.value--;
        flashcardFlipped.value = false;
      }
    }

    // ── Calificador ────────────────────────────────────────────────
    async function calificar() {
      if (!graderAnswer.value.trim()) return;
      graderLoading.value = true;
      graderResult.value = null;
      try {
        const res = await fetch("/api/calificar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tema: form.tema,
            pregunta: graderQuestion.value,
            respuesta: graderAnswer.value,
          }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        graderResult.value = data;
        playNotificationSound();
      } catch { showError("Error de conexión."); }
      finally { graderLoading.value = false; }
    }

    // ── Compartir ──────────────────────────────────────────────────
    async function compartir() {
      shareLoading.value = true;
      shareLink.value = "";
      try {
        const res = await fetch("/api/compartir", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tema: form.tema,
            tipo: form.tipo,
            nivel: form.nivel,
            secciones: { ...secciones },
            textoCompleto: textoCompleto.value,
          }),
        });
        const data = await res.json();
        if (data.error) { showError(data.error); return; }
        shareLink.value = `${window.location.origin}?shared=${data.id}`;
        await navigator.clipboard.writeText(shareLink.value);
      } catch { showError("Error de conexión."); }
      finally { shareLoading.value = false; }
    }

    // ── Pomodoro ───────────────────────────────────────────────────
    function startPomodoro() {
      if (pomodoroRunning.value) {
        clearInterval(pomodoroInterval);
        pomodoroRunning.value = false;
        return;
      }
      pomodoroRunning.value = true;
      pomodoroInterval = setInterval(() => {
        if (pomodoroTime.value > 0) {
          pomodoroTime.value--;
        } else {
          clearInterval(pomodoroInterval);
          pomodoroRunning.value = false;
          playNotificationSound();
          if (!pomodoroIsBreak.value) {
            pomodoroIsBreak.value = true;
            pomodoroTime.value = 5 * 60;
          } else {
            pomodoroIsBreak.value = false;
            pomodoroTime.value = 25 * 60;
          }
        }
      }, 1000);
    }

    function resetPomodoro() {
      clearInterval(pomodoroInterval);
      pomodoroRunning.value = false;
      pomodoroIsBreak.value = false;
      pomodoroTime.value = 25 * 60;
    }

    function togglePanel(panel) {
      activePanel.value = activePanel.value === panel ? "" : panel;
    }

    async function copiarTodo() {
      const parts = [];
      for (const tab of tabs.value) {
        if (secciones[tab.key]) {
          parts.push(`${tab.label.toUpperCase()}\n${"=".repeat(tab.label.length)}\n${secciones[tab.key]}`);
        }
      }
      try {
        await navigator.clipboard.writeText(parts.join("\n\n"));
        copiado.value = true;
        setTimeout(() => (copiado.value = false), 2000);
      } catch { showError("No se pudo copiar."); }
    }

    // ── Load shared task from URL ──────────────────────────────────
    async function loadSharedTask() {
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get("shared");
      if (!sharedId) return;
      try {
        const res = await fetch(`/api/compartir/${sharedId}`);
        const data = await res.json();
        if (data.error) return;
        form.tema = data.tema;
        form.tipo = data.tipo;
        form.nivel = data.nivel;
        Object.assign(secciones, data.secciones);
        textoCompleto.value = data.textoCompleto;
      } catch {}
    }

    // ── Init ───────────────────────────────────────────────────────
    onMounted(() => {
      const savedTheme = localStorage.getItem("schoolia-theme");
      if (savedTheme === "light") {
        darkMode.value = false;
        document.body.classList.add("light-mode");
      }
      try {
        const saved = localStorage.getItem("schoolia-historial");
        if (saved) historial.value = JSON.parse(saved);
      } catch {}
      const savedLang = localStorage.getItem("schoolia-lang");
      if (savedLang) form.idioma = savedLang;
      loadSharedTask();
    });

    watch(() => form.idioma, (val) => {
      localStorage.setItem("schoolia-lang", val);
    });

    return {
      form, secciones, textoCompleto, loading, error,
      activeTab, copiado, sidebarOpen, hasResult, darkMode, historial,
      tabs, tipoLabel, nivelLabel, wordCount, streamingText, isStreaming,
      activePanel, chatMessages, chatInput, chatLoading,
      quizData, quizAnswers, quizChecked, quizLoading, quizScore,
      flashcardsData, flashcardIndex, flashcardFlipped, flashcardsLoading,
      graderQuestion, graderAnswer, graderResult, graderLoading,
      shareLink, shareLoading, expandLoading,
      pomodoroTime, pomodoroRunning, pomodoroIsBreak, pomodoroDisplay,
      t, generar, humanizar, acortar, copiarTodo, renderMarkdown,
      toggleTheme, cargarHistorial, limpiarHistorial,
      exportarPDF, exportarWord, countWords, ampliarSeccion,
      enviarChat, generarQuiz, verificarQuiz,
      generarFlashcards, flipFlashcard, nextFlashcard, prevFlashcard,
      calificar, compartir, startPomodoro, resetPomodoro, togglePanel,
    };
  },
}).mount("#app");
