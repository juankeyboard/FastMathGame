# Documento Maestro de Ingeniería: Fase 4 - Sistema de Audio

**Versión:** 4.2 (Implementado)  
**Fecha:** 12 de Diciembre, 2025  
**Proyecto:** Fast Math Game  
**Estado:** ✅ Implementado y Funcional  
**Formato de Salida:** .md (Markdown)

---

## 1. Visión General

Este documento define la integración de la capa sonora bajo una estrategia de **"Despliegue Progresivo"**. El sistema de audio ha sido implementado exitosamente con música de fondo y efectos de sonido sincronizados con las acciones del juego.

---

## 2. Estándares Técnicos

Para garantizar compatibilidad universal, rendimiento y libertad legal:

| Aspecto | Especificación |
|---------|----------------|
| **Formato Maestro** | `.mp3` |
| **Frecuencia** | 44100 Hz (44.1 kHz) |
| **Licencia** | CC0 (Creative Commons Zero - Dominio Público). Sin atribución. |
| **Prefijo de Archivos** | `baldora_` (identificador del proyecto) |

### Estructura de Directorios (Implementada)

```
FastMathGame/
│
├── index.html
├── js/
│   ├── audioManager.js  ← Controlador de Audio
│   ├── app.js           ← Integración con lógica del juego
│   └── ...
├── audio/
│   ├── bgm/             ← Música de Fondo (Background Music)
│   │   ├── baldora_bgm_gameplay.mp3  ✅
│   │   └── baldora_bgm_stats.mp3     ✅
│   └── sfx/             ← Efectos de Sonido (Sound Effects)
│       ├── baldora_sfx_wrong.mp3     ✅
│       └── baldora_sfx_right.mp3     ✅
```

---

## 3. Archivos de Audio Implementados

### Música de Fondo (BGM)

| Archivo | Ubicación | Propósito | Estado |
|---------|-----------|-----------|--------|
| `baldora_bgm_gameplay.mp3` | `audio/bgm/` | Música durante el juego (loop infinito) | ✅ Activo |
| `baldora_bgm_stats.mp3` | `audio/bgm/` | Música para pantalla de estadísticas | ✅ Disponible |

### Efectos de Sonido (SFX)

| Archivo | Ubicación | Propósito | Estado |
|---------|-----------|-----------|--------|
| `baldora_sfx_wrong.mp3` | `audio/sfx/` | Sonido al ingresar respuesta incorrecta | ✅ Activo |
| `baldora_sfx_right.mp3` | `audio/sfx/` | Sonido al ingresar respuesta correcta | ✅ Disponible |

---

## 4. Integración con el Juego

### Eventos de Audio Implementados

| Evento del Juego | Función en `app.js` | Llamada de Audio |
|------------------|---------------------|------------------|
| **Iniciar juego** | `startGame()` | `AudioManager.playBGM('gameplay')` |
| **Respuesta incorrecta** | `submitAnswer()` | `AudioManager.playWrong()` |
| **Timeout en diagnóstico** | `handleDiagnosisTimeout()` | `AudioManager.playWrong()` |
| **Terminar juego** | `endGame()` | `AudioManager.stopBGM()` |

### Características Técnicas Implementadas

| Característica | Descripción | Estado |
|----------------|-------------|--------|
| **Carga Previa (Preload)** | Instancia `new Audio()` al iniciar la app | ✅ |
| **Loop Infinito** | BGM se reproduce en bucle continuo | ✅ |
| **Sin Reinicio** | BGM no se reinicia al cambiar de operación | ✅ |
| **Polifonía (Overlap)** | SFX usa `.cloneNode()` para superposición | ✅ |
| **Persistencia de Mute** | Estado guardado en `localStorage` | ✅ |
| **Tolerancia a Fallos** | Captura errores sin romper el juego | ✅ |
| **Botón Mute/Unmute** | UI global en esquina superior derecha | ✅ |

---

## 5. AudioManager - API Pública

### Archivo: `js/audioManager.js`

