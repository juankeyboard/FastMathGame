/**
 * GEMINI SERVICE - Integración con Firebase AI Logic (Modular - Gemini Developer API)
 * Baldora - AI Coach / Análisis Cognitivo
 * Versión: 7.0 (Modular con Import Map)
 */

import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// Configuración de Firebase
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

// 1. Initialize FirebaseApp
let app;
try {
    app = initializeApp(firebaseConfig, "GeminiModularApp");
} catch (e) {
    app = initializeApp(firebaseConfig);
}

// 2. Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// 3. Create a `GenerativeModel` instance
// Usamos gemini-2.5-flash según documentación reciente
// 3. Create a `GenerativeModel` instance
// Usamos el ID de la plantilla definida en Firebase Console ("baldora")
// Esto permite cambiar el prompt y el modelo (gemini-2.5-pro) desde la consola sin tocar código.
const model = getGenerativeModel(ai, { model: "baldora" });

const GeminiService = {
    currentState: 'idle',

    async triggerAnalysis() {
        console.log('[GeminiService Modular] Trigger analysis solicitado.');
        this.setUIState('loading');

        // Obtener historial (DataManager es global)
        const history = window.DataManager ? window.DataManager.sessionData : [];

        if (!history || history.length === 0) {
            this.handleError(new Error("No hay datos de sesión para analizar."));
            return;
        }

        // Generar CSV
        let csvContent = "";
        if (window.Papa) {
            csvContent = window.Papa.unparse(history, {
                header: true,
                columns: [
                    'timestamp', 'nickname', 'game_mode',
                    'factor_a', 'factor_b', 'user_input',
                    'correct_result', 'is_correct', 'response_time'
                ]
            });
        } else {
            this.handleError(new Error("Librería PapaParse no cargada."));
            return;
        }

        try {
            console.log('[GeminiService Modular] Enviando datos a la plantilla Baldora...');
            
            // Al usar una plantilla, pasamos un objeto con las variables definidas en el esquema (csv_data)
            // No enviamos el prompt de texto, solo los datos.
            const result = await model.generateContent({
                csv_data: csvContent
            });
            
            const response = await result.response;
            const aiText = response.text();

            console.log('[GeminiService Modular] Respuesta recibida.');
            this.showResult(aiText);
            window.lastAIAnalysis = aiText;

        } catch (error) {
            console.error('[GeminiService Modular] Error:', error);
            this.handleError(error);
        }
    },

    // buildPrompt ya no es necesario porque el prompt vive en Firebase Console
    // Se mantiene vacío o se elimina para limpieza
    buildPrompt(csvContent) {
        return ""; 
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
        if (textContainer) {
            textContainer.innerHTML = text.replace(/\n/g, '<br>');
        }
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

// EXPOSICIÓN GLOBAL
window.GeminiService = GeminiService;
