const container = document.querySelector(".container");
const totalCircles = 6;

let circleStates = [];
let lastUpdateTime = Date.now();
let centeredCircle = null;
let animationFrameId = null;
let isAnimating = false;

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
      if (!isAnimating) {
        handleCircleClick(circle, radius, circleSize);
      }
    });
  });

  startAnimation(radius, circleSize);

  // Iniciar el fade-in de los círculos
  requestAnimationFrame(() => {
    circles.forEach((circle) => {
      circle.style.opacity = "1";
    });
  });
}

function handleCircleClick(circle, radius, circleSize) {
  isAnimating = true;
  stopAnimation();

  if (centeredCircle === circle) {
    // Fade out y reducción de escala del círculo central
    centeredCircle.style.transition = "all 0.3s ease";
    centeredCircle.style.transform = `scale(0.5)`;
    centeredCircle.style.opacity = "0";

    // Fade out rápido de los otros círculos
    const circles = document.querySelectorAll(".circle");
    circles.forEach((c) => {
      c.style.transition = "opacity 0.3s ease";
      c.style.opacity = "0";
    });

    // Redistribuir círculos y reiniciar animación
    setTimeout(() => {
      centeredCircle.style.transform = `scale(1)`; // Resetear el tamaño
      centeredCircle = null;
      lastUpdateTime = Date.now();

      redistributeCircles(radius, circleSize);

      // Iniciar el fade in de todos los círculos y reiniciar la animación
      requestAnimationFrame(() => {
        circles.forEach((c) => {
          c.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          c.style.opacity = "1";
        });
        startAnimation(radius, circleSize);
        isAnimating = false;
      });
    }, 300);
  } else {
    if (centeredCircle) {
      centeredCircle.style.transition = "all 0.3s ease";
      centeredCircle.style.transform = `scale(1)`;
    }
    centeredCircle = circle;
    centeredCircle.style.transition = "all 0.3s ease";
    centeredCircle.style.transform = `translate(0, 0) scale(1.5)`;

    redistributeCircles(radius, circleSize);
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }
}

function redistributeCircles(radius, circleSize) {
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

    circle.style.transition = "transform 0.3s ease";
    circle.style.transform = `translate(${x}px, ${y}px) scale(1)`;
  });
}

function animateCircles(radius, circleSize) {
  const circles = document.querySelectorAll(".circle");
  const currentTime = Date.now();
  const elapsedTime = (currentTime - lastUpdateTime) / 1000;
  lastUpdateTime = currentTime;

  if (!centeredCircle && !isAnimating) {
    circleStates.forEach((state, index) => {
      state.angle += elapsedTime * 0.5;
      const x = radius * Math.cos(state.angle);
      const y = radius * Math.sin(state.angle);
      circles[index].style.transform = `translate(${x}px, ${y}px) scale(1)`;
    });
  }

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

updateLayout();
