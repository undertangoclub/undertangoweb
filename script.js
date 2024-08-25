document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const welcomeText = document.querySelector(".welcome-text");
  const subText = document.querySelector(".sub-text");
  const totalCircles = 6;
  let circleStates = [];
  let lastUpdateTime = Date.now();
  let centeredCircle = null;
  let animationFrameId = null;
  let isInitialized = false;

  // Configuraciones para cambiar imágenes y enlaces
  const relatedContent = {
    "Logo 1": [
      {
        name: "Upcoming Shows",
        image: "./img/upcoming-shows.jpg",
        link: "./pages/upcoming-shows.html",
      },
      {
        name: "Past Performances",
        image: "./img/past-performances.jpg",
        link: "./pages/past-performances.html",
      },
      {
        name: "Book a Show",
        image: "./img/book-show.jpg",
        link: "./pages/book-show.html",
      },
      {
        name: "Venues",
        image: "./img/venues.jpg",
        link: "./pages/venues.html",
      },
      {
        name: "Artists",
        image: "./img/artists.jpg",
        link: "./pages/artists.html",
      },
    ],
  };

  function updateLayout() {
    const radius =
      Math.min(container.clientWidth, container.clientHeight) * 0.35;
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

      circle.addEventListener("mouseover", () => {
        console.log(
          `Estás pasando el cursor sobre: ${circle.getAttribute("data-name")}`
        );
      });

      circle.addEventListener("click", () =>
        handleCircleClick(circle, radius, circleSize)
      );
    });

    if (!isInitialized) {
      isInitialized = true;
      initializeCirclePositions(radius);
    }

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
    const clickedLogoName = circle.getAttribute("data-name");

    if (centeredCircle === circle) {
      stopAnimation();
      const circles = document.querySelectorAll(".circle");
      circles.forEach((c) => {
        c.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        c.style.opacity = "0";
        if (c === centeredCircle) {
          c.style.transform = `scale(0.5)`;
        }
      });

      setTimeout(() => {
        centeredCircle.style.transform = `scale(1)`;
        centeredCircle = null;
        lastUpdateTime = Date.now();
        resetCircles(); // Restablecer al estado original
        redistributeCircles(radius, circleSize, false);
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

      if (clickedLogoName === "Logo 1") {
        updateRelatedCircles(relatedContent["Logo 1"]);
      }

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

  function updateRelatedCircles(relatedItems) {
    const circles = Array.from(document.querySelectorAll(".circle"));
    const remainingCircles = circles.filter(
      (circle) => circle !== centeredCircle
    );

    remainingCircles.forEach((circle, index) => {
      if (index < relatedItems.length) {
        const item = relatedItems[index];
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;

        const link = document.createElement("a");
        link.href = item.link;
        link.appendChild(img);

        circle.innerHTML = "";
        circle.appendChild(link);

        circle.setAttribute("data-name", item.name);
      }
    });
  }

  function resetCircles() {
    const circles = document.querySelectorAll(".circle");
    const originalLogos = [
      { src: "./img/logo1.gif", alt: "Logo 1" },
      { src: "./img/logo2.gif", alt: "Logo 2" },
      { src: "./img/logo3.gif", alt: "Logo 3" },
      { src: "./img/logo4.png", alt: "Logo 4" },
      { src: "./img/logo5.jpg", alt: "Logo 5" },
      { src: "./img/logo6.png", alt: "Logo 6" },
    ];

    circles.forEach((circle, index) => {
      if (index < originalLogos.length) {
        const logo = originalLogos[index];
        let img = circle.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          circle.appendChild(img);
        }
        img.src = logo.src;
        img.alt = logo.alt;
        circle.setAttribute("data-name", logo.alt);

        if (circle.querySelector("a")) {
          circle.innerHTML = "";
          circle.appendChild(img);
        }
      }
    });

    // Si faltan círculos, crea los que falten
    while (circles.length < originalLogos.length) {
      const newCircle = document.createElement("div");
      newCircle.className = "circle";
      const newImg = document.createElement("img");
      const newLogo = originalLogos[circles.length];
      newImg.src = newLogo.src;
      newImg.alt = newLogo.alt;
      newCircle.appendChild(newImg);
      newCircle.setAttribute("data-name", newLogo.alt);
      container.appendChild(newCircle);
    }
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

  welcomeText.style.opacity = "1";

  setTimeout(() => {
    welcomeText.style.opacity = "0";
    setTimeout(() => {
      subText.style.opacity = "1";
    }, 200);

    setTimeout(() => {
      subText.style.opacity = "0";
    }, 1500);

    setTimeout(() => {
      updateLayout();
    }, 2000);
  }, 1500);
});
