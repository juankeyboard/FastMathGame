/**
 * GEMINI SERVICE - Integración con Gemini 1.5 Flash
 * Baldora - AI Coach / Análisis Cognitivo
 * Versión: 1.1
 * 
 * NOTA: La API Key debe configurarse en js/api-config.js (archivo gitignored)
 * Para producción en Firebase, usar Cloud Functions
 */

const GeminiService = {
    // API Configuration - Se carga desde api-config.js (no incluido en Git)
    get apiKey() {
        return (window.API_CONFIG && window.API_CONFIG.GEMINI_API_KEY) || null;
    },
    get apiUrl() {
        return (window.API_CONFIG && window.API_CONFIG.GEMINI_API_URL) ||
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    },

    // Estado actual del servicio
    currentState: 'idle', // idle, loading, success, error

    /**
     * Método principal llamado por el botón "Analizar"
     */
    async triggerAnalysis() {
        // 1. Cambiar a estado LOADING
        this.setUIState('loading');

        // Obtener datos de la sesión
        const history = DataManager.sessionData || [];
        const stats = DataManager.getSessionStats();

        // Formatear datos para el prompt
        const promptData = this.formatDataForPrompt(history, stats);

        // Construir el prompt completo
        const promptText = `
Actúa como un experto en neuroeducación y memoria.
Analiza los siguientes datos de una sesión de entrenamiento de tablas de multiplicar:

${promptData}

Instrucciones de Respuesta (Estrictas):
1. La respuesta debe tener EXACTAMENTE 3 párrafos cortos.
   - Párrafo 1: Resumen general del rendimiento (máximo 2 oraciones).
   - Párrafo 2: Análisis específico de las fallas (si las hay).
   - Párrafo 3: Recomendaciones concretas de mejora, incluyendo obligatoriamente ejercicios de escritura a mano alzada para reforzar la memoria.

Reglas de Tono y Formato:
1. TONO: Debe ser SIEMPRE positivo, pedagógico y motivador. Nunca uses lenguaje negativo o crítico. Si hay errores, enfócalos como oportunidades de mejora.
2. NO uses emoticones ni emojis.
3. Responde en español.
4. Limita la respuesta total a máximo 150 palabras.
`;

        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error("No se recibió respuesta del modelo");
            }

            const aiText = data.candidates[0].content.parts[0].text;

            // 2. Éxito: Mostrar texto y REVELAR GRÁFICAS
            this.showResult(aiText);

            // Guardar para el PDF
            window.lastAIAnalysis = aiText;

        } catch (error) {
            console.error('Error Gemini:', error);
            // 3. Error: Mostrar mensaje de error y permitir reintentar
            this.handleError(error);
        }
    },

    /**
     * Manejo de Estados Visuales (UI)
     */
    setUIState(state) {
        this.currentState = state;

        const idleDiv = document.getElementById('ai-state-idle');
        const loadingDiv = document.getElementById('ai-state-loading');
        const successDiv = document.getElementById('ai-state-success');

        // Si los elementos no existen, salir
        if (!idleDiv || !loadingDiv || !successDiv) {
            console.warn('Elementos de UI de AI no encontrados');
            return;
        }

        // Ocultar todo primero
        idleDiv.style.display = 'none';
        loadingDiv.style.display = 'none';
        successDiv.style.display = 'none';

        switch (state) {
            case 'idle':
                idleDiv.style.display = 'block';
                break;
            case 'loading':
                loadingDiv.style.display = 'flex';
                break;
            case 'success':
                successDiv.style.display = 'block';
                break;
        }
    },

    /**
     * Muestra el resultado del análisis y revela las gráficas
     */
    showResult(text) {
        // A. Mostrar Texto en la burbuja
        const textContainer = document.getElementById('ai-response-text');
        if (textContainer) {
            textContainer.innerText = text;
        }
        this.setUIState('success');

        // B. REVELAR GRÁFICAS (La parte clave)
        const chartsArea = document.getElementById('dashboard-charts-area');
        if (chartsArea) {
            chartsArea.classList.remove('charts-hidden');
            chartsArea.classList.add('charts-visible');

            // Forzar re-render de Chart.js si es necesario
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        }
    },

    /**
     * Maneja errores de la API - ofrece análisis local de fallback
     */
    handleError(error) {
        const errorMessage = error.message || 'Error desconocido';
        console.warn('Gemini API no disponible, usando análisis local:', errorMessage);

        // Generar análisis local de fallback
        const localAnalysis = this.generateLocalAnalysis();

        // Mostrar en la burbuja de respuesta con indicación de que es análisis local
        const textContainer = document.getElementById('ai-response-text');
        if (textContainer) {
            textContainer.innerHTML = `
                <p style="font-size: 0.75rem; color: var(--clr-rock-500); margin-bottom: 8px; font-style: italic;">
                    (Análisis local - conexión a IA no disponible)
                </p>
                <p style="line-height: 1.6;">${localAnalysis}</p>
            `;
        }

        // Guardar para el PDF
        window.lastAIAnalysis = localAnalysis;

        // Revelar las gráficas
        this.setUIState('success');
        const chartsArea = document.getElementById('dashboard-charts-area');
        if (chartsArea) {
            chartsArea.classList.remove('charts-hidden');
            chartsArea.classList.add('charts-visible');
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        }
    },

    /**
     * Genera un análisis local cuando la API no está disponible
     */
    generateLocalAnalysis() {
        const history = DataManager.sessionData || [];
        const stats = DataManager.getSessionStats();

        if (!history || history.length === 0) {
            return "No hay suficientes datos para generar un análisis. Completa una sesión de práctica primero.";
        }

        const accuracy = parseFloat(stats.accuracy);
        const total = stats.total;
        const errors = history.filter(h => h.is_correct === 0);

        let analysis = "";

        // Párrafo 1: Resumen general
        if (accuracy >= 90) {
            analysis += "Excelente sesión de práctica. Tu dominio de las tablas de multiplicar es sobresaliente.";
        } else if (accuracy >= 70) {
            analysis += "Buen trabajo en esta sesión. Muestras un progreso sólido en el dominio de las tablas.";
        } else if (accuracy >= 50) {
            analysis += "Sesión de práctica completada. Hay oportunidades claras para mejorar con más práctica.";
        } else {
            analysis += "Has dado el primer paso practicando. Cada intento te acerca más al dominio de las tablas.";
        }

        analysis += " ";

        // Párrafo 2: Análisis de errores
        if (errors.length === 0) {
            analysis += "No cometiste ningún error en esta sesión, lo cual demuestra una excelente preparación. ";
        } else {
            const errorTables = [...new Set(errors.map(e => e.factor_a))].sort((a, b) => a - b);
            if (errorTables.length <= 3) {
                analysis += `Las tablas que necesitan más atención son: ${errorTables.join(', ')}. Enfócate en practicarlas más. `;
            } else {
                analysis += `Se detectaron ${errors.length} errores distribuidos en varias tablas. Practica de forma consistente para mejorar. `;
            }
        }

        // Párrafo 3: Recomendaciones
        analysis += "Te recomiendo escribir a mano las operaciones que más te cuestan. La escritura manual activa áreas del cerebro que refuerzan la memoria a largo plazo. Dedica 5 minutos diarios a escribir las tablas problemáticas en un cuaderno.";

        return analysis;
    },

    /**
     * Permite saltar el análisis y ver las gráficas directamente
     */
    skipAnalysis() {
        const textContainer = document.getElementById('ai-response-text');
        if (textContainer) {
            textContainer.innerText = 'Análisis omitido. Revisa tus estadísticas abajo.';
        }
        this.showResult('');
    },

    /**
     * Resetea el estado para una nueva partida
     */
    reset() {
        this.setUIState('idle');

        // Ocultar gráficas
        const chartsArea = document.getElementById('dashboard-charts-area');
        if (chartsArea) {
            chartsArea.classList.add('charts-hidden');
            chartsArea.classList.remove('charts-visible');
        }

        // Limpiar texto de respuesta
        const textContainer = document.getElementById('ai-response-text');
        if (textContainer) {
            textContainer.innerText = '';
        }

        // Limpiar análisis guardado
        window.lastAIAnalysis = null;
    },

    /**
     * Formatea los datos de sesión para el prompt
     */
    formatDataForPrompt(history, stats) {
        if (!history || history.length === 0) {
            return 'Sin datos de sesión.';
        }

        // Estadísticas generales
        let prompt = `ESTADÍSTICAS GENERALES:\n`;
        prompt += `- Total de operaciones: ${stats.total}\n`;
        prompt += `- Respuestas correctas: ${stats.correct}\n`;
        prompt += `- Respuestas incorrectas: ${stats.total - stats.correct}\n`;
        prompt += `- Precisión: ${stats.accuracy}%\n`;
        prompt += `- Tiempo promedio de respuesta: ${stats.avgTime}ms\n\n`;

        // Errores específicos
        const errors = history.filter(h => h.is_correct === 0);
        if (errors.length > 0) {
            prompt += `OPERACIONES CON ERRORES:\n`;
            errors.forEach(e => {
                const correctAnswer = e.factor_a * e.factor_b;
                prompt += `- ${e.factor_a} × ${e.factor_b} = ${correctAnswer} (el jugador respondió: ${e.user_input})\n`;
            });
        } else {
            prompt += `OPERACIONES CON ERRORES: Ninguna - ¡Sesión perfecta!\n`;
        }

        // Operaciones más lentas
        const sortedByTime = [...history].sort((a, b) => b.response_time - a.response_time);
        const slowest = sortedByTime.slice(0, 3);

        prompt += `\nOPERACIONES MÁS LENTAS:\n`;
        slowest.forEach(s => {
            prompt += `- ${s.factor_a} × ${s.factor_b}: ${s.response_time}ms\n`;
        });

        return prompt;
    }
};

// Exponer globalmente
window.GeminiService = GeminiService;
