# Documento Maestro de Ingeniería: Fase 3 - Diseño Visual & UX

**Proyecto:** Fast Math Game (Visual Overhaul)  
**Fecha:** 11 de Diciembre, 2025  
**Referencia Estética:** "Legado Baldor" (Nostalgia Académica / Aritmética Clásica)  
**Dependencias:** Main_doc_f1.md (Core), Main_doc_f2.md (Adaptativo)

---

## 1. Concepto Visual: "El Origen del Cálculo"

La identidad visual del juego se aleja del minimalismo plano moderno ("Flat Design") para abrazar una estética orgánica, texturizada y nostálgica. Se busca evocar la autoridad de los libros de texto clásicos de mediados del siglo XX (específicamente la portada de "Aritmética" de A. Baldor), donde el aprendizaje se sentía como una aventura épica y fundacional.

### Pilares Estéticos

*   **Naturaleza vs. Intelecto:** Uso de paisajes naturales vastos y primigenios contrastados con tipografía geométrica rígida.
*   **Paleta "Cielo y Tierra":** Predominio de cianes desaturados (cielo/aire) y ocres/tierras (suelo/papel/roca).
*   **Materialidad:** Las interfaces no deben parecer plástico digital, sino papel, piedra pulida o impresión litográfica antigua.

---

## 2. Sistema de Diseño (Design System)

### 2.1. Paleta Cromática (Variables CSS)

Los colores se han extraído digitalmente de referencias de ilustración clásica para mantener la fidelidad al concepto.

```css
:root {
    /* --- ATMÓSFERA (Fondos y Bases) --- */
    --color-sky-light:   #9BD3E6; /* Azul Cian Claro (Aire/Fondo General) */
    --color-sky-deep:    #64B3D6; /* Azul Cian Profundo (Cielo/Degradados) */
    --color-earth-sand:  #E0CC9F; /* Beige Arena (Papel/Fondo Contenedores) */
    --color-earth-rock:  #9C8C6B; /* Marrón Roca (Bordes/Estructuras) */
    --color-earth-shadow:#5A4A3A; /* Marrón Oscuro (Sombras/Textos secundarios) */
    --color-dark-ink:    #2A2A2A; /* Gris casi negro (Texto Principal de Lectura) */

    /* --- SEMÁNTICA DEL JUEGO (Feedback Funcional) --- */
    --color-correct:     #7CAF5D; /* Verde Oliva Vibrante (Éxito - Orgánico) */
    --color-wrong:       #E6C75F; /* Amarillo Dorado (Atención/Fallo) */
    --color-active:      #FFFFFF; /* Blanco Puro (Celda actual/Foco) */
    
    /* --- ACENTO (Call to Action) --- */
    --color-accent:      #C85F96; /* Magenta "Aritmética" (Títulos/Botones Principales) */
    --color-accent-hover:#E07AB0; /* Magenta Claro (Hover) */
}
```

### 2.2. Tipografía

Se utiliza una combinación de fuentes (font-pairing) para separar la "Voz del Juego" (Instrucción) de la "Voz de los Datos" (Números).

*   **Títulos y UI (La Voz Autoritaria):** Oswald (Google Fonts).
    *   *Estilo:* Sans-serif, Condensed, Bold.
    *   *Uso:* Encabezados (h1, h2), Botón "JUGAR", Temporizador Gigante.
*   **Cuerpo y Narrativa (La Voz Académica):** Merriweather o Lora (Google Fonts).
    *   *Estilo:* Serif, legible, clásico, con remates suaves.
    *   *Uso:* Instrucciones, Feedback textual, Etiquetas de formulario.
*   **La Matriz (Los Datos):** Roboto Mono o Inconsolata.
    *   *Estilo:* Monospaced (Ancho fijo).
    *   *Uso:* Obligatorio para la grilla 15x15. Asegura que los números de 1, 2 o 3 dígitos se alineen verticalmente sin romper la tabla.

---

## 3. Arquitectura de Escenas (Fondos y Prompts)

El juego transita por 4 estados emocionales definidos. Cada estado requiere un activo gráfico de fondo (.webp) generado mediante IA para mantener la consistencia artística.

### 3.1. Escena 1: Splash Screen (Carga)

*   **Función:** Impacto inicial. El usuario entra al mundo del conocimiento.
*   **Duración:** 3 segundos fijos.
*   **Archivo:** `assets/images/bg_splash_intro.webp`
*   **Prompt de Generación (IA):**
    > "Una ilustración de portada de libro de texto vintage de los años 50, estilo Aritmética de Baldor. Primer plano de una roca antigua en un paisaje prehistórico. Al fondo un cielo azul cian vibrante con nubes blancas esponjosas. Sin texto. Estilo pintura al óleo clásica, colores saturados, pinceladas visibles, sensación de sabiduría antigua, alta resolución, relación de aspecto 16:9."

### 3.2. Escena 2: Menú Principal (Configuración)

