/**
 * Visitor Counter Module
 * Utiliza Firebase Realtime Database para contar visitantes únicos por sesión
 */

const VisitorCounter = {
    // Referencia a la base de datos
    db: null,
    counterRef: null,

    /**
     * Inicializa el contador de visitas
     */
    init() {
        // Verificar que Firebase esté disponible
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK no está cargado');
            return;
        }

        // Obtener referencia a la base de datos
        this.db = firebase.database();
        this.counterRef = this.db.ref('visits/count');

        // Verificar si ya se contó esta sesión
        if (!sessionStorage.getItem('baldora_visited')) {
            this.incrementCounter();
            sessionStorage.setItem('baldora_visited', 'true');
        }

        // Escuchar cambios en tiempo real
        this.listenToCounter();
    },

    /**
     * Incrementa el contador de forma atómica
     */
    incrementCounter() {
        this.counterRef.transaction((currentValue) => {
            return (currentValue || 0) + 1;
        }).catch((error) => {
            console.error('Error al incrementar contador:', error);
        });
    },

    /**
     * Escucha cambios en el contador y actualiza la UI
     */
    listenToCounter() {
        this.counterRef.on('value', (snapshot) => {
            const count = snapshot.val() || 0;
            this.updateDisplay(count);
        }, (error) => {
            console.error('Error al leer contador:', error);
            this.updateDisplay('---');
        });
    },

    /**
     * Actualiza el elemento visual del contador
     * @param {number|string} count - Número de visitas
     */
    updateDisplay(count) {
        const displayElement = document.getElementById('visit-count');
        if (displayElement) {
            // Formatear número con separadores de miles
            const formatted = typeof count === 'number'
                ? count.toLocaleString('es-ES')
                : count;
            displayElement.textContent = formatted;
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño delay para asegurar que Firebase esté inicializado
    setTimeout(() => {
        VisitorCounter.init();
    }, 500);
});
