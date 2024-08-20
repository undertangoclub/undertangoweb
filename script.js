const container = document.querySelector(".container");
const totalCircles = 6;

let circleStates = [];
let lastUpdateTime = Date.now();
let centeredCircle = null;
let animationFrameId = null;
let isInitialized = false;

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

    circle.addEventListener("click", () =>
      handleCircleClick(circle, radius, circleSize)
    );
  });

  if (!isInitialized) {
    isInitialized = true;
    initializeCirclePositions(radius);
  }

  // Iniciar el fade-in de los círculos y la animación con un pequeño retraso
  setTimeout(() => {
    circles.forEach((circle) => {
      circle.style.opacity = "1";
    });
    startAnimation(radius, circleSize);
  }, 100);
}

function initializeCirclePositions(radius) {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle, index) => {
    const state = circleStates[index];
    const x = radius * Math.cos(state.angle);
    const y = radius * Math.sin(state.angle);
    circle.style.transform = `translate(${x}px, ${y}px) scale(1)`;
  });
}

function handleCircleClick(circle, radius, circleSize) {
  if (centeredCircle === circle) {
    // Detener la animación temporalmente
    stopAnimation();

    // Fade out de todos los círculos
    const circles = document.querySelectorAll(".circle");
    circles.forEach((c) => {
      c.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      c.style.opacity = "0";
      if (c === centeredCircle) {
        c.style.transform = `scale(0.5)`;
      }
    });

    // Esperar a que termine el fade out antes de redistribuir
    setTimeout(() => {
      centeredCircle.style.transform = `scale(1)`;
      centeredCircle = null;
      lastUpdateTime = Date.now();

      // Redistribuir círculos sin animación
      redistributeCircles(radius, circleSize, false);

      // Iniciar el fade in y reiniciar la animación
      requestAnimationFrame(() => {
        circles.forEach((c) => {
          c.style.opacity = "1";
        });
        startAnimation(radius, circleSize);
      });
    }, 300);
  } else {
    if (centeredCircle) {
      centeredCircle.style.transition = "transform 0.3s ease";
      centeredCircle.style.transform = `scale(1)`;
    }
    centeredCircle = circle;
    centeredCircle.style.transition = "transform 0.3s ease";
    centeredCircle.style.transform = `translate(0, 0) scale(1.5)`;

    redistributeCircles(radius, circleSize, true);
  }
}

function redistributeCircles(radius, circleSize, animate = true) {
  const circles = Array.from(document.querySelectorAll(".circle"));
  const remainingCircles = circles.filter(
    (circle) => circle !== centeredCircle
  );
  const totalRemaining = remainingCircles.length;

  remainingCircles.forEach((circle, index) => {
    const angle = (index * 2 * Math.PI) / totalRemaining;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    circleStates[circles.indexOf(circle)].angle = angle;

    if (animate) {
      circle.style.transition = "transform 0.3s ease";
    } else {
      circle.style.transition = "none";
    }
    circle.style.transform = `translate(${x}px, ${y}px) scale(1)`;
  });
}

function animateCircles(radius, circleSize) {
  if (centeredCircle) {
    animationFrameId = requestAnimationFrame(() =>
      animateCircles(radius, circleSize)
    );
    return;
  }

  const circles = document.querySelectorAll(".circle");
  const currentTime = Date.now();
  const elapsedTime = (currentTime - lastUpdateTime) / 1000;
  lastUpdateTime = currentTime;

  circleStates.forEach((state, index) => {
    state.angle += elapsedTime * 0.5;
    const x = radius * Math.cos(state.angle);
    const y = radius * Math.sin(state.angle);
    circles[index].style.transform = `translate(${x}px, ${y}px) scale(1)`;
  });

  animationFrameId = requestAnimationFrame(() =>
    animateCircles(radius, circleSize)
  );
}

function startAnimation(radius, circleSize) {
  if (!animationFrameId) {
    lastUpdateTime = Date.now();
    animateCircles(radius, circleSize);
  }
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

window.addEventListener("resize", () => {
  stopAnimation();
  updateLayout();
});

// Inicializar el layout después de que todos los recursos se hayan cargado
window.addEventListener("load", updateLayout);