```javascript
AudioManager = {
    // Inicialización
    init(),                    // Inicializa y precarga audios
    
    // Música de Fondo
    playBGM(trackName),        // Reproduce BGM ('gameplay', 'menu', 'stats')
    stopBGM(),                 // Detiene BGM actual
    pauseBGM(),                // Pausa BGM
    resumeBGM(),               // Reanuda BGM pausado
    
    // Efectos de Sonido
    playSFX(sfxName),          // Reproduce SFX genérico
    playCorrect(),             // Atajo: sonido de acierto
    playWrong(),               // Atajo: sonido de error
    playClick(),               // Atajo: sonido de UI
    playWin(),                 // Atajo: sonido de victoria
    playGameover(),            // Atajo: sonido de game over
    
    // Control de Mute
    toggleMute(),              // Alterna mute/unmute
    getMuteState()             // Retorna estado actual de mute
}
```

---

## 6. Configuración de Rutas de Audio

En `audioManager.js`, líneas 18-31:

```javascript
const audioConfig = {
    bgm: {
        gameplay: 'audio/bgm/baldora_bgm_gameplay.mp3',
        menu: 'audio/bgm/baldora_bgm_menu.mp3',
        stats: 'audio/bgm/baldora_bgm_stats.mp3'
    },
    sfx: {
        correct: 'audio/sfx/baldora_sfx_right.mp3',
        wrong: 'audio/sfx/baldora_sfx_wrong.mp3',
        click: 'audio/sfx/baldora_sfx_ui_click.mp3',
        win: 'audio/sfx/baldora_sfx_win.mp3',
        gameover: 'audio/sfx/baldora_sfx_gameover.mp3'
    }
};
```

---

## 7. UI del Botón de Audio

### HTML (`index.html`)

```html
<button type="button" id="btn-audio-toggle" class="audio-toggle-btn" 
        onclick="AudioManager.toggleMute()" title="Silenciar">&#128266;</button>
```

### CSS (`styles.css`)

```css
.audio-toggle-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    /* ... estilos completos en líneas 1724-1757 */
}
```

### Iconos

| Estado | Icono | Código HTML |
|--------|-------|-------------|
| Sonido activo | 🔊 | `&#128266;` |
| Silenciado | 🔇 | `&#128263;` |

---

## 8. Roadmap de Expansión

### Audios Pendientes de Implementación

| Prioridad | Archivo | Propósito |
|-----------|---------|-----------|
| Alta | `baldora_sfx_correct.mp3` → Renombrar a nombre correcto | Integrar con `submitAnswer()` |
| Media | `baldora_sfx_ui_click.mp3` | Feedback en botones de configuración |
| Media | `baldora_sfx_win.mp3` | Victoria en modo adaptativo |
| Media | `baldora_sfx_gameover.mp3` | Tiempo agotado |
| Baja | `baldora_bgm_menu.mp3` | Ambiente en pantalla de configuración |

### Integraciones Pendientes

1. **Sonido de acierto**: Agregar `AudioManager.playCorrect()` en `submitAnswer()` cuando `isCorrect === true`
2. **Sonido de victoria**: Agregar en `showAdaptiveVictory()`
3. **Música de menú**: Agregar en `showView('CONFIG')`
4. **Música de stats**: Agregar `AudioManager.playBGM('stats')` en `endGame()`

---

## 9. Notas Técnicas

### Autoplay en Navegadores

Los navegadores modernos bloquean el autoplay de audio hasta que el usuario interactúe con la página. Por esta razón:
- La música **solo comienza después de hacer clic** en "COMENZAR"
- No es posible reproducir audio automáticamente al cargar la página

### Persistencia del Estado de Mute

```javascript
const STORAGE_KEY = 'fastMathGame_audioMuted';
// Guardar: localStorage.setItem(STORAGE_KEY, isMuted.toString());
// Cargar: localStorage.getItem(STORAGE_KEY);
```

---

## 10. Checklist de Implementación

- [x] Crear estructura de carpetas `audio/bgm/` y `audio/sfx/`
- [x] Crear `js/audioManager.js` con la clase AudioManager
- [x] Agregar botón de mute/unmute a la UI
- [x] Integrar AudioManager en `app.js`
- [x] Agregar estilos CSS para el botón de audio
- [x] Implementar `baldora_bgm_gameplay.mp3` (música de juego)
- [x] Implementar `baldora_sfx_wrong.mp3` (sonido de error)
- [x] Agregar `baldora_bgm_stats.mp3` (música de estadísticas)
- [x] Agregar `baldora_sfx_right.mp3` (sonido de acierto)
- [ ] Integrar sonido de acierto en el código
- [ ] Integrar música de estadísticas en el código
- [ ] Agregar sonidos adicionales (click, win, gameover)

---

**Última actualización:** 12 de Diciembre, 2025 - 15:38
