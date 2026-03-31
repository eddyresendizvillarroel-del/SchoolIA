const { createApp, ref, computed, reactive, onMounted, watch, nextTick } = Vue;

// ── Traducciones ─────────────────────────────────────────────────
const i18n = {
  es: {
    generateTask: "Genera tu tarea", topic: "Tema", topicPlaceholder: "Ej: La Revolución Francesa",
    language: "Idioma", difficulty: "Nivel de dificultad",
    easy: "Fácil", medium: "Medio", hard: "Difícil",
    workType: "Tipo de trabajo",
    task: "Tarea", presentation: "Exposición", summary: "Resumen",
    essay: "Ensayo", conceptMap: "Mapa Conceptual", timeline: "Línea de Tiempo",
    people: "Personas", optional: "(opcional)",
    generating: "Generando...", generate: "Generar tarea",
    history: "Historial", clearHistory: "Limpiar historial",
    welcome: "Bienvenido a SchoolIA",
    welcomeDesc: "Ingresa un tema en el panel izquierdo y genera tu tarea escolar completa al instante con inteligencia artificial.",
    summaryExpl: "Resumen y explicación", readyPresent: "Listo para exponer",
    visualIdeas: "Ideas visuales", qAndA: "Preguntas y respuestas",
    exportPdf: "Exportar a PDF", multiLang: "Multi-idioma",
    generatingAbout: "Generando tu tarea sobre",
    analyzing: "Analizando el tema...", creating: "Creando contenido estructurado...", preparing: "Preparando las secciones...",
    humanize: "Humanizar", shorten: "Más corto",
    copyAll: "Copiar todo", copied: "¡Copiado!",
    processing: "Procesando cambios...", words: "palabras",
    tabSummary: "Resumen", tabExplanation: "Explicación",
    tabPresentation: "Exposición", tabVisualIdeas: "Ideas Visuales",
    tabQA: "Preguntas y Respuestas", tabBibliography: "Bibliografía",
    expand: "Ampliar esta sección",
    chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Calificador", share: "Compartir", timer: "Pomodoro",
    chatPlaceholder: "Pregunta algo sobre el tema...", send: "Enviar",
    quizTitle: "Quiz - Pon a prueba tu conocimiento",
    checkAnswers: "Verificar respuestas", score: "Puntuación",
    flashcardsTitle: "Flashcards de estudio", clickToFlip: "Click para voltear",
    prev: "Anterior", next: "Siguiente",
    graderTitle: "Calificador de respuestas",
    questionLabel: "Pregunta", questionPlaceholder: "Escribe la pregunta...",
    answerLabel: "Tu respuesta", answerPlaceholder: "Escribe tu respuesta aquí...",
    grade: "Calificar", gradeResult: "Calificación",
    goodPoints: "Puntos buenos", improvements: "Áreas de mejora",
    shareTitle: "Compartir tarea",
    shareDesc: "Genera un link para compartir esta tarea. El link expira en 24 horas.",
    shareGenerate: "Generar link", shareCopied: "¡Link copiado!",
    timerWork: "Trabajo", timerBreak: "Descanso",
    timerStart: "Iniciar", timerPause: "Pausar", timerReset: "Reiniciar",
    timerSound: "Sonido", timerNoSound: "Sin sonido",
    poweredBy: "Powered by IA",
    loadingQuiz: "Generando quiz...", loadingFlashcards: "Generando flashcards...",
    loadingGrade: "Calificando...", loadingChat: "Pensando...",
    loadingShare: "Generando link...", loadingExpand: "Ampliando sección...",
    of: "de",
    speak: "Leer", stopSpeak: "Detener",
    focusMode: "Lectura", slides: "Diapositivas",
    versions: "Versiones", vOriginal: "Original", vHumanized: "Humanizado", vShortened: "Acortado",
    exam: "Examen", examTitle: "Modo Examen",
    examDesc: "Genera un examen con preguntas abiertas. Responde y recibe evaluación detallada.",
    examGenerate: "Generar examen", examSubmit: "Entregar examen",
    examResults: "Resultados del examen", examRetry: "Intentar de nuevo",
    loadingExam: "Generando examen...",
    shortcuts: "Atajos de teclado", closePanel: "Cerrar panel", navTabs: "Navegar secciones", close: "Cerrar",
    originality: "Originalidad", originalityTitle: "Detector de Originalidad",
    originalityDesc: "Analiza qué tan humano suena tu texto y recibe sugerencias para mejorarlo.",
    originalityAnalyze: "Analizar texto", loadingOriginality: "Analizando...",
    originalityScore: "Puntuación", originalityHuman: "humano",
    originalityAI: "Patrones de IA detectados", originalitySuggestions: "Sugerencias",
    images: "Imágenes", imagesTitle: "Imágenes de referencia",
    imagesSearch: "Buscar imágenes...", loadingImages: "Buscando...", imagesNone: "No se encontraron imágenes.",
    collab: "Colaborar", collabTitle: "Colaboración en tiempo real",
    collabDesc: "Crea una sala para trabajar con otros en la misma tarea. Comparte el código de sala.",
    collabCreate: "Crear sala", collabJoin: "Unirse",
    collabJoinLabel: "Unirse a una sala", collabCodePlaceholder: "Código de sala",
    collabRoom: "Sala", collabConnected: "conectados", collabLeave: "Salir",
    collabNotePlaceholder: "Escribe una nota para el equipo...",
  },
  en: {
    generateTask: "Generate your task", topic: "Topic", topicPlaceholder: "E.g.: The French Revolution",
    language: "Language", difficulty: "Difficulty level",
    easy: "Easy", medium: "Medium", hard: "Hard",
    workType: "Work type",
    task: "Homework", presentation: "Presentation", summary: "Summary",
    essay: "Essay", conceptMap: "Concept Map", timeline: "Timeline",
    people: "People", optional: "(optional)",
    generating: "Generating...", generate: "Generate task",
    history: "History", clearHistory: "Clear history",
    welcome: "Welcome to SchoolIA",
    welcomeDesc: "Enter a topic in the left panel and generate your complete school assignment instantly with artificial intelligence.",
    summaryExpl: "Summary and explanation", readyPresent: "Ready to present",
    visualIdeas: "Visual ideas", qAndA: "Questions and answers",
    exportPdf: "Export to PDF", multiLang: "Multi-language",
    generatingAbout: "Generating your task about",
    analyzing: "Analyzing the topic...", creating: "Creating structured content...", preparing: "Preparing sections...",
    humanize: "Humanize", shorten: "Shorten",
    copyAll: "Copy all", copied: "Copied!",
    processing: "Processing changes...", words: "words",
    tabSummary: "Summary", tabExplanation: "Explanation",
    tabPresentation: "Presentation", tabVisualIdeas: "Visual Ideas",
    tabQA: "Questions & Answers", tabBibliography: "Bibliography",
    expand: "Expand this section",
    chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Grader", share: "Share", timer: "Pomodoro",
    chatPlaceholder: "Ask something about the topic...", send: "Send",
    quizTitle: "Quiz - Test your knowledge",
    checkAnswers: "Check answers", score: "Score",
    flashcardsTitle: "Study Flashcards", clickToFlip: "Click to flip",
    prev: "Previous", next: "Next",
    graderTitle: "Answer Grader",
    questionLabel: "Question", questionPlaceholder: "Write the question...",
    answerLabel: "Your answer", answerPlaceholder: "Write your answer here...",
    grade: "Grade", gradeResult: "Grade",
    goodPoints: "Good points", improvements: "Areas to improve",
    shareTitle: "Share task",
    shareDesc: "Generate a link to share this task. Link expires in 24 hours.",
    shareGenerate: "Generate link", shareCopied: "Link copied!",
    timerWork: "Work", timerBreak: "Break",
    timerStart: "Start", timerPause: "Pause", timerReset: "Reset",
    timerSound: "Sound", timerNoSound: "No sound",
    poweredBy: "Powered by AI",
    loadingQuiz: "Generating quiz...", loadingFlashcards: "Generating flashcards...",
    loadingGrade: "Grading...", loadingChat: "Thinking...",
    loadingShare: "Generating link...", loadingExpand: "Expanding section...",
    of: "of",
    speak: "Read aloud", stopSpeak: "Stop",
    focusMode: "Focus", slides: "Slides",
    versions: "Versions", vOriginal: "Original", vHumanized: "Humanized", vShortened: "Shortened",
    exam: "Exam", examTitle: "Exam Mode",
    examDesc: "Generate an exam with open-ended questions. Answer and get detailed feedback.",
    examGenerate: "Generate exam", examSubmit: "Submit exam",
    examResults: "Exam Results", examRetry: "Try again",
    loadingExam: "Generating exam...",
    shortcuts: "Keyboard shortcuts", closePanel: "Close panel", navTabs: "Navigate sections", close: "Close",
    originality: "Originality", originalityTitle: "Originality Detector",
    originalityDesc: "Analyze how human your text sounds and get suggestions to improve it.",
    originalityAnalyze: "Analyze text", loadingOriginality: "Analyzing...",
    originalityScore: "Score", originalityHuman: "human",
    originalityAI: "AI patterns detected", originalitySuggestions: "Suggestions",
    images: "Images", imagesTitle: "Reference Images",
    imagesSearch: "Search images...", loadingImages: "Searching...", imagesNone: "No images found.",
    collab: "Collaborate", collabTitle: "Real-time Collaboration",
    collabDesc: "Create a room to work with others on the same task. Share the room code.",
    collabCreate: "Create room", collabJoin: "Join",
    collabJoinLabel: "Join a room", collabCodePlaceholder: "Room code",
    collabRoom: "Room", collabConnected: "connected", collabLeave: "Leave",
    collabNotePlaceholder: "Write a note for the team...",
  },
  fr: {
    generateTask: "Génère ton devoir", topic: "Sujet", topicPlaceholder: "Ex: La Révolution Française",
    language: "Langue", difficulty: "Niveau de difficulté",
    easy: "Facile", medium: "Moyen", hard: "Difficile",
    workType: "Type de travail",
    task: "Devoir", presentation: "Exposé", summary: "Résumé",
    essay: "Essai", conceptMap: "Carte Conceptuelle", timeline: "Chronologie",
    people: "Personnes", optional: "(optionnel)",
    generating: "Génération...", generate: "Générer le devoir",
    history: "Historique", clearHistory: "Effacer l'historique",
    welcome: "Bienvenue sur SchoolIA",
    welcomeDesc: "Entrez un sujet et générez votre devoir complet instantanément avec l'intelligence artificielle.",
    summaryExpl: "Résumé et explication", readyPresent: "Prêt à présenter",
    visualIdeas: "Idées visuelles", qAndA: "Questions et réponses",
    exportPdf: "Exporter en PDF", multiLang: "Multi-langue",
    generatingAbout: "Génération sur", analyzing: "Analyse...", creating: "Création...", preparing: "Préparation...",
    humanize: "Humaniser", shorten: "Raccourcir",
    copyAll: "Tout copier", copied: "Copié!", processing: "Traitement...", words: "mots",
    tabSummary: "Résumé", tabExplanation: "Explication", tabPresentation: "Exposé",
    tabVisualIdeas: "Idées Visuelles", tabQA: "Questions et Réponses", tabBibliography: "Bibliographie",
    expand: "Développer", chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Correcteur", share: "Partager", timer: "Pomodoro",
    chatPlaceholder: "Posez une question...", send: "Envoyer",
    quizTitle: "Quiz - Testez vos connaissances", checkAnswers: "Vérifier", score: "Score",
    flashcardsTitle: "Flashcards", clickToFlip: "Cliquez pour retourner",
    prev: "Précédent", next: "Suivant",
    graderTitle: "Correcteur", questionLabel: "Question", questionPlaceholder: "Écrivez la question...",
    answerLabel: "Votre réponse", answerPlaceholder: "Écrivez votre réponse...",
    grade: "Corriger", gradeResult: "Note", goodPoints: "Points positifs", improvements: "À améliorer",
    shareTitle: "Partager", shareDesc: "Lien valide 24h.", shareGenerate: "Générer le lien", shareCopied: "Lien copié!",
    timerWork: "Travail", timerBreak: "Pause", timerStart: "Démarrer", timerPause: "Pause", timerReset: "Réinitialiser",
    timerSound: "Son", timerNoSound: "Sans son",
    poweredBy: "Propulsé par IA",
    loadingQuiz: "Génération...", loadingFlashcards: "Génération...", loadingGrade: "Correction...",
    loadingChat: "Réflexion...", loadingShare: "Génération...", loadingExpand: "Développement...", of: "de",
    speak: "Lire", stopSpeak: "Arrêter", focusMode: "Lecture", slides: "Diapositives",
    versions: "Versions", vOriginal: "Original", vHumanized: "Humanisé", vShortened: "Raccourci",
    exam: "Examen", examTitle: "Mode Examen", examDesc: "Générez un examen avec des questions ouvertes.",
    examGenerate: "Générer", examSubmit: "Soumettre", examResults: "Résultats", examRetry: "Réessayer",
    loadingExam: "Génération...",
    shortcuts: "Raccourcis clavier", closePanel: "Fermer", navTabs: "Naviguer", close: "Fermer",
    originality: "Originalité", originalityTitle: "Détecteur d'originalité",
    originalityDesc: "Analysez si votre texte sonne humain.", originalityAnalyze: "Analyser", loadingOriginality: "Analyse...",
    originalityScore: "Score", originalityHuman: "humain", originalityAI: "Patterns IA", originalitySuggestions: "Suggestions",
    images: "Images", imagesTitle: "Images de référence", imagesSearch: "Chercher...", loadingImages: "Recherche...", imagesNone: "Aucune image.",
    collab: "Collaborer", collabTitle: "Collaboration en temps réel", collabDesc: "Créez une salle pour travailler ensemble.",
    collabCreate: "Créer", collabJoin: "Rejoindre", collabJoinLabel: "Rejoindre une salle", collabCodePlaceholder: "Code",
    collabRoom: "Salle", collabConnected: "connectés", collabLeave: "Quitter", collabNotePlaceholder: "Note pour l'équipe...",
  },
  pt: {
    generateTask: "Gere sua tarefa", topic: "Tema", topicPlaceholder: "Ex: A Revolução Francesa",
    language: "Idioma", difficulty: "Nível de dificuldade",
    easy: "Fácil", medium: "Médio", hard: "Difícil",
    workType: "Tipo de trabalho",
    task: "Tarefa", presentation: "Apresentação", summary: "Resumo",
    essay: "Ensaio", conceptMap: "Mapa Conceitual", timeline: "Linha do Tempo",
    people: "Pessoas", optional: "(opcional)",
    generating: "Gerando...", generate: "Gerar tarefa",
    history: "Histórico", clearHistory: "Limpar histórico",
    welcome: "Bem-vindo ao SchoolIA",
    welcomeDesc: "Digite um tema e gere sua tarefa escolar completa instantaneamente com inteligência artificial.",
    summaryExpl: "Resumo e explicação", readyPresent: "Pronto para apresentar",
    visualIdeas: "Ideias visuais", qAndA: "Perguntas e respostas",
    exportPdf: "Exportar para PDF", multiLang: "Multi-idioma",
    generatingAbout: "Gerando sobre", analyzing: "Analisando...", creating: "Criando...", preparing: "Preparando...",
    humanize: "Humanizar", shorten: "Encurtar",
    copyAll: "Copiar tudo", copied: "Copiado!", processing: "Processando...", words: "palavras",
    tabSummary: "Resumo", tabExplanation: "Explicação", tabPresentation: "Apresentação",
    tabVisualIdeas: "Ideias Visuais", tabQA: "Perguntas e Respostas", tabBibliography: "Bibliografia",
    expand: "Expandir", chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Avaliador", share: "Compartilhar", timer: "Pomodoro",
    chatPlaceholder: "Pergunte algo...", send: "Enviar",
    quizTitle: "Quiz - Teste seu conhecimento", checkAnswers: "Verificar", score: "Pontuação",
    flashcardsTitle: "Flashcards", clickToFlip: "Clique para virar",
    prev: "Anterior", next: "Próximo",
    graderTitle: "Avaliador", questionLabel: "Pergunta", questionPlaceholder: "Escreva a pergunta...",
    answerLabel: "Sua resposta", answerPlaceholder: "Escreva sua resposta...",
    grade: "Avaliar", gradeResult: "Nota", goodPoints: "Pontos positivos", improvements: "Áreas para melhorar",
    shareTitle: "Compartilhar", shareDesc: "Link válido por 24h.", shareGenerate: "Gerar link", shareCopied: "Link copiado!",
    timerWork: "Trabalho", timerBreak: "Pausa", timerStart: "Iniciar", timerPause: "Pausar", timerReset: "Reiniciar",
    timerSound: "Som", timerNoSound: "Sem som",
    poweredBy: "Powered by IA",
    loadingQuiz: "Gerando...", loadingFlashcards: "Gerando...", loadingGrade: "Avaliando...",
    loadingChat: "Pensando...", loadingShare: "Gerando...", loadingExpand: "Expandindo...", of: "de",
    speak: "Ler", stopSpeak: "Parar", focusMode: "Leitura", slides: "Slides",
    versions: "Versões", vOriginal: "Original", vHumanized: "Humanizado", vShortened: "Resumido",
    exam: "Exame", examTitle: "Modo Exame", examDesc: "Gere um exame com perguntas abertas.",
    examGenerate: "Gerar", examSubmit: "Entregar", examResults: "Resultados", examRetry: "Tentar novamente",
    loadingExam: "Gerando...",
    shortcuts: "Atalhos", closePanel: "Fechar painel", navTabs: "Navegar", close: "Fechar",
    originality: "Originalidade", originalityTitle: "Detector de Originalidade",
    originalityDesc: "Analise se seu texto soa humano.", originalityAnalyze: "Analisar", loadingOriginality: "Analisando...",
    originalityScore: "Pontuação", originalityHuman: "humano", originalityAI: "Padrões de IA", originalitySuggestions: "Sugestões",
    images: "Imagens", imagesTitle: "Imagens de referência", imagesSearch: "Buscar...", loadingImages: "Buscando...", imagesNone: "Nenhuma imagem.",
    collab: "Colaborar", collabTitle: "Colaboração em tempo real", collabDesc: "Crie uma sala para trabalhar juntos.",
    collabCreate: "Criar sala", collabJoin: "Entrar", collabJoinLabel: "Entrar em uma sala", collabCodePlaceholder: "Código",
    collabRoom: "Sala", collabConnected: "conectados", collabLeave: "Sair", collabNotePlaceholder: "Nota para o time...",
  },
  de: {
    generateTask: "Aufgabe erstellen", topic: "Thema", topicPlaceholder: "Z.B.: Die Französische Revolution",
    language: "Sprache", difficulty: "Schwierigkeitsgrad",
    easy: "Leicht", medium: "Mittel", hard: "Schwer",
    workType: "Arbeitstyp",
    task: "Hausaufgabe", presentation: "Präsentation", summary: "Zusammenfassung",
    essay: "Aufsatz", conceptMap: "Konzeptkarte", timeline: "Zeitleiste",
    people: "Personen", optional: "(optional)",
    generating: "Wird erstellt...", generate: "Aufgabe erstellen",
    history: "Verlauf", clearHistory: "Verlauf löschen",
    welcome: "Willkommen bei SchoolIA",
    welcomeDesc: "Geben Sie ein Thema ein und erstellen Sie Ihre Schulaufgabe sofort mit KI.",
    summaryExpl: "Zusammenfassung und Erklärung", readyPresent: "Bereit zum Präsentieren",
    visualIdeas: "Visuelle Ideen", qAndA: "Fragen und Antworten",
    exportPdf: "Als PDF exportieren", multiLang: "Mehrsprachig",
    generatingAbout: "Erstelle über", analyzing: "Analysiere...", creating: "Erstelle...", preparing: "Vorbereiten...",
    humanize: "Vermenschlichen", shorten: "Kürzen",
    copyAll: "Alles kopieren", copied: "Kopiert!", processing: "Verarbeitung...", words: "Wörter",
    tabSummary: "Zusammenfassung", tabExplanation: "Erklärung", tabPresentation: "Präsentation",
    tabVisualIdeas: "Visuelle Ideen", tabQA: "Fragen & Antworten", tabBibliography: "Bibliografie",
    expand: "Erweitern", chat: "Chat", quiz: "Quiz", flashcards: "Flashcards",
    grader: "Bewerter", share: "Teilen", timer: "Pomodoro",
    chatPlaceholder: "Stellen Sie eine Frage...", send: "Senden",
    quizTitle: "Quiz - Testen Sie Ihr Wissen", checkAnswers: "Überprüfen", score: "Punktzahl",
    flashcardsTitle: "Lernkarten", clickToFlip: "Klicken zum Umdrehen",
    prev: "Zurück", next: "Weiter",
    graderTitle: "Bewerter", questionLabel: "Frage", questionPlaceholder: "Frage schreiben...",
    answerLabel: "Ihre Antwort", answerPlaceholder: "Antwort schreiben...",
    grade: "Bewerten", gradeResult: "Note", goodPoints: "Gute Punkte", improvements: "Verbesserungen",
    shareTitle: "Teilen", shareDesc: "Link gültig für 24h.", shareGenerate: "Link erstellen", shareCopied: "Link kopiert!",
    timerWork: "Arbeit", timerBreak: "Pause", timerStart: "Starten", timerPause: "Pausieren", timerReset: "Zurücksetzen",
    timerSound: "Ton", timerNoSound: "Kein Ton",
    poweredBy: "Powered by KI",
    loadingQuiz: "Erstelle...", loadingFlashcards: "Erstelle...", loadingGrade: "Bewerte...",
    loadingChat: "Denke...", loadingShare: "Erstelle...", loadingExpand: "Erweitere...", of: "von",
    speak: "Vorlesen", stopSpeak: "Stoppen", focusMode: "Fokus", slides: "Folien",
    versions: "Versionen", vOriginal: "Original", vHumanized: "Vermenschlicht", vShortened: "Gekürzt",
    exam: "Prüfung", examTitle: "Prüfungsmodus", examDesc: "Erstellen Sie eine Prüfung mit offenen Fragen.",
    examGenerate: "Erstellen", examSubmit: "Abgeben", examResults: "Ergebnisse", examRetry: "Nochmal",
    loadingExam: "Erstelle...",
    shortcuts: "Tastenkürzel", closePanel: "Panel schließen", navTabs: "Navigieren", close: "Schließen",
    originality: "Originalität", originalityTitle: "Originalitätsdetektor",
    originalityDesc: "Analysieren Sie, ob Ihr Text menschlich klingt.", originalityAnalyze: "Analysieren", loadingOriginality: "Analyse...",
    originalityScore: "Punktzahl", originalityHuman: "menschlich", originalityAI: "KI-Muster", originalitySuggestions: "Vorschläge",
    images: "Bilder", imagesTitle: "Referenzbilder", imagesSearch: "Suchen...", loadingImages: "Suche...", imagesNone: "Keine Bilder.",
    collab: "Zusammenarbeiten", collabTitle: "Echtzeit-Zusammenarbeit", collabDesc: "Erstellen Sie einen Raum.",
    collabCreate: "Raum erstellen", collabJoin: "Beitreten", collabJoinLabel: "Einem Raum beitreten", collabCodePlaceholder: "Code",
    collabRoom: "Raum", collabConnected: "verbunden", collabLeave: "Verlassen", collabNotePlaceholder: "Notiz für das Team...",
  },
};

