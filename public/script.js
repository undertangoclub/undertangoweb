document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const welcomeText = document.querySelector(".welcome-text");
  const subText = document.querySelector(".sub-text");
  const centerLogo = document.querySelector(".center img");
  const circles = document.querySelectorAll(".circle");
  const totalCircles = 6;
  let circleStates = [];
  let lastUpdateTime = Date.now();
  let centeredCircle = null;
  let animationFrameId = null;
  let isInitialized = false;
  let introSkipped = false;
  let isShowsCentered = false;
  let welcomeTextTimeout, subTextTimeout, layoutTimeout;

  // Configuraciones para cambiar imágenes y enlaces
  const relatedContent = {
    Shows: [
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

  // Comprobar si la página se cargó con el parámetro skipIntro
  const urlParams = new URLSearchParams(window.location.search);
  introSkipped = urlParams.has("skipIntro");

  function skipIntro() {
    if (!introSkipped) {
      introSkipped = true;
      clearTimeout(welcomeTextTimeout);
      clearTimeout(subTextTimeout);
      clearTimeout(layoutTimeout);
      welcomeText.style.transition = "none";
      subText.style.transition = "none";
      welcomeText.style.opacity = "0";
      subText.style.opacity = "0";
      centerLogo.style.opacity = "1";
      updateLayout();
    }
  }

  // Event listeners para saltar la intro
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      skipIntro();
    }
  });

  document.addEventListener("click", skipIntro);

  function fadeIn(element, duration, delay = 0) {
    return new Promise((resolve) => {
      if (introSkipped) {
        resolve();
        return;
      }
      element.style.opacity = "0";
      setTimeout(() => {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = "1";
        setTimeout(resolve, duration);
      }, delay);
    });
  }

  async function playIntroAnimation() {
    if (introSkipped) {
      centerLogo.style.opacity = "1";
      updateLayout();
      return;
    }

    centerLogo.style.opacity = "0";
    await Promise.all([fadeIn(welcomeText, 1000), fadeIn(centerLogo, 1000)]);
    await new Promise((resolve) => setTimeout(resolve, 400));
    welcomeText.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, 400));
    await fadeIn(subText, 1000);
    await new Promise((resolve) => setTimeout(resolve, 400));
    subText.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, 400));
    updateLayout();
  }

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
        // Change text when hovering over the circle
        const circleName = circle.getAttribute("data-name");
        welcomeText.textContent = circleName;
        welcomeText.style.opacity = "1";
      });

      circle.addEventListener("mouseleave", () => {
        // Clear the text when leaving the circle
        welcomeText.style.opacity = "0";
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

    if (clickedLogoName === "Shows") {
      // Check if "Shows" is already centered
      if (!isShowsCentered) {
        // Center "Shows" and show related content
        stopAnimation();
        centeredCircle = circle;
        centeredCircle.style.transition = "transform 0.3s ease";
        centeredCircle.style.transform = `translate(0, 0) scale(1.5)`;
        showShowsIntro();
        redistributeCircles(radius, circleSize, true);
        isShowsCentered = true; // Mark "Shows" as centered
      }
    } else {
      // Handle clicks on other circles
      if (centeredCircle === circle) {
        // Un-center the current circle
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
          resetCircles();
          redistributeCircles(radius, circleSize, false);
          requestAnimationFrame(() => {
            circles.forEach((c) => {
              c.style.opacity = "1";
            });
            startAnimation(radius, circleSize);
          });
        }, 300);
        isShowsCentered = false; // Reset the "Shows" centered state
      } else {
        // Center any other circle
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
  }

  function showShowsIntro() {
    stopAnimation();
    welcomeText.textContent = "Shows de tango";
    subText.textContent = "Producciones inolvidables";

    fadeInOutSequence(welcomeText, subText, 1000, 1500, 200);
    transitionCircleImages(relatedContent["Shows"]);
  }

  function fadeInOutSequence(
    element1,
    element2,
    fadeInDuration,
    stayDuration,
    betweenDelay
  ) {
    element1.style.transition = `opacity ${fadeInDuration}ms ease`;
    element2.style.transition = `opacity ${fadeInDuration}ms ease`;

    setTimeout(() => {
      element1.style.opacity = "1";
      setTimeout(() => {
        element1.style.opacity = "0";
        setTimeout(() => {
          element2.style.opacity = "1";
          setTimeout(() => {
            element2.style.opacity = "0";
          }, stayDuration);
        }, betweenDelay);
      }, stayDuration);
    }, 100);
  }

  function transitionCircleImages(relatedItems) {
    const circles = Array.from(document.querySelectorAll(".circle"));
    const remainingCircles = circles.filter(
      (circle) => circle !== centeredCircle
    );

    remainingCircles.forEach((circle, index) => {
      if (index < relatedItems.length) {
        const item = relatedItems[index];
        const oldImg = circle.querySelector("img");
        const newImg = document.createElement("img");

        newImg.src = item.image;
        newImg.alt = item.name;
        newImg.style.position = "absolute";
        newImg.style.top = "0";
        newImg.style.left = "0";
        newImg.style.width = "100%";
        newImg.style.height = "100%";
        newImg.style.opacity = "0";
        newImg.style.transition = "opacity 0.5s ease-in-out";

        circle.appendChild(newImg);
        newImg.offsetHeight; // Trigger reflow
        newImg.style.opacity = "1";

        setTimeout(() => {
          oldImg.remove();
          const link = document.createElement("a");
          link.href = item.link;
          link.appendChild(newImg);
          circle.innerHTML = "";
          circle.appendChild(link);
          circle.setAttribute("data-name", item.name);
        }, 500);
      }
    });
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

      circle.style.transition = animate ? "transform 0.3s ease" : "none";
      circle.style.transform = `translate(${x}px, ${y}px) scale(1.7)`;
    });
  }

  function resetCircles() {
    const circles = document.querySelectorAll(".circle");
    const originalLogos = [
      { src: "./img/logo1.gif", alt: "Shows" },
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

  // Iniciar la secuencia de animación
  playIntroAnimation();
});
