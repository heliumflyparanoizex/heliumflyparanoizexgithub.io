// --- CEREBRO DEL LIBRO VIVIENTE (v1.0) ---
// --- ARQUITECTO: HELIUM FLY PARANOIZEX ---

// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', () => {
    // Inicia el nodo de la historia
    // Usamos el nodo 'start' como punto de inicio
    loadScene('start');
});

// Base de Datos de Nodos de la Historia
// (Basada en tu archivo de juego de Aryan Phoenix KROMALUX)
const storyNodes = {
    'start': {
        [span_2](start_span)//[span_2](end_span)
        narrative: "Aryan Phoenix Kromalux, te encuentras en el centro del Universo AZUL. El aire vibra con la energía de la verdad. El Cristal de la Verdad flota frente a ti, pero su luz parpadea... 'La verdad se desvanece. Un invasor se acerca', resuena una voz en tu mente.",
        image: "httpsT://i.imgur.com/gA9xQ8S.png", // Imagen de Universo Azul
        choices: [
            [span_3](start_span){ text: "1. Conectarse con el Fénix (Tótem)", nextNode: 'connectFenix' }, //[span_3](end_span)
            [span_4](start_span){ text: "2. Sumergirse en el Cristal de la Verdad (Sabiduría)", nextNode: 'connectCristal' }, //[span_4](end_span)
            [span_5](start_span){ text: "3. Explorar el Universo AZUL (Acción)", nextNode: 'exploreUniverso' } //[span_5](end_span)
        ]
    },
    'connectFenix': {
        narrative: "Te fusionas con tu Tótem. El Fénix te muestra una visión de la región fronteriza del Universo AZUL, donde la realidad se diluye. La corrupción viene de allí.",
        image: "httpsLET://i.imgur.com/L5b1YvK.png", // Imagen de Fénix
        choices: [
            { text: "Ir a la región fronteriza ahora", nextNode: 'regionFronteriza' }
        ]
    },
    'connectCristal': {
        [span_6](start_span)narrative: "Te sumerges en la sabiduría del Cristal. Sientes una voz antigua: 'La verdad está siendo corrompida por susurros, por Los Whispers. Debes encontrar la raíz del engaño en la región fronteriza'.", //[span_6](end_span)
        image: "httpsT://i.imgur.com/83p1y9W.png", // Imagen de Cristal
        choices: [
            { text: "Ir a la región fronteriza ahora", nextNode: 'regionFronteriza' }
        ]
    },
    'exploreUniverso': {
        [span_7](start_span)[span_8](start_span)[span_9](start_span)//[span_7](end_span)[span_8](end_span)[span_9](end_span)
        narrative: "Decides explorar. Llegas a una región donde los habitantes están confundidos y angustiados. 'Una sombra se ha extendido', te dicen, 'Ya no sabemos qué es verdad y qué es mentira'.",
        image: "httpsT://i.imgur.com/K8J9F0L.png", // Imagen de Habitantes
        choices: [
            [span_10](start_span){ text: "Interrogarlos más (Buscar la Raíz)", nextNode: 'connectCristal' }, //[span_10](end_span)
            { text: "Ir a la región fronteriza que mencionan", nextNode: 'regionFronteriza' }
        ]
    },
    'regionFronteriza': {
        narrative: "Llegas a la región fronteriza. La corrupción es palpable. Ahora debes decidir tu próximo movimiento. (CONTINUARÁ...)",
        image: "httpsTES://i.imgur.com/V9c0A1s.png", // Imagen de Región Fronteriza
        choices: [
            { text: "Volver al inicio", nextNode: 'start' }
        ]
    }
};

// --- FUNCIÓN DE RENDERIZADO DEL LCOS (Lyron Cypher OS) ---

function loadScene(nodeKey) {
    const node = storyNodes[nodeKey];

    if (!node) {
        console.error(`Error de Coherencia: El nodo '${nodeKey}' no existe en la Base de Datos.`);
        return;
    }

    // 1. Actualizar Narrativa (El Prompt)
    const narrativeEl = document.getElementById('narrative');
    narrativeEl.textContent = node.narrative;

    // 2. Actualizar Imagen (La Visualización)
    const imageEl = document.querySelector('#image-container img');
    imageEl.src = node.image;

    // 3. Limpiar Decisiones Anteriores (Limpieza de Buffer)
    const choicesEl = document.getElementById('choices-container');
    choicesEl.innerHTML = ''; // Limpia los botones viejos

    // 4. Cargar Nuevas Decisiones (Protocolo de Transferencia)
    node.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.className = 'choice-btn'; // Asigna la clase de estilo
        
        // Asigna el evento de clic para cargar el siguiente nodo
        button.addEventListener('click', () => {
            loadScene(choice.nextNode);
        });
        
        choicesEl.appendChild(button);
    });
}

