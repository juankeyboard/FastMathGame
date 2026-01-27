/**
 * GEMINI SERVICE - Integración con Firebase AI Logic (Gemini Developer API)
 * Baldora - AI Coach / Análisis Cognitivo
 * Versión: 15.0 (Modelo directo gemini-2.5-flash-lite + App Check)
 */

import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// Configuración de Firebase (obtenida de window.firebaseConfig definida en index.html)
const firebaseConfig = window.firebaseConfig;

if (!firebaseConfig) {
    console.error("[GeminiService] Firebase Config no encontrada. Verifique index.html");
}

// Initialize FirebaseApp
let firebaseApp;
try {
    firebaseApp = initializeApp(firebaseConfig, "GeminiModularApp");
} catch (e) {
    // Si ya existe, usar esa instancia
    firebaseApp = initializeApp(firebaseConfig);
}

// Inicializar App Check con reCAPTCHA v3
const RECAPTCHA_SITE_KEY = '6LdHG1gsAAAAAHfo4psSdnoXJobJZL0byWyj0eSV';

// En desarrollo local, habilitar modo debug
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
});

console.log("[GeminiService] App Check inicializado correctamente.");

// Initialize the Gemini Developer API backend service
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

// Create a GenerativeModel instance with gemini-2.5-flash-lite
// Este es el modelo directo de Gemini Developer API
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash-lite" });

console.log("[GeminiService] Modelo gemini-2.5-flash-lite inicializado.");

const GeminiService = {
    currentState: 'idle',

    async triggerAnalysis() {
        console.log('[GeminiService] Trigger analysis solicitado.');

        // Confirmación visual inmediata en el botón
        const btn = document.querySelector('.ai-action-btn');
        if (btn) {
            btn.innerText = 'Procesando...';
            btn.disabled = true;
            btn.style.opacity = '0.7';
            btn.style.cursor = 'wait';
        }

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

        // Construir el prompt completo
        const prompt = this.buildPrompt(csvContent);

        try {
            console.log('[GeminiService] Enviando prompt a Gemini 2.5 Flash Lite...');

            // Llamar a generateContent con el prompt de texto
            const result = await model.generateContent(prompt);

            const response = result.response;
            const text = response.text();

            console.log('[GeminiService] Respuesta recibida.');
            this.showResult(text);
            window.lastAIAnalysis = text;

        } catch (error) {
            console.error('[GeminiService] Error:', error);
            this.handleError(error);
        }
    },

    buildPrompt(csvContent) {
        return `Actúa como un experto en aprendizaje acelerado y análisis de datos educativos para examinar mis resultados de multiplicaciones (adjuntos en CSV), generando un reporte estricto que inicie con un diagnóstico ejecutivo de mi estado actual, comparando mi precisión y velocidad frente a estándares de maestría para evaluar mi progreso y nivel de confianza.

Datos del CSV:
${csvContent}

Continúa con observaciones detalladas que identifiquen y expliquen la causa raíz de mis patrones de error, buscando 'cables cruzados' o fallos por velocidad para señalar mis tablas débiles de hoy, y concluye con un plan de acción práctico que incluya tres ejercicios breves de escritura y mnemotecnia, una rima para mi error más frecuente y una regla de oro mental para aplicar.

Reglas de Tono y Formato:
1. TONO: Debe ser SIEMPRE positivo, pedagógico y motivador.
2. NO uses emoticones ni emojis.
3. Responde en español.
4. Sé conciso pero profundo.`;
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

        // Restaurar botón
        const btn = document.querySelector('.ai-action-btn');
        if (btn) {
            btn.innerText = 'Analizar mis Resultados';
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
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

        // Restaurar botón
        const btn = document.querySelector('.ai-action-btn');
        if (btn) {
            btn.innerText = 'Analizar mis Resultados';
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
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

console.log('[GeminiService] Script cargado. Usando Gemini Developer API directamente.');
