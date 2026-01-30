# Implementación de Respuesta API y Visualización de Resultados

> **⚠️ NOTA IMPORTANTE:** La implementación de estas nuevas funcionalidades debe realizarse con estricto cuidado de NO alterar ni interrumpir las características actuales del proyecto. El código nuevo (HTML, CSS y JS) debe ser aditivo y modular, asegurando que el flujo de juego, la configuración y el almacenamiento de datos existentes sigan operando correctamente.

Este documento detalla la implementación para manejar, estructurar y visualizar la respuesta de la API utilizando un diseño consistente con la estética de la aplicación (bloques amarillo claro, bordes redondeados y sombras).

## 1. Prompt de Consulta a la API

El prompt enviado a la API debe ser estricto para garantizar una respuesta JSON válida que pueda ser parseada directamente por el frontend.

**Prompt Sugerido:**

Se debe estructurar el mensaje a la API con roles definidos (System y User) para asegurar el comportamiento deseado.

**Role: System**
```text
Actúa como un experto en aprendizaje acelerado y análisis de datos educativos. Tu objetivo es analizar resultados de ejercicios de multiplicaciones y generar un reporte pedagógico positivo y motivador, formateado EXCLUSIVAMENTE como un objeto JSON válido.

Reglas:
1. TONO: SIEMPRE positivo, pedagógico y motivador.
2. NO uses emoticones ni emojis.
3. Responde en español.
4. ESTRUCTURA: Redacta la respuesta narrativa en exactamente 3 párrafos fluidos (uno para diagnóstico, uno para patrones, uno para plan).
5. FORMATO: PROHIBIDO usar viñetas, listas, guiones o saltos de línea dentro de los campos. Texto corrido en bloque.
6. FORMATO DE SALIDA: Entrega SOLAMENTE el objeto JSON crudo. No uses bloques de código markdown (```json) ni texto adicional.

El JSON debe tener exactamente esta estructura:
{
  "resumen_general": {
    "operacion_mas_rapida": "Texto descriptivo",
    "operacion_mas_lenta": "Texto descriptivo",
    "tiempo_promedio": "Valor en segundos",
    "porcentaje_asertividad": "Valor porcentual",
    "cantidad_buenas": 0,
    "cantidad_malas": 0
  },
  "patron_errores": "Diagnóstico ejecutivo y observaciones detalladas de patrones de error.",
  "plan_accion": "Plan de acción concreto con ejercicios ejercicios y mnemotecnias."
}
```

**Role: User**
```text
Examina mis resultados de multiplicaciones en CSV:

[INSERTAR_DATOS_DE_LA_SESION_AQUI]

Genera un diagnóstico ejecutivo, observaciones detalladas de patrones de error, y un plan de acción con ejercicios y mnemotecnias, respetando estrictamente el formato JSON solicitado.
```

## 2. Estructura de Datos (JSON Esperado)

La aplicación debe esperar y validar el siguiente objeto JSON:

```json
{
  "resumen_general": {
    "operacion_mas_rapida": "string",
    "operacion_mas_lenta": "string",
    "tiempo_promedio": "string",
    "porcentaje_asertividad": "string",
    "cantidad_buenas": "number",
    "cantidad_malas": "number"
  },
  "patron_errores": "string",
  "plan_accion": "string"
}
```

## 3. Implementación HTML

Se utilizarán tres contenedores (tarjetas) para mostrar la información, ubicados dentro de un contenedor principal de resultados.

```html
<div id="api-results-container" class="results-grid hidden">
  
  <!-- Bloque 1: Resumen General -->
  <div class="result-card yellow-theme">
    <h3>📊 Resumen General</h3>
    <div class="stats-grid">
      <div class="stat-item">
        <span class="label">Más Rafida:</span>
        <span id="res-rapid" class="value">--</span>
      </div>
      <div class="stat-item">
        <span class="label">Más Lenta:</span>
        <span id="res-slow" class="value">--</span>
      </div>
      <div class="stat-item">
        <span class="label">Promedio:</span>
        <span id="res-avg" class="value">--</span>
      </div>
      <div class="stat-item">
        <span class="label">Asertividad:</span>
        <span id="res-accuracy" class="value">--</span>
      </div>
      <div class="stat-row">
        <span class="success">Correctas: <strong id="res-correct">0</strong></span>
        <span class="danger">Incorrectas: <strong id="res-wrong">0</strong></span>
      </div>
    </div>
  </div>

  <!-- Bloque 2: Patrón de Errores -->
  <div class="result-card yellow-theme">
    <h3>⚠️ Patrón de Errores</h3>
    <p id="res-patterns" class="result-text">
      Analizando tus respuestas...
    </p>
  </div>

  <!-- Bloque 3: Plan de Acción -->
  <div class="result-card yellow-theme">
    <h3>🚀 Plan de Acción</h3>
    <p id="res-plan" class="result-text">
      Generando recomendaciones...
    </p>
  </div>