// ── Suggested topics ──────────────────────────────────────────────
const topicsByLang = {
  es: ["La Revolución Francesa", "El Sistema Solar", "Fotosíntesis", "Segunda Guerra Mundial", "Cambio Climático", "El ADN", "Inteligencia Artificial", "El Renacimiento"],
  en: ["The French Revolution", "The Solar System", "Photosynthesis", "World War II", "Climate Change", "DNA", "Artificial Intelligence", "The Renaissance"],
  fr: ["La Révolution Française", "Le Système Solaire", "La Photosynthèse", "La Seconde Guerre Mondiale", "Le Changement Climatique", "L'ADN", "L'Intelligence Artificielle", "La Renaissance"],
  pt: ["A Revolução Francesa", "O Sistema Solar", "Fotossíntese", "Segunda Guerra Mundial", "Mudanças Climáticas", "O DNA", "Inteligência Artificial", "O Renascimento"],
  de: ["Die Französische Revolution", "Das Sonnensystem", "Photosynthese", "Der Zweite Weltkrieg", "Klimawandel", "Die DNA", "Künstliche Intelligenz", "Die Renaissance"],
};

createApp({
  setup() {
    const form = reactive({ tema: "", nivel: "medio", tipo: "tarea", idioma: "es", personas: null });
    const secciones = reactive({ resumen: "", explicacion: "", exposicion: "", ideas_visuales: "", preguntas: "", bibliografia: "" });
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
    const focusMode = ref(false);
    const showShortcuts = ref(false);
    const isSpeaking = ref(false);

    // Tools state
    const activePanel = ref("");
    const chatMessages = ref([]);
    const chatInput = ref("");
    const chatLoading = ref(false);
    const chatContainer = ref(null);
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

    // Exam state
    const examData = ref(null);
    const examAnswers = reactive({});
    const examResult = ref(null);
    const examLoading = ref(false);
    const examEvaluating = ref(false);
    const examTimeRunning = ref(false);
    const examTimeLeft = ref(0);
    let examInterval = null;

    // Originality
    const originalityResult = ref(null);
    const originalityLoading = ref(false);

    // Images
    const imageQuery = ref("");
    const imagesData = ref(null);
    const imagesLoading = ref(false);

    // Collaboration
    const collabRoom = ref("");
    const collabUserCount = ref(0);
    const collabNotes = ref([]);
    const collabNoteInput = ref("");
    const collabJoinCode = ref("");
    const collabNotesContainer = ref(null);
    let socket = null;

    // Version history
    const versionHistory = ref([]);
    const currentVersion = ref(0);

    // Pomodoro
    const pomodoroTime = ref(25 * 60);
    const pomodoroRunning = ref(false);
    const pomodoroIsBreak = ref(false);
    const pomodoroTotal = ref(25 * 60);
    const pomodoroSound = ref("bell");
    let pomodoroInterval = null;

    // Confetti
    const confettiCanvas = ref(null);

    function t(key) { return (i18n[form.idioma] || i18n.es)[key] || i18n.es[key] || key; }

    const suggestedTopics = computed(() => {
      const all = topicsByLang[form.idioma] || topicsByLang.es;
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 5);
    });

    const hasResult = computed(() => Object.values(secciones).some(v => v.length > 0));
    const tabs = computed(() => [
      { key: "resumen", label: t("tabSummary"), icon: "📋" },
      { key: "explicacion", label: t("tabExplanation"), icon: "📖" },
      { key: "exposicion", label: t("tabPresentation"), icon: "🎤" },
      { key: "ideas_visuales", label: t("tabVisualIdeas"), icon: "💡" },
      { key: "preguntas", label: t("tabQA"), icon: "❓" },
      { key: "bibliografia", label: t("tabBibliography"), icon: "📚" },
    ]);
    const tipoLabel = computed(() => ({ tarea: t("task"), exposicion: t("presentation"), resumen: t("summary"), ensayo: t("essay"), mapa_conceptual: t("conceptMap"), linea_tiempo: t("timeline") })[form.tipo] || form.tipo);
    const nivelLabel = computed(() => ({ facil: t("easy"), medio: t("medium"), dificil: t("hard") })[form.nivel] || form.nivel);
    const wordCount = computed(() => countWords(textoCompleto.value));
    const quizScore = computed(() => {
      if (!quizData.value || !quizChecked.value) return null;
      let correct = 0;
      quizData.value.forEach((q, i) => { if (quizAnswers[i] === q.correcta) correct++; });
      return { correct, total: quizData.value.length };
    });
    const pomodoroDisplay = computed(() => {
      const m = Math.floor(pomodoroTime.value / 60), s = pomodoroTime.value % 60;
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });
    const pomodoroProgress = computed(() => pomodoroTotal.value ? ((pomodoroTotal.value - pomodoroTime.value) / pomodoroTotal.value) * 100 : 0);
    const examTimerDisplay = computed(() => {
      const m = Math.floor(examTimeLeft.value / 60), s = examTimeLeft.value % 60;
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });

    // ── Helpers ────────────────────────────────────────────────────
    function countWords(text) { return text ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0; }
    function showError(msg) { error.value = msg; setTimeout(() => (error.value = ""), 4000); }
    function updateSections(data) { Object.assign(secciones, data.secciones); textoCompleto.value = data.textoCompleto; }
    function renderMarkdown(text) {
      if (!text) return '<p class="empty-section">—</p>';
      return DOMPurify.sanitize(marked.parse(text));
    }
    function escapeHtml(text) { const d = document.createElement("div"); d.textContent = text; return d.innerHTML; }
    function scrollChatToBottom() { nextTick(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; }); }

    // ── Version history ────────────────────────────────────────────
    function saveVersion(label) {
      versionHistory.value.push({ label, secciones: { ...secciones }, textoCompleto: textoCompleto.value });
      currentVersion.value = versionHistory.value.length - 1;
    }
    function restoreVersion(index) {
      const v = versionHistory.value[index];
      Object.assign(secciones, v.secciones);
      textoCompleto.value = v.textoCompleto;
      currentVersion.value = index;
    }

    // ── Confetti ───────────────────────────────────────────────────
    function launchConfetti() {
      const canvas = confettiCanvas.value;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.display = "block";
      const particles = [];
      const colors = ["#10a37f", "#19c37d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
      for (let i = 0; i < 120; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 15,
          vy: Math.random() * -18 - 5,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          life: 1,
        });
      }
      let frame = 0;
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        for (const p of particles) {
          if (p.life <= 0) continue;
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.4;
          p.rotation += p.rotSpeed;
          p.life -= 0.012;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
        frame++;
        if (alive && frame < 180) requestAnimationFrame(animate);
        else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = "none"; }
      }
      animate();
    }

    // ── Sounds ─────────────────────────────────────────────────────
    function playSound(type) {
      if (type === "none") return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (type === "bell") {
          [800, 1200].forEach((freq, i) => {
            setTimeout(() => {
              const osc = ctx.createOscillator(), gain = ctx.createGain();
              osc.connect(gain); gain.connect(ctx.destination);
              osc.frequency.value = freq; osc.type = "sine"; gain.gain.value = 0.15;
              osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
              osc.stop(ctx.currentTime + 0.4);
            }, i * 200);
          });
        } else if (type === "chime") {
          [523, 659, 784].forEach((freq, i) => {
            setTimeout(() => {
              const osc = ctx.createOscillator(), gain = ctx.createGain();
              osc.connect(gain); gain.connect(ctx.destination);
              osc.frequency.value = freq; osc.type = "triangle"; gain.gain.value = 0.12;
              osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
              osc.stop(ctx.currentTime + 0.6);
            }, i * 150);
          });
        } else if (type === "beep") {
          const osc = ctx.createOscillator(), gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = 440; osc.type = "square"; gain.gain.value = 0.08;
          osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch {}
    }
    function playNotificationSound() { playSound(pomodoroSound.value || "bell"); }

    // ── Text-to-Speech ─────────────────────────────────────────────
    function speakSection() {
      if (isSpeaking.value) { speechSynthesis.cancel(); isSpeaking.value = false; return; }
      const text = secciones[activeTab.value];
      if (!text) return;
      const clean = text.replace(/[#*_`>\-\[\]()]/g, "").replace(/\n+/g, ". ");
      const utter = new SpeechSynthesisUtterance(clean);
      const langMap = { es: "es-ES", en: "en-US", fr: "fr-FR", pt: "pt-BR", de: "de-DE" };
      utter.lang = langMap[form.idioma] || "es-ES";
      utter.rate = 0.9;
      utter.onend = () => { isSpeaking.value = false; };
      utter.onerror = () => { isSpeaking.value = false; };
      isSpeaking.value = true;
      speechSynthesis.speak(utter);
    }

    // ── Theme ──────────────────────────────────────────────────────
    function toggleTheme() {
      darkMode.value = !darkMode.value;
      document.body.classList.toggle("light-mode", !darkMode.value);
      localStorage.setItem("schoolia-theme", darkMode.value ? "dark" : "light");
    }

    // ── Historial ──────────────────────────────────────────────────
    function guardarHistorial() {
      const entry = { tema: form.tema, nivel: form.nivel, tipo: form.tipo, idioma: form.idioma, personas: form.personas,
        tipoLabel: tipoLabel.value, fecha: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
        secciones: { ...secciones }, textoCompleto: textoCompleto.value };
      historial.value.unshift(entry);
      if (historial.value.length > 20) historial.value.pop();
      localStorage.setItem("schoolia-historial", JSON.stringify(historial.value));
    }
    function cargarHistorial(index) {
      const item = historial.value[index];
      form.tema = item.tema; form.nivel = item.nivel; form.tipo = item.tipo;
      form.idioma = item.idioma || "es"; form.personas = item.personas;
      Object.assign(secciones, item.secciones); textoCompleto.value = item.textoCompleto;
      activeTab.value = "resumen"; sidebarOpen.value = false;
      versionHistory.value = [{ label: t("vOriginal"), secciones: { ...item.secciones }, textoCompleto: item.textoCompleto }];
      currentVersion.value = 0;
    }
    function limpiarHistorial() { historial.value = []; localStorage.removeItem("schoolia-historial"); }

    // ── Export ──────────────────────────────────────────────────────
    function exportarPDF() { const c = buildExportHTML(); const w = window.open("", "_blank"); w.document.write(c); w.document.close(); setTimeout(() => w.print(), 500); }
    function exportarWord() {
      const c = buildExportHTML(); const b = new Blob([c], { type: "application/msword" });
      const u = URL.createObjectURL(b); const a = document.createElement("a");
      a.href = u; a.download = `${form.tema || "tarea"}.doc`; a.click(); URL.revokeObjectURL(u);
    }
    function buildExportHTML() {
      const san = (s) => DOMPurify.sanitize(marked.parse(s));
      let h = `<html><head><meta charset="UTF-8"><title>${escapeHtml(form.tema)}</title>
        <style>body{font-family:Arial,sans-serif;padding:40px;color:#222;line-height:1.8;}
        h1{color:#10a37f;border-bottom:2px solid #10a37f;padding-bottom:8px;}
        h2{color:#333;margin-top:28px;}ul,ol{margin-left:20px;}
        .meta{color:#666;font-size:14px;margin-bottom:24px;}
        .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;margin-right:6px;background:#e0f5ee;color:#10a37f;}
        </style></head><body>`;
      h += `<h1>${escapeHtml(form.tema)}</h1>`;
      h += `<div class="meta"><span class="badge">${escapeHtml(tipoLabel.value)}</span><span class="badge">${escapeHtml(nivelLabel.value)}</span><span class="badge">${wordCount.value} ${t("words")}</span></div>`;
      for (const tab of tabs.value) { if (secciones[tab.key]) { h += `<h2>${tab.icon} ${escapeHtml(tab.label)}</h2>`; h += san(secciones[tab.key]); } }
      h += `<hr><p style="color:#999;font-size:12px;text-align:center;">Generado con SchoolIA</p></body></html>`;
      return h;
    }

    // ── Export Slides ──────────────────────────────────────────────
    function exportarSlides() {
      const slides = [];
      slides.push(`<div class="slide slide-title"><h1>${escapeHtml(form.tema)}</h1><p>${escapeHtml(tipoLabel.value)} · ${escapeHtml(nivelLabel.value)}</p></div>`);
      for (const tab of tabs.value) {
        if (secciones[tab.key]) {
          const content = DOMPurify.sanitize(marked.parse(secciones[tab.key]));
          slides.push(`<div class="slide"><h2>${tab.icon} ${escapeHtml(tab.label)}</h2><div class="slide-body">${content}</div></div>`);
        }
      }
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(form.tema)} - Presentación</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Arial,sans-serif;background:#111;color:#fff;overflow:hidden;}
.slide{width:100vw;height:100vh;padding:60px 80px;display:none;flex-direction:column;justify-content:center;}
.slide.active{display:flex;}
.slide-title{align-items:center;text-align:center;background:linear-gradient(135deg,#0a0a0a,#1a1a2e);}
.slide-title h1{font-size:56px;color:#10a37f;margin-bottom:16px;}
.slide-title p{font-size:22px;color:#888;}
.slide h2{font-size:32px;color:#10a37f;margin-bottom:28px;padding-bottom:12px;border-bottom:2px solid #333;}
.slide-body{font-size:20px;line-height:1.8;overflow-y:auto;max-height:75vh;}
.slide-body ul,.slide-body ol{margin-left:28px;}
.slide-body li{margin-bottom:8px;}
.slide-body strong{color:#10a37f;}
.nav{position:fixed;bottom:20px;right:20px;display:flex;gap:8px;z-index:10;}
.nav button{padding:10px 20px;background:#222;border:1px solid #444;color:#fff;border-radius:8px;cursor:pointer;font-size:14px;}
.nav button:hover{background:#10a37f;border-color:#10a37f;}
.counter{position:fixed;bottom:24px;left:20px;color:#555;font-size:14px;}
</style></head><body>
${slides.join("\n")}
<div class="nav"><button onclick="prev()">← Anterior</button><button onclick="nxt()">Siguiente →</button></div>
<div class="counter" id="counter"></div>
<script>
let c=0;const s=document.querySelectorAll('.slide');
function show(){s.forEach((e,i)=>e.classList.toggle('active',i===c));document.getElementById('counter').textContent=(c+1)+'/'+s.length;}
function nxt(){if(c<s.length-1){c++;show();}}
function prev(){if(c>0){c--;show();}}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')nxt();if(e.key==='ArrowLeft')prev();if(e.key==='Escape')window.close();});
show();
</script></body></html>`;
      const win = window.open("", "_blank");
      win.document.write(html);
      win.document.close();
    }

    // ── API: Generar ───────────────────────────────────────────────
    async function generar() {
      if (!form.tema.trim()) return;
      loading.value = true; isStreaming.value = true; streamingText.value = "";
      error.value = ""; activeTab.value = "resumen"; sidebarOpen.value = false;
      Object.keys(secciones).forEach(k => secciones[k] = "");
      versionHistory.value = []; currentVersion.value = 0;

      try {
        const res = await fetch("/api/generar-stream", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tema: form.tema.trim(), nivel: form.nivel, tipo: form.tipo, idioma: form.idioma, personas: form.personas || null }),
        });
        if (!res.ok) { const e = await res.json().catch(() => ({})); showError(e.error || "Error del servidor."); loading.value = false; isStreaming.value = false; return; }
        const reader = res.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n"); buffer = lines.pop();
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.chunk) { streamingText.value += data.chunk; secciones.resumen = streamingText.value; }
                if (data.done) { updateSections(data); guardarHistorial(); playNotificationSound(); saveVersion(t("vOriginal")); broadcastContent(); }
                if (data.error) showError(data.error);
              } catch {}
            }
          }
        }
      } catch { showError("Error de conexión."); }
      finally { loading.value = false; isStreaming.value = false; }
    }

    async function humanizar() {
      if (!textoCompleto.value) return; loading.value = true;
      try {
        const res = await fetch("/api/humanizar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: textoCompleto.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        updateSections(data); playNotificationSound(); saveVersion(t("vHumanized")); broadcastContent();
      } catch { showError("Error de conexión."); } finally { loading.value = false; }
    }

    async function acortar() {
      if (!textoCompleto.value) return; loading.value = true;
      try {
        const res = await fetch("/api/acortar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: textoCompleto.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        updateSections(data); playNotificationSound(); saveVersion(t("vShortened")); broadcastContent();
      } catch { showError("Error de conexión."); } finally { loading.value = false; }
    }

    async function ampliarSeccion() {
      const text = secciones[activeTab.value]; if (!text) return; expandLoading.value = true;
      try {
        const res = await fetch("/api/ampliar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seccion: text, tema: form.tema }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        secciones[activeTab.value] = data.texto;
      } catch { showError("Error de conexión."); } finally { expandLoading.value = false; }
    }

    // ── Chat ───────────────────────────────────────────────────────
    async function enviarChat() {
      if (!chatInput.value.trim()) return;
      const pregunta = chatInput.value.trim();
      chatMessages.value.push({ role: "user", text: pregunta }); chatInput.value = ""; chatLoading.value = true; scrollChatToBottom();
      try {
        const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pregunta, contexto: textoCompleto.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        chatMessages.value.push({ role: "ai", text: data.respuesta }); scrollChatToBottom();
      } catch { showError("Error de conexión."); } finally { chatLoading.value = false; }
    }

    // ── Quiz ───────────────────────────────────────────────────────
    async function generarQuiz() {
      quizLoading.value = true; quizData.value = null; quizChecked.value = false;
      Object.keys(quizAnswers).forEach(k => delete quizAnswers[k]);
      try {
        const res = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tema: form.tema, texto: textoCompleto.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        quizData.value = data.quiz;
      } catch { showError("Error de conexión."); } finally { quizLoading.value = false; }
    }
    function verificarQuiz() {
      quizChecked.value = true; playNotificationSound();
      if (quizScore.value && quizScore.value.correct >= Math.ceil(quizScore.value.total * 0.75)) launchConfetti();
    }

    // ── Flashcards ─────────────────────────────────────────────────
    async function generarFlashcards() {
      flashcardsLoading.value = true; flashcardsData.value = null; flashcardIndex.value = 0; flashcardFlipped.value = false;
      try {
        const res = await fetch("/api/flashcards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tema: form.tema, texto: textoCompleto.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        flashcardsData.value = data.flashcards;
      } catch { showError("Error de conexión."); } finally { flashcardsLoading.value = false; }
    }
    function flipFlashcard() { flashcardFlipped.value = !flashcardFlipped.value; }
    function nextFlashcard() { if (flashcardsData.value && flashcardIndex.value < flashcardsData.value.length - 1) { flashcardIndex.value++; flashcardFlipped.value = false; } }
    function prevFlashcard() { if (flashcardIndex.value > 0) { flashcardIndex.value--; flashcardFlipped.value = false; } }

    // ── Exam ───────────────────────────────────────────────────────
    async function generarExamen() {
      examLoading.value = true; examData.value = null; examResult.value = null;
      Object.keys(examAnswers).forEach(k => delete examAnswers[k]);
      try {
        const res = await fetch("/api/examen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tema: form.tema, texto: textoCompleto.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        examData.value = data.preguntas;
        examTimeLeft.value = data.preguntas.length * 5 * 60; // 5 min per question
        examTimeRunning.value = true;
        examInterval = setInterval(() => {
          if (examTimeLeft.value > 0) examTimeLeft.value--;
          else { clearInterval(examInterval); examTimeRunning.value = false; entregarExamen(); }
        }, 1000);
      } catch { showError("Error de conexión."); } finally { examLoading.value = false; }
    }
    async function entregarExamen() {
      clearInterval(examInterval); examTimeRunning.value = false; examEvaluating.value = true;
      const respuestas = examData.value.map((q, i) => ({ pregunta: q.pregunta, respuesta_esperada: q.respuesta_esperada, respuesta: examAnswers[i] || "" }));
      try {
        const res = await fetch("/api/evaluar-examen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tema: form.tema, respuestas }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        examResult.value = data; playNotificationSound();
        if (data.calificacion_general >= 8) launchConfetti();
      } catch { showError("Error de conexión."); } finally { examEvaluating.value = false; }
    }

    // ── Grader ─────────────────────────────────────────────────────
    async function calificar() {
      if (!graderAnswer.value.trim()) return; graderLoading.value = true; graderResult.value = null;
      try {
        const res = await fetch("/api/calificar", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tema: form.tema, pregunta: graderQuestion.value, respuesta: graderAnswer.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        graderResult.value = data; playNotificationSound();
      } catch { showError("Error de conexión."); } finally { graderLoading.value = false; }
    }

    // ── Share ──────────────────────────────────────────────────────
    async function compartir() {
      shareLoading.value = true; shareLink.value = "";
      try {
        const res = await fetch("/api/compartir", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tema: form.tema, tipo: form.tipo, nivel: form.nivel, secciones: { ...secciones }, textoCompleto: textoCompleto.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        shareLink.value = `${window.location.origin}?shared=${data.id}`;
        await navigator.clipboard.writeText(shareLink.value);
      } catch { showError("Error de conexión."); } finally { shareLoading.value = false; }
    }

    // ── Originality ─────────────────────────────────────────────────
    async function analizarOriginalidad() {
      if (!textoCompleto.value) return; originalityLoading.value = true; originalityResult.value = null;
      try {
        const res = await fetch("/api/originalidad", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: textoCompleto.value }) });
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        originalityResult.value = data;
      } catch { showError("Error de conexión."); } finally { originalityLoading.value = false; }
    }

    // ── Images ────────────────────────────────────────────────────────
    async function buscarImagenes() {
      const q = imageQuery.value.trim() || form.tema;
      if (!q) return; imagesLoading.value = true; imagesData.value = null;
      try {
        const res = await fetch(`/api/imagenes?q=${encodeURIComponent(q)}`);
        const data = await res.json(); if (data.error) { showError(data.error); return; }
        imagesData.value = data.images;
      } catch { showError("Error de conexión."); } finally { imagesLoading.value = false; }
    }

    // ── Collaboration ─────────────────────────────────────────────────
    function initSocket() {
      if (socket) return;
      socket = io();
      socket.on("room-created", (data) => { collabRoom.value = data.roomId; collabUserCount.value = 1; });
      socket.on("room-joined", (data) => {
        collabRoom.value = data.roomId; collabUserCount.value = data.userCount;
        collabNotes.value = data.notes || [];
        if (data.secciones && Object.values(data.secciones).some(v => v)) {
          Object.assign(secciones, data.secciones); textoCompleto.value = data.textoCompleto;
          form.tema = data.tema || form.tema;
        }
      });
      socket.on("room-error", (msg) => { showError(msg); });
      socket.on("user-count", (count) => { collabUserCount.value = count; });
      socket.on("content-updated", (data) => {
        Object.assign(secciones, data.secciones); textoCompleto.value = data.textoCompleto;
        if (data.tema) form.tema = data.tema;
      });
      socket.on("new-note", (note) => {
        collabNotes.value.push(note);
        nextTick(() => { if (collabNotesContainer.value) collabNotesContainer.value.scrollTop = collabNotesContainer.value.scrollHeight; });
      });
    }

    function crearSala() {
      initSocket();
      socket.emit("create-room", { tema: form.tema, secciones: { ...secciones }, textoCompleto: textoCompleto.value });
    }

    function unirseSala() {
      if (!collabJoinCode.value.trim()) return;
      initSocket();
      socket.emit("join-room", collabJoinCode.value.trim());
    }

    function salirSala() {
      if (socket) { socket.disconnect(); socket = null; }
      collabRoom.value = ""; collabUserCount.value = 0; collabNotes.value = [];
    }

    function enviarNota() {
      if (!collabNoteInput.value.trim() || !socket) return;
      socket.emit("send-note", collabNoteInput.value.trim());
      collabNoteInput.value = "";
    }

    async function copiarCodigoSala() {
      try { await navigator.clipboard.writeText(collabRoom.value); } catch {}
    }

    // Broadcast content changes to room
    function broadcastContent() {
      if (socket && collabRoom.value) {
        socket.emit("update-content", { secciones: { ...secciones }, textoCompleto: textoCompleto.value, tema: form.tema });
      }
    }

    // ── Pomodoro ───────────────────────────────────────────────────
    function startPomodoro() {
      if (pomodoroRunning.value) { clearInterval(pomodoroInterval); pomodoroRunning.value = false; return; }
      pomodoroRunning.value = true;
      pomodoroInterval = setInterval(() => {
        if (pomodoroTime.value > 0) pomodoroTime.value--;
        else {
          clearInterval(pomodoroInterval); pomodoroRunning.value = false; playSound(pomodoroSound.value);
          if (!pomodoroIsBreak.value) { pomodoroIsBreak.value = true; pomodoroTime.value = 5 * 60; pomodoroTotal.value = 5 * 60; }
          else { pomodoroIsBreak.value = false; pomodoroTime.value = 25 * 60; pomodoroTotal.value = 25 * 60; }
        }
      }, 1000);
    }
    function resetPomodoro() { clearInterval(pomodoroInterval); pomodoroRunning.value = false; pomodoroIsBreak.value = false; pomodoroTime.value = 25 * 60; pomodoroTotal.value = 25 * 60; }

    function togglePanel(panel) { activePanel.value = activePanel.value === panel ? "" : panel; }

    async function copiarTodo() {
      const parts = []; for (const tab of tabs.value) { if (secciones[tab.key]) parts.push(`${tab.label.toUpperCase()}\n${"=".repeat(tab.label.length)}\n${secciones[tab.key]}`); }
      try { await navigator.clipboard.writeText(parts.join("\n\n")); copiado.value = true; setTimeout(() => (copiado.value = false), 2000); }
      catch { showError("No se pudo copiar."); }
    }

    // ── Keyboard shortcuts ─────────────────────────────────────────
    function handleKeyboard(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
        if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); if (!loading.value && form.tema.trim()) generar(); }
        return;
      }
      if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); if (!loading.value && form.tema.trim()) generar(); }
      else if (e.key === "Escape") { if (focusMode.value) focusMode.value = false; else if (showShortcuts.value) showShortcuts.value = false; else if (activePanel.value) activePanel.value = ""; }
      else if (e.key === "ArrowLeft" && hasResult.value) {
        const keys = tabs.value.map(t => t.key); const idx = keys.indexOf(activeTab.value);
        if (idx > 0) activeTab.value = keys[idx - 1];
      }
      else if (e.key === "ArrowRight" && hasResult.value) {
        const keys = tabs.value.map(t => t.key); const idx = keys.indexOf(activeTab.value);
        if (idx < keys.length - 1) activeTab.value = keys[idx + 1];
      }
      else if (e.key === "f" || e.key === "F") { if (hasResult.value) focusMode.value = !focusMode.value; }
      else if (e.key === "?") { showShortcuts.value = !showShortcuts.value; }
    }

    // ── Load shared ────────────────────────────────────────────────
    async function loadSharedTask() {
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get("shared"); if (!sharedId) return;
      try {
        const res = await fetch(`/api/compartir/${sharedId}`); const data = await res.json(); if (data.error) return;
        form.tema = data.tema; form.tipo = data.tipo; form.nivel = data.nivel;
        Object.assign(secciones, data.secciones); textoCompleto.value = data.textoCompleto;
      } catch {}
    }

    // ── Init ───────────────────────────────────────────────────────
    onMounted(() => {
      const savedTheme = localStorage.getItem("schoolia-theme");
      if (savedTheme === "light") { darkMode.value = false; document.body.classList.add("light-mode"); }
      try { const saved = localStorage.getItem("schoolia-historial"); if (saved) historial.value = JSON.parse(saved); } catch {}
      const savedLang = localStorage.getItem("schoolia-lang"); if (savedLang) form.idioma = savedLang;
      const savedSound = localStorage.getItem("schoolia-pomodoro-sound"); if (savedSound) pomodoroSound.value = savedSound;
      loadSharedTask();
      document.addEventListener("keydown", handleKeyboard);
      if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    });

    watch(() => form.idioma, (val) => { localStorage.setItem("schoolia-lang", val); });
    watch(pomodoroSound, (val) => { localStorage.setItem("schoolia-pomodoro-sound", val); });

    return {
      form, secciones, textoCompleto, loading, error, activeTab, copiado, sidebarOpen, hasResult, darkMode, historial,
      tabs, tipoLabel, nivelLabel, wordCount, streamingText, isStreaming, focusMode, showShortcuts, isSpeaking,
      suggestedTopics, confettiCanvas,
      activePanel, chatMessages, chatInput, chatLoading, chatContainer,
      quizData, quizAnswers, quizChecked, quizLoading, quizScore,
      flashcardsData, flashcardIndex, flashcardFlipped, flashcardsLoading,
      graderQuestion, graderAnswer, graderResult, graderLoading,
      shareLink, shareLoading, expandLoading,
      examData, examAnswers, examResult, examLoading, examEvaluating, examTimeRunning, examTimerDisplay,
      versionHistory, currentVersion,
      pomodoroTime, pomodoroRunning, pomodoroIsBreak, pomodoroDisplay, pomodoroProgress, pomodoroSound,
      t, generar, humanizar, acortar, copiarTodo, renderMarkdown, escapeHtml,
      toggleTheme, cargarHistorial, limpiarHistorial,
      exportarPDF, exportarWord, exportarSlides, countWords, ampliarSeccion,
      enviarChat, generarQuiz, verificarQuiz,
      generarFlashcards, flipFlashcard, nextFlashcard, prevFlashcard,
      generarExamen, entregarExamen,
      calificar, compartir, startPomodoro, resetPomodoro, togglePanel,
      speakSection, restoreVersion, launchConfetti,
      originalityResult, originalityLoading, analizarOriginalidad,
      imageQuery, imagesData, imagesLoading, buscarImagenes,
      collabRoom, collabUserCount, collabNotes, collabNoteInput, collabJoinCode, collabNotesContainer,
      crearSala, unirseSala, salirSala, enviarNota, copiarCodigoSala,
    };
  },
}).mount("#app");
