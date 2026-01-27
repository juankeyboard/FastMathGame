# Referencia de la API de JavaScript de Firebase: Paquete AI

El SDK de Firebase AI para la web permite la integración de modelos generativos (Gemini, Imagen) directamente en aplicaciones web.

---

## Funciones Principales

### `getAI(app, options)`

Devuelve la instancia predeterminada de AI asociada con la `FirebaseApp` proporcionada. Si no existe una instancia, inicializa una nueva con la configuración por defecto.

**Parámetros:**
- `app` (FirebaseApp): La aplicación de Firebase a utilizar.
- `options` (AIOptions): Opciones que configuran la instancia de AI.

**Retorno:** `AI`

**Ejemplo:**
```javascript
const ai = getAI(app);

// O configurar un backend específico (Vertex AI o Google AI)
const aiGoogle = getAI(app, { backend: new GoogleAIBackend() });
```

---

### `getGenerativeModel(ai, modelParams, requestOptions)`

Devuelve una clase `GenerativeModel` con métodos para inferencia (como Gemini).

**Parámetros:**
- `ai` (AI): Instancia de AI.
- `modelParams` (ModelParams | HybridParams): Parámetros del modelo (nombre, configuración).

**Retorno:** `GenerativeModel`

---

### `getTemplateGenerativeModel(ai, templateParams)`

Devuelve un modelo generativo basado en una **plantilla de prompt** almacenada en Firebase Console.

**Parámetros:**
- `ai` (AI): Instancia de AI.
- `templateParams` (TemplateParams): Parámetros que incluyen el `templateId`.

**Retorno:** `TemplateGenerativeModel`

**Ejemplo:**
```javascript
// Usar una plantilla definida en Firebase Console
const model = getTemplateGenerativeModel(ai, { templateId: "baldora" });

// Llamar pasando las variables del template
const result = await model.generateContent({
    csv_data: contenidoCSV
});
```

---

### `getImagenModel(ai, modelParams, requestOptions)`

Devuelve una clase `ImagenModel` para generar imágenes. Actualmente solo soporta modelos Imagen 3 (`imagen-3.0-*`).

**Retorno:** `ImagenModel`

---

### `getLiveGenerativeModel(ai, modelParams)`

*(Public Preview)* Devuelve un modelo para comunicación bidireccional en tiempo real. Solo soportado en navegadores modernos y Node >= 22.

---

### `startAudioConversation(liveSession, options)`

*(Public Preview)* Inicia una conversación de audio bidireccional. Gestiona el acceso al micrófono, grabación y reproducción. Debe llamarse tras un gesto del usuario.

---

## Clases

| Clase | Descripción |
|-------|-------------|
| `AIError` | Clase de error específica para el SDK de Firebase AI. |
| `AIModel` | Clase base para los modelos de Firebase AI. |
| `ChatSession` | Gestiona el historial de mensajes enviados y recibidos. |
| `GenerativeModel` | Clase principal para interactuar con modelos de lenguaje. |
| `TemplateGenerativeModel` | Modelo que usa plantillas de prompt de Firebase Console. |
| `ImagenModel` | Clase para generar imágenes usando Imagen. |
| `GoogleAIBackend` | Configuración para usar la API de Gemini Developer (Google AI). |
| `VertexAIBackend` | Configuración para usar la API de Vertex AI en Google Cloud. |
| `LiveSession` | Representa una sesión activa de comunicación en tiempo real. |
| `Schema` | Clase base para definir esquemas de datos (Boolean, Integer, Object, etc.). |

---

## Interfaces Clave

### `GenerationConfig`

Opciones de configuración para la generación de contenido.

| Propiedad | Descripción |
|-----------|-------------|
| `stopSequences` | Secuencias que detienen la generación. |
| `maxOutputTokens` | Límite máximo de tokens de salida. |
| `temperature` | Controla la aleatoriedad (0.0 - 2.0). |
| `topP`, `topK` | Parámetros de muestreo. |

---

### `Content`

Representa el contenido enviado o recibido.

| Propiedad | Descripción |
|-----------|-------------|
| `role` | El rol del emisor (`user`, `model`, `system`, `function`). |
| `parts` | Un arreglo de `Part` (texto, datos inline, llamadas a funciones). |

---

### `SafetySetting`

Configuración de seguridad para filtrar contenido dañino.

| Propiedad | Descripción |
|-----------|-------------|
| `category` | `HarmCategory` |
| `threshold` | `HarmBlockThreshold` |

---

## Variables y Enums

### `AIErrorCode`
- `ERROR`
- `REQUEST_ERROR`
- `RESPONSE_ERROR`
- `FETCH_ERROR`
- `SESSION_CLOSED`
- `UNSUPPORTED`

### `HarmCategory`
- `HARM_CATEGORY_HATE_SPEECH`
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`
- `HARM_CATEGORY_HARASSMENT`
- `HARM_CATEGORY_DANGEROUS_CONTENT`

### `HarmBlockThreshold`
- `BLOCK_LOW_AND_ABOVE`
- `BLOCK_MEDIUM_AND_ABOVE`
- `BLOCK_ONLY_HIGH`
- `BLOCK_NONE`
- `OFF`

### `ImagenAspectRatio`
- `SQUARE` (1:1)
- `LANDSCAPE_16x9`
- `PORTRAIT_9x16`
- `LANDSCAPE_3x4`
- `PORTRAIT_4x3`

### `InferenceMode`
*(Public Preview)* Define dónde ocurre la inferencia:
- `PREFER_ON_DEVICE`
- `ONLY_ON_DEVICE`
- `ONLY_IN_CLOUD`
- `PREFER_IN_CLOUD`

---

## Alias de Tipos

| Tipo | Descripción |
|------|-------------|
| `Part` | Puede ser `TextPart`, `InlineDataPart`, `FunctionCallPart` o `FunctionResponsePart`. |
| `Role` | `'user'` \| `'model'` \| `'function'` \| `'system'` |
| `Tool` | Define herramientas externas que el modelo puede llamar (`FunctionDeclarationsTool`, `GoogleSearchTool`, `CodeExecutionTool`). |

---

*Última actualización: 2026-01-27 UTC. Basado en la referencia oficial de Firebase AI Web SDK.*