*   **Función:** Inspiración y calma. Espacio para decidir la estrategia y configurar la partida.
*   **Tratamiento Técnico:** Overlay CSS (capa superior) de color azulado semitransparente para garantizar la legibilidad del menú sobre la imagen.
*   **Archivo:** `assets/images/bg_menu_landscape.webp`
*   **Prompt de Generación (IA):**
    > "Paisaje panorámico amplio de un desierto rocoso con vegetación verde oliva dispersa. Un cielo azul claro inmenso ocupa el 70% de la imagen superior. Estilo arte conceptual retro, litografía suave. Colores tierra, ocre y azul cian. Iluminación de mediodía, sombras suaves. Sin personajes, solo naturaleza tranquila. Estilo artístico de mediados del siglo XX, detallado pero limpio, 16:9."

### 3.3. Escena 3: Gameplay (La Arena)

*   **Función:** Concentración total. Bajo ruido visual. Aquí es donde ocurre la acción; el fondo no puede distraer.
*   **Estilo:** Textura abstracta y repetible.
*   **Archivo:** `assets/images/bg_game_texture.webp`
*   **Prompt de Generación (IA):**
    > "Textura de papel de pergamino antiguo y gastado. Color beige arena claro y uniforme. Grano de papel sutil, manchas muy suaves de envejecimiento en los bordes. Sin texto, sin ilustraciones, sin contraste alto. Iluminación plana y uniforme, vista cenital, textura seamless (sin costuras) para fondo de página web."

### 3.4. Escena 4: Dashboard (Estadísticas)

*   **Función:** Análisis, reflexión y "Dark Mode".
*   **Concepto:** "El estudio del sabio". Un ambiente más oscuro que permita que las gráficas de colores neón (Chart.js) resalten brillantemente.
*   **Archivo:** `assets/images/bg_stats_blueprint.webp`
*   **Prompt de Generación (IA):**
    > "Mesa de trabajo de madera oscura antigua vista desde arriba con poca luz. Encima hay mapas de navegación antiguos desenfocados, compás y herramientas de medición de latón. Iluminación cinemática tenue, atmósfera de estudio nocturno, tonos marrón oscuro y azul marino profundo. Estilo realista pero pictórico, viñeta oscura en los bordes, 16:9."

---

## 4. Implementación Técnica de UI (CSS Key Concepts)

### 4.1. La Matriz (Grid 15x15)

Para lograr el efecto de "tabla grabada en piedra" o "papiro antiguo":

```css
.game-grid {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    gap: 2px;
    /* El color del gap simula las líneas de división de la piedra */
    background-color: var(--color-earth-rock); 
    border: 4px solid var(--color-earth-rock);
    /* Sombra dura para dar profundidad física */
    box-shadow: 5px 5px 0px rgba(90, 74, 58, 0.4); 
}

.cell {
    background-color: var(--color-earth-sand);
    font-family: 'Roboto Mono', monospace;
    font-weight: 700; /* Bold */
    color: var(--color-dark-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.1s ease-out;
}

/* Efecto Táctil al pasar el mouse */
.cell:hover {
    filter: brightness(0.95);
    transform: scale(0.95); /* La celda se "hunde" ligeramente */
}
```

### 4.2. Contenedores (Glassmorphism Retro)

Los paneles flotantes (Configuración, Alertas, Modales) deben integrarse con el fondo usando opacidad y bordes sólidos.

```css
.retro-panel {
    /* Fondo arena con ligera transparencia */
    background-color: rgba(224, 204, 159, 0.95); 
    /* Borde doble estilo enciclopedia */
    border: 3px double var(--color-earth-shadow);
    border-radius: 4px;
    /* Sombra proyectada sólida (no blur) */
    box-shadow: 8px 8px 0px rgba(0,0,0,0.25);
}
```

### 4.3. Estrategia de Fondos (CSS Backgrounds)

```css
/* Ejemplo para la Vista de Menú */
.view-menu {
    /* Capa 1: Gradiente para asegurar lectura de textos */
    /* Capa 2: Imagen generada por IA */
    background-image: 
        linear-gradient(to bottom, rgba(155, 211, 230, 0.6), rgba(90, 74, 58, 0.8)),
        url('../assets/images/bg_menu_landscape.webp');
    background-size: cover;
    background-position: center;
    background-attachment: fixed; /* Parallax simple */
}
```

---

## 5. Plan de Ejecución Gráfica

1.  **Generación de Assets:** Utilizar los prompts de la Sección 3 en una herramienta de IA Generativa (Midjourney v6, DALL-E 3, Adobe Firefly) para crear las 4 imágenes base.
2.  **Post-Procesamiento:**
    *   Convertir todas las imágenes a formato `.webp`.
    *   Redimensionar a 1920x1080 píxeles.
    *   Comprimir para asegurar un peso menor a 300KB por imagen.
3.  **Integración de Fuentes:** Configurar Google Fonts en el `<head>` del HTML (Oswald, Merriweather, Roboto Mono).
4.  **Codificación CSS:** Crear el archivo `styles.css` implementando las variables de raíz (`:root`) definidas en la Sección 2.