const container = document.querySelector('.container');
const center = document.querySelector('.center');
const totalCircles = 6;

let circleStates = [];
let isPaused = false;
let lastUpdateTime = Date.now();
let centeredCircle = null;

function updateLayout() {
    const radius = Math.min(container.clientWidth, container.clientHeight) * 0.35;
    const circleSize = Math.min(container.clientWidth, container.clientHeight) * 0.15;

    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        circle.style.width = `${circleSize}px`;
        circle.style.height = `${circleSize}px`;
        
        if (!circleStates[index]) {
            circleStates[index] = {
                angle: (index * 2 * Math.PI / totalCircles),
                originalSize: circleSize
            };
        }

        circle.addEventListener('mouseenter', () => {
            console.log(`Mouse entered: ${circle.dataset.name}`);
            isPaused = true;
        });

        circle.addEventListener('mouseleave', () => {
            console.log(`Mouse left: ${circle.dataset.name}`);
            if (!centeredCircle) {
                isPaused = false;
                lastUpdateTime = Date.now();
            }
        });

        circle.addEventListener('click', () => {
            if (centeredCircle === circle) {
                // Si el círculo ya está en el centro, lo devolvemos a su posición original
                circle.style.transition = 'all 0.5s ease';
                circle.style.width = `${circleStates[index].originalSize}px`;
                circle.style.height = `${circleStates[index].originalSize}px`;
                centeredCircle = null;
                isPaused = false;
                lastUpdateTime = Date.now();
            } else {
                // Si hay un círculo en el centro, lo devolvemos a su tamaño original
                if (centeredCircle) {
                    const centeredIndex = Array.from(circles).indexOf(centeredCircle);
                    centeredCircle.style.transition = 'all 0.5s ease';
                    centeredCircle.style.width = `${circleStates[centeredIndex].originalSize}px`;
                    centeredCircle.style.height = `${circleStates[centeredIndex].originalSize}px`;
                }
                
                // Centramos el círculo clickeado
                circle.style.transition = 'all 0.5s ease';
                circle.style.left = `${center.clientWidth / 2 - circleSize / 2}px`;
                circle.style.top = `${center.clientHeight / 2 - circleSize / 2}px`;
                circle.style.width = `${circleSize * 1.5}px`;  // Hacemos el círculo un 50% más grande
                circle.style.height = `${circleSize * 1.5}px`;
                centeredCircle = circle;
                isPaused = true;
            }
        });
    });

    animateCircles(radius, circleSize);
}

function animateCircles(radius, circleSize) {
    const circles = document.querySelectorAll('.circle');
    const currentTime = Date.now();
    
    if (!isPaused) {
        const elapsedTime = (currentTime - lastUpdateTime) / 1000; // Convertir a segundos
        circleStates.forEach(state => {
            state.angle += elapsedTime * 0.5; // Ajustar la velocidad aquí
        });
        lastUpdateTime = currentTime;
    }

    circles.forEach((circle, index) => {
        if (circle !== centeredCircle) {
            const state = circleStates[index];
            const x = radius * Math.cos(state.angle);
            const y = radius * Math.sin(state.angle);
            circle.style.left = `${x + center.clientWidth / 2 - circleSize / 2}px`;
            circle.style.top = `${y + center.clientHeight / 2 - circleSize / 2}px`;
        }
    });

    requestAnimationFrame(() => animateCircles(radius, circleSize));
}

window.addEventListener('resize', updateLayout);

updateLayout(); // Inicializa el layout al cargar la página