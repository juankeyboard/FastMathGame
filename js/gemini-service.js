/**
 * GEMINI SERVICE - Integración con Firebase AI Logic (Modular)
 * Baldora - AI Coach / Análisis Cognitivo
 * Versión: 3.0 (Modular ES6)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-ai.js";

// Configuración de Firebase (debe coincidir con la de index.html)
const firebaseConfig = {
    apiKey: "AIzaSyDe9UK69r-s0ZiFIb2fNtS_AOouv2bWBhE",
    authDomain: "baldora-89866.firebaseapp.com",
    databaseURL: "https://baldora-89866-default-rtdb.firebaseio.com",
    projectId: "baldora-89866",
    storageBucket: "baldora-89866.firebasestorage.app",
    messagingSenderId: "801097863804",
    appId: "1:801097863804:web:6526f17db5b8443d27eff9",
    measurementId: "G-RHWK9J2Z3S"
};

// Inicializar Firebase App (Modular)
// Nota: Usamos un nombre de app distinto para evitar conflicto con la app compat global si existe
let app;
try {
    app = initializeApp(firebaseConfig, "GeminiServiceApp");
} catch (e) {
    // Si ya existe, intentamos obtenerla o usar la default
    app = initializeApp(firebaseConfig);
}

// Inicializar AI Service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Inicializar Modelo
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

const GeminiService = {
    currentState: 'idle',

    /**
     * Método principal llamado por el botón "Analizar"
     */
    async triggerAnalysis() {
        this.setUIState('loading');

        // Obtener historial de la sesión actual (DataManager es global)
        const history = window.DataManager ? window.DataManager.sessionData : [];

        if (!history || history.length === 0) {
            this.handleError(new Error("No hay datos de sesión para analizar."));
            return;
        }

        // Generar CSV usando PapaParse (Papa es global)
        const csvContent = window.Papa.unparse(history, {
            header: true,
            columns: [
                'timestamp', 'nickname', 'game_mode',
                'factor_a', 'factor_b', 'user_input',
                'correct_result', 'is_correct', 'response_time'
            ]
        });

        const promptText = this.buildPrompt(csvContent);

        try {
            console.log('[GeminiService] Usando Firebase AI Logic (Modular)...');
            const result = await model.generateContent(promptText);
            const response = await result.response;
            const aiText = response.text();

            this.showResult(aiText);
            window.lastAIAnalysis = aiText;

        } catch (error) {
            console.error('Error Gemini:', error);
            this.handleError(error);
        }
    },

    buildPrompt(csvContent) {
        return `Actúa como un experto en neuroeducación y analista de datos.
A continuación te proporciono un archivo CSV con los resultados de la partida actual de un estudiante.

Datos del CSV:
${csvContent}

Instrucciones:
Analiza el desempeño del jugador basándote en los datos del CSV y devuelve un resumen en 3 párrafos cortos (Máximo 150 palabras total):

1. Párrafo 1: Refuerzo positivo del progreso y análisis general de precisión/velocidad.
2. Párrafo 2: Identificación precisa de "puntos de fricción" (tablas o multiplicaciones específicas donde falló o fue lento).
3. Párrafo 3: Prescripción de ejercicios concretos (ej. "Practica la tabla del 7 escribiéndola a mano").

Reglas de Tono y Formato:
1. TONO: Debe ser SIEMPRE positivo, pedagógico y motivador.
2. NO uses emoticones ni emojis.
3. Responde en español.`;
    },

    setUIState(state) {
        this.currentState = state;
        const idleDiv = document.getElementById('ai-state-idle');
        const loadingDiv = document.getElementById('ai-state-loading');
        const successDiv = document.getElementById('ai-state-success');

        if (!idleDiv || !loadingDiv || !successDiv) return;

        idleDiv.style.display = 'none';
        loadingDiv.style.display = 'none';
        successDiv.style.display = 'none';

        if (state === 'idle') idleDiv.style.display = 'block';
        if (state === 'loading') loadingDiv.style.display = 'flex';
        if (state === 'success') successDiv.style.display = 'block';
    },

    showResult(text) {
        const textContainer = document.getElementById('ai-response-text');
        if (textContainer) textContainer.innerText = text;
        this.setUIState('success');
    },

    handleError(error) {
        const errorMessage = error.message || 'Error desconocido';
        console.error('Análisis de depuración - Error:', errorMessage);

        const textContainer = document.getElementById('ai-response-text');
        if (textContainer) {
            textContainer.innerHTML = `
                <p style="color: #c0392b; margin-bottom: 10px; font-weight: 500;">
                    No se pudo conectar con el entrenador virtual.
                </p>
                <p style="font-size: 0.85rem; color: var(--clr-rock-500); margin-bottom: 15px;">
                    ${errorMessage}
                </p>
                <button onclick="GeminiService.triggerAnalysis()" class="btn-secondary" style="font-size: 0.9rem;">
                    Reintentar
                </button>
            `;
        }
        this.setUIState('success');
    },

    reset() {
        this.setUIState('idle');
        const textContainer = document.getElementById('ai-response-text');
        if (textContainer) textContainer.innerText = '';
        window.lastAIAnalysis = null;
    }
};

// Exponer globalmente para que app.js pueda usarlo
window.GeminiService = GeminiService;
