const container = document.querySelector(".container");
const center = document.querySelector(".center");
const totalCircles = 6;

let circleStates = [];
let lastUpdateTime = Date.now();
let centeredCircle = null;

function updateLayout() {
  const radius = Math.min(container.clientWidth, container.clientHeight) * 0.35;
  const circleSize =
    Math.min(container.clientWidth, container.clientHeight) * 0.15;

  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle, index) => {
    circle.style.width = `${circleSize}px`;
    circle.style.height = `${circleSize}px`;

    if (!circleStates[index]) {
      circleStates[index] = {
        angle: (index * 2 * Math.PI) / totalCircles,
        originalSize: circleSize,
      };
    }

    circle.addEventListener("click", () => {
      if (centeredCircle === circle) {
        // Si el círculo ya está en el centro, lo devolvemos a su posición original
        centeredCircle.style.transition = "all 0.5s ease";
        centeredCircle.style.transform = `scale(1)`;
        centeredCircle = null;
        lastUpdateTime = Date.now();
        redistributeCircles(radius, circleSize); // Redistribuir equitativamente
      } else {
        if (centeredCircle) {
          centeredCircle.style.transition = "all 0.5s ease";
          centeredCircle.style.transform = `scale(1)`;
        }
        centeredCircle = circle;
        centeredCircle.style.transition = "all 0.5s ease";
        centeredCircle.style.transform = `translate(0, 0) scale(1.5)`;

        // Redistribuir los otros círculos
        redistributeCircles(radius, circleSize);
      }
    });
  });

  animateCircles(radius, circleSize);
}

function redistributeCircles(radius, circleSize) {
  const circles = Array.from(document.querySelectorAll(".circle"));
  const remainingCircles = circles.filter(
    (circle) => circle !== centeredCircle
  );
  const totalRemaining = remainingCircles.length;

  remainingCircles.forEach((circle, index) => {
    const angle = (index * 2 * Math.PI) / totalRemaining; // Recalcula el ángulo basado en los círculos restantes
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    circleStates[circles.indexOf(circle)].angle = angle; // Actualiza el estado con el nuevo ángulo

    circle.style.transition = "all 0.5s ease";
    circle.style.transform = `translate(${x}px, ${y}px) scale(1)`;
  });
}

function updateCirclePositions(radius, circleSize) {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle, index) => {
    if (circle !== centeredCircle) {
      const state = circleStates[index];
      const x = radius * Math.cos(state.angle);
      const y = radius * Math.sin(state.angle);
      circle.style.transition = "all 0.5s ease";
      circle.style.transform = `translate(${x}px, ${y}px) scale(1)`;
    }
  });
}

function animateCircles(radius, circleSize) {
  const circles = document.querySelectorAll(".circle");
  const currentTime = Date.now();

  if (!centeredCircle) {
    const elapsedTime = (currentTime - lastUpdateTime) / 1000; // Convertir a segundos
    circleStates.forEach((state) => {
      state.angle += elapsedTime * 0.5; // Ajustar la velocidad aquí
    });
    lastUpdateTime = currentTime;
  }

  circles.forEach((circle, index) => {
    if (circle !== centeredCircle) {
      const state = circleStates[index];
      const x = radius * Math.cos(state.angle);
      const y = radius * Math.sin(state.angle);
      circle.style.transform = `translate(${x}px, ${y}px) scale(1)`;
    }
  });

  requestAnimationFrame(() => animateCircles(radius, circleSize));
}

window.addEventListener("resize", updateLayout);

updateLayout(); // Inicializa el layout al cargar la página
