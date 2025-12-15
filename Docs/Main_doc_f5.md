# Documento Maestro de Ingeniería: Sistema de Onboarding

| Campo | Valor |
|-------|-------|
| **Versión** | 5.0 (Propuesta) |
| **Fecha** | 15 de Diciembre, 2025 |
| **Proyecto** | Baldora |
| **Módulo** | Experiencia de Usuario (UX) / Onboarding |
| **Estado** | ✅ Implementado |

---

## 1. Visión General

El sistema de **Onboarding** tiene como objetivo reducir la fricción inicial y asegurar que el usuario entienda las mecánicas únicas de Baldora, especialmente el **"Modo Adaptativo"** y la **selección de tablas**.

Implementaremos una estrategia de **"Onboarding Contextual"**: En lugar de un tutorial largo y aburrido al principio, dividiremos la guía en pequeños tours que se activan solo cuando el usuario llega a una pantalla específica por primera vez.

---

## 2. Estándares Técnicos y Herramientas

| Aspecto | Especificación | Justificación |
|---------|----------------|---------------|
| **Librería Sugerida** | Driver.js (v1.0+) | Ligera (vanilla JS), MIT, sin dependencias, soporta animaciones y foco |
| **Persistencia** | localStorage | Para no mostrar el tour más de una vez por usuario/dispositivo |
| **Estilo Visual** | "Baldor Watercolor" | Personalización CSS para coincidir con `Main_doc_f3.md` |
| **Accesibilidad** | Navegación por teclado | Requisito estándar para herramientas educativas |

---

## 3. Flujos de Onboarding (Tours)

Se definen tres recorridos principales basados en la arquitectura de vistas del juego *[cite: Main_doc_f1.md]*.

### 3.1. Tour de Bienvenida y Configuración

- **Disparador:** Primera carga de la página (`index.html`)
- **ID de Persistencia:** `baldora_tour_config_seen`

| Paso | Elemento Objetivo (DOM) | Título | Descripción | Posición |
|------|-------------------------|--------|-------------|----------|
| 1 | `body` (Centrado) | ¡Bienvenido a Baldora! | Entrena tu mente y domina las tablas de multiplicar con nuestro sistema visual. | Centro |
| 2 | `.mode-selector` | Elige tu Desafío | **Contrarreloj:** Corre contra el tiempo. **Libre:** Practica sin estrés. **Adaptativo:** El sistema inteligente detecta tus fallos. *[cite: Main_doc_f2.md]* | Derecha |
| 3 | `.matrix-selector` | Diseña tu Matriz | Selecciona qué filas y columnas quieres practicar (del 1 al 15). ¡Usa los botones para activar o desactivar! *[cite: Main_doc_f1.md]* | Izquierda |
| 4 | `.btn-start` | ¡A jugar! | Cuando estés listo, presiona aquí para comenzar tu entrenamiento. | Abajo |

### 3.2. Tour de Gameplay (La Matriz)

- **Disparador:** Primera vez que se inicia el juego (Vista `#game-view` activa)
- **ID de Persistencia:** `baldora_tour_game_seen`

| Paso | Elemento Objetivo | Título | Descripción |
|------|-------------------|--------|-------------|
| 1 | `.matrix-panel` | Tu Tablero de Juego | Aquí verás tu progreso. 🟢 Verde: ¡Correcto! 🟡 Amarillo: ¡A repasar! *[cite: Main_doc_f1.md]* |
| 2 | `.controls-panel` | Tu Mando de Control | Aquí verás la operación actual y el tiempo restante. |
| 3 | `input#answer` | Tu Respuesta | Escribe el resultado aquí y presiona ENTER. |
| 4 | `#btn-audio-toggle` | Control de Sonido | ¿Necesitas concentración? Puedes silenciar el juego aquí. *[cite: Main_doc_f4.md]* |

### 3.3. Tour Especial: Modo Adaptativo

- **Disparador:** Primera vez que el usuario elige "Modo Adaptativo" e inicia el juego
- **ID de Persistencia:** `baldora_tour_adaptive_seen`

> ⚠️ **Nota:** Este tour es crítico debido a la complejidad de las dos fases (Diagnóstico y Entrenamiento). *[cite: Main_doc_f2.md]*

| Paso | Título | Descripción |
|------|--------|-------------|
| 1 | Fase 1: Diagnóstico | Primero, te haremos un test rápido. Tienes 30 segundos por operación. ¡Hazlo lo mejor que puedas! |
| 2 | Fase 2: Entrenamiento | El sistema detectará tus debilidades y te hará repetirlas hasta que las domines. |
| 3 | Ayuda Visual | Si te atascas, te daremos una pista visual. ¡Aprovéchala para memorizar! |

---

## 4. Diseño y Personalización (UI)

Para mantener la coherencia con el Design System **"Baldor Watercolor"** *[cite: Main_doc_f3.md]*, se aplicarán los siguientes estilos al popover del tour.

### 4.1. Mapeo de Variables CSS

