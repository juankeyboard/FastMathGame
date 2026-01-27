# Guía de Implementación: Entrenador Virtual con Firebase AI Logic

Este documento detalla la arquitectura y configuración para el "Entrenador Virtual" de Baldora, utilizando **Firebase AI Logic** (Gemini Developer API) para analizar el rendimiento del jugador de forma segura y escalable, eliminando la necesidad de exponer API Keys sensibles directamente en los módulos de lógica.

---

## 1. Arquitectura y Seguridad

### ¿Por qué Firebase AI Logic?
Utilizamos el SDK de cliente de Firebase (`firebase/ai`) que actúa como un puente seguro hacia los modelos de Gemini.
1.  **Abstracción de Credenciales:** No se requiere hardcodear la API Key en el archivo del servicio (`gemini-service.js`). El SDK utiliza la configuración global del proyecto Firebase.
2.  **Seguridad:** Permite integrar **Firebase App Check** para validar que las peticiones provienen de tu app legítima, protegiendo tu cuota de uso.
3.  **Integración:** Se conecta nativamente con la instancia de `firebaseApp` ya existente en el navegador.

### Flujo de Datos
1.  **Juego:** Recopila métricas (aciertos, errores, tiempos) en `DataManager`.
2.  **Frontend:** `GeminiService` convierte el historial a formato CSV.
3.  **SDK Firebase AI:** Envía el prompt + CSV a la infraestructura de Google (Vertex AI / Gemini API).
4.  **Gemini:** Procesa la información y devuelve un diagnóstico pedagógico estructurado.

---

## 2. Configuración del Proyecto

### Requisitos en Firebase Console
1.  Habilitar **AI Logic (Vertex AI in Firebase)** en la consola de Firebase.
2.  Asegurar que la **Gemini Developer API** esté habilitada (disponible en planes Spark y Blaze).
3.  Agregar la Web App al proyecto para obtener el `firebaseConfig` (si no se ha hecho).

### Inicialización Global
Para evitar duplicidad y exposición de claves, la configuración de Firebase debe residir **únicamente** en el punto de entrada de la aplicación (`index.html` o `main.js`), no en los servicios individuales.

```javascript
// index.html
const firebaseConfig = {
  apiKey: "...", // Clave pública del proyecto (segura de exponer con App Check)
  authDomain: "...",
  projectId: "...",
  // ...
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
// Exponer para uso en módulos
window.firebaseApp = firebaseApp;
```

---

## 3. Implementación del Servicio (GeminiService)

El archivo `js/gemini-service.js` debe refactorizarse para usar la instancia global.

### Importaciones (ES Modules / Import Map)
```javascript
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
```

### Inicialización del Modelo
En lugar de definir `firebaseConfig` nuevamente, accedemos a la instancia global.

```javascript
// 1. Obtener la instancia de Firebase ya inicializada
const app = window.firebaseApp; 

if (!app) {
    console.error("Firebase App no inicializada. Verifique index.html");
}

// 2. Inicializar Backend de AI (Gemini Developer API)
// Esto conecta el SDK con el servicio de Google
const ai = getAI(app, { backend: new GoogleAIBackend() });

// 3. Instanciar el modelo usando el ID de la plantilla
// Usamos 'baldora' que es el ID definido en Firebase Console
const model = getGenerativeModel(ai, { model: "baldora" });
```

---

## 4. Ingeniería del Prompt con Plantillas (Prompt Templates)

En lugar de escribir el prompt en el código, utilizamos la función de **Prompt Templates** de Firebase AI Logic. Esto permite a los diseñadores pedagógicos ajustar las instrucciones en la consola sin requerir cambios en el código.

### Configuración en Consola
- **Template ID:** `baldora`
- **Modelo:** `gemini-2.5-pro`
- **Input Schema:** `{ csv_data: string }`

### Implementación en Código:

```javascript
async function analizarResultadosJuego(contenidoCSV) {
  try {
    // Llamada a la API usando la plantilla
    // Solo enviamos los datos variables, no el prompt
    const result = await model.generateContent({
      csv_data: contenidoCSV
    });
    
    const response = result.response;
    const textoResultado = response.text();

    console.log("Análisis de Gemini:", textoResultado);
    return textoResultado;
    
  } catch (error) {
    console.error("Error al analizar el CSV:", error);
  }
}
```

---

## 5. Manejo de Errores y UI

El servicio debe manejar los estados de la interfaz de usuario:

*   **Estado Idle:** Botón "Analizar mis Resultados" visible.
*   **Estado Loading:** Spinner y mensajes de carga ("Conectando sinapsis...").
*   **Estado Success:** Mostrar respuesta renderizada (respetando saltos de línea).
*   **Manejo de Errores:**
    *   Si `DataManager` está vacío: Avisar al usuario que debe jugar primero.
    *   Si falla la API (red, cuota): Mostrar mensaje amigable y opción de reintentar.

---

*Documento de Diseño Técnico - Baldora 2026*