</div>
```

## 4. Estilos CSS (Amarillo Claro)

Se definen estilos para replicar la estética solicitada (fondo amarillo claro `#fdf6b4` similar al `.config-form`, bordes redondeados y sombra).

Añadir al archivo `css/styles.css`:

```css
/* Contenedor de la grilla de resultados */
.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
    margin-top: var(--space-xl);
    width: 100%;
}

/* Tarjeta General de Resultados */
.result-card {
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    border: 2px solid var(--clr-sand-300);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05); /* Sombra suave */
    transition: transform var(--transition-normal);
    display: flex;
    flex-direction: column;
}

.result-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

/* Tema Amarillo Claro (Solicitado) */
.result-card.yellow-theme {
    background-color: #fdf6b4; /* Amarillo claro coincidente con config-form */
    color: var(--clr-ink-900);
}

.result-card h3 {
    color: var(--clr-rose-500);
    font-size: 1.25rem;
    border-bottom: 2px solid rgba(209, 107, 165, 0.2);
    padding-bottom: var(--space-sm);
    margin-bottom: var(--space-md);
}

/* Estilos internos del contenido */
.stats-grid {
    display: grid;
    gap: var(--space-sm);
}

.stat-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
}

.stat-item .label {
    color: var(--clr-rock-500);
    font-weight: 600;
}

.stat-item .value {
    font-weight: 700;
    color: var(--clr-ink-900);
}

.stat-row {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px dashed rgba(0,0,0,0.1);
}

.stat-row .success { color: var(--clr-green-500); }
.stat-row .danger { color: var(--clr-rose-500); }

.result-text {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--clr-ink-900);
}
```

## 5. Lógica JS de Integración

Función sugerida para procesar y pintar la respuesta en el DOM:

```javascript
function renderApiResults(jsonResponse) {
    const data = jsonResponse; // Asumiendo que el JSON ya viene parseado

    // 1. Resumen General
    if (data.resumen_general) {
        document.getElementById('res-rapid').textContent = data.resumen_general.operacion_mas_rapida;
        document.getElementById('res-slow').textContent = data.resumen_general.operacion_mas_lenta;
        document.getElementById('res-avg').textContent = data.resumen_general.tiempo_promedio;
        document.getElementById('res-accuracy').textContent = data.resumen_general.porcentaje_asertividad;
        document.getElementById('res-correct').textContent = data.resumen_general.cantidad_buenas;
        document.getElementById('res-wrong').textContent = data.resumen_general.cantidad_malas;
    }

    // 2. Patrón de Errores
    if (data.patron_errores) {
        document.getElementById('res-patterns').textContent = data.patron_errores;
    }

    // 3. Plan de Acción
    if (data.plan_accion) {
        document.getElementById('res-plan').textContent = data.plan_accion;
    }

    // Mostrar el contenedor
    document.getElementById('api-results-container').classList.remove('hidden');
}
```