```css
/* Sobreescritura de estilos de Driver.js para Baldora */
.driver-popover {
    background-color: var(--clr-surface-high); /* Blanco */
    border: 2px solid var(--clr-sand-300);     /* Borde Arena */
    border-radius: var(--radius-lg);           /* 20px */
    box-shadow: 0 10px 40px rgba(126, 200, 227, 0.25); /* Sombra Azulada */
    font-family: var(--font-main);             /* Nunito */
    color: var(--clr-ink-900);                 /* Negro Tinta */
    padding: var(--space-md);
}

.driver-popover-title {
    font-family: var(--font-display);          /* Oswald */
    font-size: 1.25rem;
    color: var(--clr-rose-700);                /* Rosa Oscuro */
    margin-bottom: var(--space-sm);
}

.driver-popover-description {
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--clr-rock-500);                /* Texto Secundario */
}

/* Botones del Tour */
.driver-popover-next-btn {
    background: var(--clr-rose-500) !important; /* Botón Rosa */
    color: white !important;
    border-radius: var(--radius-full) !important;
    text-shadow: none !important;
    font-weight: 700 !important;
}

.driver-popover-prev-btn {
    color: var(--clr-rock-500) !important;
    background: transparent !important;
    border: 1px solid var(--clr-sand-300) !important;
    border-radius: var(--radius-full) !important;
}
```

---

## 5. Implementación Técnica

### 5.1. Estructura de Archivos Sugerida

Se debe añadir un nuevo controlador en la carpeta `js`:

```
Baldora/
├── js/
│   ├── onboarding.js    ← ¡NUEVO ARCHIVO!
│   ├── app.js
│   └── ...
```

### 5.2. Lógica del Controlador (Draft)

```javascript
// js/onboarding.js

const Onboarding = {
    driver: null,

    init() {
        // Inicializar instancia de Driver.js
        this.driver = window.driver.js.driver({
            animate: true,
            opacity: 0.75, // Oscurecimiento del fondo
            allowClose: false, // Obligar a ver o dar clic en "Saltar"
            doneBtnText: '¡Entendido!',
            nextBtnText: 'Siguiente →',
            prevBtnText: '← Atrás',
            skipBtnText: 'Saltar',
        });
        
        // Verificar si es la primera visita
        this.checkAndStartConfigTour();
    },

    checkAndStartConfigTour() {
        const seen = localStorage.getItem('baldora_tour_config_seen');
        if (!seen) {
            this.startConfigTour();
            localStorage.setItem('baldora_tour_config_seen', 'true');
        }
    },

    // Definición de pasos para Configuración
    startConfigTour() {
        this.driver.setSteps([
            { element: '#config-view h1', popover: { title: 'Bienvenido', description: '...' } },
            { element: '.mode-selection-container', popover: { title: 'Modos de Juego', description: '...' } },
            // ... resto de pasos
        ]);
        this.driver.drive();
    }
    
    // Métodos similares para Gameplay y Adaptativo...
};
```

---

## 6. Integración con el Código Existente

Para que el sistema funcione, se deben añadir los **"Hooks"** en `app.js`.

### 6.1. Integración en Inicio

En `app.js` → `init()`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente
    Onboarding.init(); // Inicia chequeo de bienvenida
});
```

### 6.2. Integración al Cambiar de Vista

En `app.js` → `startGame()`:

```javascript
function startGame() {
    // ... lógica existente de cambio de vista
    
    // Disparar tour de juego si no se ha visto
    if (!localStorage.getItem('baldora_tour_game_seen')) {
        setTimeout(() => Onboarding.startGameplayTour(), 500); // Pequeño delay para renderizado
    }
}
```

---

## 7. Checklist de Implementación Onboarding

### Infraestructura
- [x] Incluir librería Driver.js (CDN o local) en `index.html`
- [x] Crear `js/onboarding.js`
- [x] Integrar CSS personalizado en `css/styles.css` (o archivo separado)

### Configuración de Tours
- [x] Redactar textos finales para el Tour de Bienvenida
- [x] Redactar textos finales para el Tour de Gameplay
- [x] Redactar textos explicativos para el Tour Adaptativo

### Lógica
- [x] Implementar persistencia en localStorage
- [x] Conectar hooks en `app.js` (al cargar y al iniciar juego)
- [x] Añadir botón "Ayuda/Tutorial" en la UI (por si el usuario quiere repetir el tour)

---

## 8. Notas de Implementación

### Archivos Creados/Modificados

| Archivo | Cambios |
|---------|--------|
| `js/onboarding.js` | Nuevo archivo con la lógica completa de los tours |
| `css/styles.css` | Añadidos estilos personalizados para Driver.js |
| `index.html` | Incluido CDN de Driver.js y botón de ayuda |
| `app.js` | Integrados hooks de inicialización y disparadores de tours |

### Funciones Principales

```javascript
Onboarding.init()          // Inicializa el sistema
Onboarding.startConfigTour()   // Tour de bienvenida
Onboarding.startGameplayTour() // Tour de gameplay
Onboarding.startAdaptiveTour() // Tour de modo adaptativo
Onboarding.replayTour(name)    // Repetir un tour específico
Onboarding.resetAllTours()     // Reiniciar todos los tours (debug)
```

---

*Última actualización: 15 de Diciembre, 2025*
*Estado: Implementación completada y verificada*