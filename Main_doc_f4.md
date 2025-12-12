# Documento Maestro de Ingeniería: Fase 4 - Sistema de Audio (Piloto)

**Versión:** 4.1 (Compacta / Piloto)  
**Fecha:** 12 de Diciembre, 2025  
**Proyecto:** Fast Math Game  
**Enfoque:** Implementación Modular y Prueba de Concepto  
**Formato de Salida:** .md (Markdown)

---

## 1. Visión General

Este documento define la integración de la capa sonora bajo una estrategia de **"Despliegue Progresivo"**. Se iniciará con una **Prueba Piloto** utilizando únicamente dos (2) archivos críticos para validar la latencia y el bucle (loop) en el motor del juego sin sobrecargar la carga inicial.

---

## 2. Estándares Técnicos

Para garantizar compatibilidad universal, rendimiento y libertad legal:

| Aspecto | Especificación |
|---------|----------------|
| **Formato Maestro** | `.mp3` |
| **Frecuencia** | 44100 Hz (44.1 kHz) |
| **Licencia** | CC0 (Creative Commons Zero - Dominio Público). Sin atribución. |

### Estructura de Directorios

La carpeta raíz de sonido será `audio` (al mismo nivel que `js` o `css`), eliminando la dependencia de una carpeta padre `assets`.

```
FastMathGame/
│
├── index.html
├── js/
│   └── audioManager.js  <-- Nuevo controlador
├── audio/               <-- Nueva Raíz
│   ├── bgm/             <-- Música de Fondo (Background Music)
│   └── sfx/             <-- Efectos de Sonido (Sound Effects)
```

---

## 3. Fase 1: Montaje Piloto (Prueba de Concepto)

Antes de cargar la librería completa, se validará el motor con solo **dos archivos esenciales**.

### Objetivo de la Prueba

1. Verificar que la música de fondo (bgm) haga **loop sin cortes** perceptibles.
2. Verificar que el efecto de sonido (sfx) se dispare **inmediatamente** (baja latencia) al interactuar.

### Archivos Requeridos para el Piloto

| Carpeta | Archivo | Propósito |
|---------|---------|-----------|
| `audio/bgm/` | `bgm_gameplay.mp3` | Música de fondo para validar el sistema de Loop infinito. |
| `audio/sfx/` | `sfx_wrong.mp3` | Sonido de error para validar la sincronización con el feedback visual. |

---

## 4. Fase 2: Expansión Progresiva (Roadmap)

Una vez validado el piloto, se añadirán los siguientes archivos a las carpetas correspondientes. El código `audioManager.js` estará preparado para recibir estos nombres sin necesidad de reestructurar la lógica central.

### Cola de Implementación (Prioridad 2)

- `sfx_correct.mp3` (Acierto - Alta prioridad)
- `sfx_ui_click.mp3` (Feedback de botones)
- `sfx_win.mp3` (Victoria / Matriz llena)
- `sfx_gameover.mp3` (Tiempo agotado)
- `bgm_menu.mp3` (Ambiente para la pantalla de configuración)

---

## 5. Especificaciones del AudioManager (Lógica JS)

El controlador de audio (`js/audioManager.js`) debe cumplir con los siguientes requisitos de ingeniería:

### 5.1 Carga Previa (Preload)
Instanciar los objetos `new Audio()` al iniciar la aplicación (en el constructor de la clase), no al momento de reproducir.

### 5.2 Polifonía (Overlap)
Permitir que los SFX se superpongan si el jugador responde muy rápido (ej: usando `.cloneNode()` al reproducir efectos).

### 5.3 Persistencia de Mute
- Debe existir un **botón de Mute/Unmute** en la UI.
- El estado debe guardarse en `localStorage`. Si el usuario silencia el juego, debe permanecer silenciado al recargar la página.

### 5.4 Tolerancia a Fallos
Si un archivo de audio falta en la carpeta (ej: aún no se ha subido el `sfx_win.mp3`), el juego **no debe romperse**; debe capturar el error y continuar silenciosamente.

---

## 6. Siguientes Pasos

1. **Adquisición:** Conseguir/Generar `bgm_gameplay.mp3` y `sfx_wrong.mp3` (Licencia CC0).
2. **Conversión:** Asegurar que estén en MP3 44.1kHz.
3. **Estructura:** Crear la carpeta `audio` y sus subcarpetas `bgm` y `sfx`.
4. **Código:** Desarrollar e integrar `audioManager.js`.

---

## 7. Checklist de Implementación

- [ ] Crear estructura de carpetas `audio/bgm/` y `audio/sfx/`
- [ ] Crear `js/audioManager.js` con la clase AudioManager
- [ ] Agregar botón de mute/unmute a la UI
- [ ] Integrar AudioManager en `app.js`
- [ ] Agregar estilos CSS para el botón de audio
- [ ] Probar con archivos de audio placeholder
