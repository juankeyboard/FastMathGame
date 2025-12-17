/**
 * ExportManager - Sistema de Exportación de Resultados
 * Permite exportar los resultados de la sesión en formato PDF o CSV
 * Versión: 2.1
 */

const ExportManager = {
    // 1. Abrir Modal de selección de formato
    openModal() {
        document.getElementById('modal-export').classList.add('active');
    },

    // 2. Cerrar Modal
    closeModal() {
        document.getElementById('modal-export').classList.remove('active');
    },

    // 3. Opción CSV (Usa la lógica existente de DataManager)
    downloadCSV() {
        if (typeof DataManager !== 'undefined' && typeof DataManager.downloadCSV === 'function') {
            DataManager.downloadCSV();
        } else {
            console.warn('DataManager.downloadCSV no está disponible');
            alert('Error: No se pudo generar el archivo CSV');
        }
        this.closeModal();
    },

    // 4. Opción PDF (Genera reporte visual)
    async downloadPDF() {
        // Verificar que html2pdf esté disponible
        if (typeof html2pdf === 'undefined') {
            alert('Error: La librería html2pdf no está cargada');
            return;
        }

        // A. Poblar Datos de Sesión (usando DataManager y App del proyecto)
        const nickname = DataManager.nickname || 'Invitado';
        const mode = App.gameMode || 'TIMER';
        const history = DataManager.sessionData || [];

        document.getElementById('pdf-nick').innerText = nickname || "Invitado";
        document.getElementById('pdf-date').innerText = new Date().toLocaleDateString('es-CO');

        // Traducir modo
        const modeNames = { 'TIMER': 'Contrarreloj', 'FREE': 'Práctica Libre', 'ADAPTIVE': 'Adaptativo' };
        document.getElementById('pdf-mode').innerText = modeNames[mode] || mode;

        const total = history.length;
        const correct = history.filter(h => h.is_correct === 1).length;
        document.getElementById('pdf-score').innerText = `${correct} / ${total}`;

        // B. Generar Análisis AI (Placeholder inteligente basado en datos)
        const accuracy = total > 0 ? (correct / total * 100).toFixed(0) : 0;
        const aiText = this.generateAIAnalysis(accuracy, total, correct);
        document.getElementById('pdf-ai-comment').innerText = `"${aiText}"`;

        // C. Clonar Gráficas (Canvas -> Imagen)
        // IDs de los canvas originales del Dashboard
        const chartIDs = ['chart-pie', 'chart-bar-tables', 'chart-bar-top', 'chart-histogram'];
        // IDs de los contenedores en el PDF
        const slotIDs = ['slot-chart-1', 'slot-chart-2', 'slot-chart-3', 'slot-chart-4'];

        chartIDs.forEach((id, i) => {
            const canvas = document.getElementById(id);
            const slot = document.getElementById(slotIDs[i]);
            if (canvas && slot) {
                try {
                    // Convertir a imagen de alta calidad
                    const img = new Image();
                    img.src = canvas.toDataURL('image/png', 1.0);
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '140px';
                    img.style.objectFit = 'contain';
                    slot.innerHTML = ''; // Limpiar slot previo
                    slot.appendChild(img);
                } catch (e) {
                    console.warn(`No se pudo clonar el canvas ${id}:`, e);
                }
            }
        });

        // D. Configurar y Generar PDF
        const element = document.getElementById('pdf-template');

        const opt = {
            margin: 0,
            filename: `Baldora_Reporte_${nickname || 'Sesion'}_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false
            },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
        };

        try {
            // Mostrar indicador de carga
            const btnPDF = document.querySelector('#modal-export .btn-primary');
            const originalText = btnPDF ? btnPDF.innerHTML : '';
            if (btnPDF) {
                btnPDF.innerHTML = '<span style="font-size: 2.5rem;">⏳</span><span>Generando...</span>';
                btnPDF.disabled = true;
            }

            await html2pdf().set(opt).from(element).save();

            // Restaurar botón
            if (btnPDF) {
                btnPDF.innerHTML = originalText;
                btnPDF.disabled = false;
            }
        } catch (e) {
            console.error("Error generando PDF:", e);
            alert("Error generando el reporte. Verifique la consola.");
        }

        this.closeModal();
    },

    // 5. Generador de análisis AI (Simulado)
    generateAIAnalysis(accuracy, total, correct) {
        if (total === 0) {
            return "No hay suficientes datos para generar un análisis. ¡Completa una sesión primero!";
        }

        const accNum = parseFloat(accuracy);

        if (accNum >= 95) {
            return "¡Extraordinario! Tu dominio de las tablas es excepcional. Mantén este nivel de excelencia practicando las operaciones más complejas.";
        } else if (accNum >= 85) {
            return "¡Excelente rendimiento! Tienes una sólida comprensión de las tablas. Enfócate en reducir tu tiempo de respuesta para alcanzar la maestría total.";
        } else if (accNum >= 70) {
            return "¡Buen trabajo! Vas por buen camino. Te recomiendo practicar más las tablas del 7, 8 y 9 que suelen ser las más desafiantes.";
        } else if (accNum >= 50) {
            return "Estás progresando. Dedica sesiones cortas pero frecuentes para reforzar las tablas que más te cuestan. ¡La práctica hace al maestro!";
        } else {
            return "¡No te desanimes! Cada sesión es una oportunidad de mejora. Comienza con las tablas más sencillas y ve aumentando la dificultad gradualmente.";
        }
    }
};

// Función global para cerrar modales (compatible con otros modales del sistema)
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}
