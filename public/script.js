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
  let isClasesCentered = false;
  let isModaCentered = false;
  let isFDICentered = false;
  let isTallerCentered = false;
  let isAppsCentered = false;
  let welcomeTextTimeout, subTextTimeout, layoutTimeout;

  window.addEventListener("unhandledrejection", function (event) {
    console.error("Unhandled promise rejection:", event.reason);
  });

  // Configurations for changing images and links
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
        name: "Veni a visitarnos",
        image: "./img/venues.jpg",
        link: "./pages/venues.html",
      },
      {
        name: "Artists",
        image: "./img/artists.jpg",
        link: "./pages/artists.html",
      },
    ],
    Clases: [
      {
        name: "Clases Grupales",
        image: "./img/clases-grupales.jpg",
        link: "./pages/clases-grupales.html",
      },
      {
        name: "Clases Privadas",
        image: "./img/clases-privadas.jpg",
        link: "./pages/clases-privadas.html",
      },
      {
        name: "Cursos On-Line",
        image: "./img/cursos-on-line.jpg",
        link: "https://hotmart.com/es/marketplace/productos/20-lecciones-de-tango/F62016758K",
      },
      {
        name: "Otras Disciplinas",
        image: "./img/otros-cursos.jpg",
        link: "./pages/otras-disciplinas.html",
      },
      {
        name: "Academia de Aprendizaje",
        image: "./img/academia-de-aprendizaje.jpg",
        link: "./pages/academia-de-aprendizaje.html",
      },
    ],
    Moda: [
      {
        name: "Actualidad",
        image: "./img/moda.png",
        link: "./pages/moda.html",
      },
      {
        name: "Nuestro Taller",
        image: "./img/moda-taller.jpg",
        link: "./pages/moda-taller.html",
      },
      {
        name: "Catálogo Primavera-Verano",
        image: "./img/catalogo-primavera-otonio.jpg",
        link: "./pages/primavera-verano-2024.pdf",
      },
      {
        name: "Catálogo Otoño-Invierno",
        image: "./img/catalogo-otono-invierno.png",
        link: "./pages/otonio-invierno-2025.pdf",
      },
      {
        name: "Tienda",
        image: "./img/moda-tienda.jpg",
        link: "./pages/moda-tienda.html",
      },
    ],
    "Fondo de Inversión": [
      {
        name: "Página de Inversores",
        image: "./img/pagina-inversores.jpg",
        link: "fdi/fondo-de-inversiones.html",
      },
      {
        name: "Boletín Semanal",
        image: "./img/boletin-semanal.jpg",
        link: "./pages/boletin-semanal.html",
      },
      {
        name: "Docs sobre tokenización y web3",
        image: "./img/docs-tokenizacion-web3.jpg",
        link: "./pages/fdi/docs-tokenizacion-web3.html",
      },
      {
        name: "Cursos sobre criptografía y blockchains",
        image: "./img/cursos-cripto-blockchain.jpg",
        link: "./pages/fdi/cursos-cripto-blockchain.html",
      },
      {
        name: "Whitepaper",
        image: "./img/whitepaper.jpg",
        link: "https://docs.google.com/document/d/1-chA3vrOGWxO69qJzOj9P7g9RSxSyxY9Yu0DWcCjX4Y/edit?usp=sharing",
      },
    ],
    Taller: [
      {
        name: "Impresiones 3D",
        image: "./img/impresiones-3d.jpg",
        link: "./pages/modelado-3d.html",
      },
      {
        name: "Cortado Laser",
        image: "./img/cortado-laser.jpg",
        link: "./pages/taller/cortado-laser.html",
      },
      {
        name: "Diseño Textil",
        image: "./img/diseno-textil.jpg",
        link: "./pages/taller/diseno-textil.html",
      },
      {
        name: "Muebles a Medida",
        image: "./img/muebles-a-medida.jpg",
        link: "./pages/taller/muebles-a-medida.html",
      },
      {
        name: "Experimentos",
        image: "./img/experimentos.jpg",
        link: "./pages/taller/experimentos.html",
      },
    ],

    Apps: [
      {
        name: "Red Cripto",
        image: "./img/red-cripto.jpg",
        link: "./ut-coin/index.html",
      },
      {
        name: "Juego Cripto",
        image: "./img/juego-cripto.jpg",
        link: "./fdi/game77/portada-bizantina.html",
      },
      {
        name: "Mainstream",
        image: "./img/mainstream.jpg",
        link: "./pages/redes.html",
      },
      {
        name: "CV",
        image: "./img/cv.jpg",
        link: "./pages/cv.html",
      },
      {
        name: "GitHub",
        image: "./img/github.jpg",
        link: "https://github.com/undertangoclub",
      },
    ],
  };

  // -------------------------------------------------------------------
  // SECCIÓN DE CÓDIGO PARA PRECARGAR LAS IMÁGENES DE FORMA SECUENCIAL
  // -------------------------------------------------------------------

  // Array con las rutas de las imágenes clave (logo principal y círculos)
  const mainImages = [
    "./img/underlogoredondo.png", // Logo principal
    "./img/logo1.gif", // Imagen de círculo 1
    "./img/logo2.gif", // Imagen de círculo 2
    "./img/logo3.gif", // Imagen de círculo 3
    "./img/logo4.png", // Imagen de círculo 4
    "./img/logo5.jpg", // Imagen de círculo 5
    "./img/logo6.png", // Imagen de círculo 6
  ];

  // Extraemos las rutas de las imágenes de relatedContent
  const relatedContentImages = Object.values(relatedContent).flatMap(
    (category) => category.map((item) => item.image)
  );

  // Combinamos las imágenes principales con las del contenido relacionado
  const imagesToPreload = [...mainImages, ...relatedContentImages];

  // Función para precargar imágenes secuencialmente
  function preloadImages(images, callback) {
    let loadedImages = 0;

    function loadNextImage() {
      if (loadedImages >= images.length) {
        if (callback) callback(); // Llamada al callback cuando todas las imágenes están cargadas
        return;
      }

      const img = new Image();
      img.src = images[loadedImages];
      img.onload = () => {
        loadedImages++;
        loadNextImage(); // Carga la siguiente imagen cuando la actual se ha cargado
      };
    }

    loadNextImage();
  }

  // Inicia la precarga cuando el DOM esté listo
  preloadImages(imagesToPreload, () => {
    console.log("Todas las imágenes se han precargado.");
  });

  // -------------------------------------------------------
  // FIN DE LA SECCIÓN DE CÓDIGO PARA LA PRECARGA DE IMÁGENES
  // -------------------------------------------------------

  // Check if the page was loaded with the skipIntro parameter
  const urlParams = new URLSearchParams(window.location.search);
  introSkipped = urlParams.has("skipIntro");
  console.log("Initial introSkipped value:", introSkipped);

  function skipIntro() {
    console.log("skipIntro function called");
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
      console.log("Skipping intro, calling updateLayout");
      updateLayout();
    }
  }

  // Event listeners to skip the intro
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
    console.log("Starting playIntroAnimation, introSkipped:", introSkipped);
    if (introSkipped) {
      console.log("Intro skipped, updating layout immediately");
      centerLogo.style.opacity = "1";
      updateLayout();
      return;
    }

    console.log("Playing full intro animation");
    centerLogo.style.opacity = "0";
    await Promise.all([fadeIn(welcomeText, 1000), fadeIn(centerLogo, 1000)]);
    await new Promise((resolve) => setTimeout(resolve, 400));
    welcomeText.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, 400));
    await fadeIn(subText, 1000);
    await new Promise((resolve) => setTimeout(resolve, 400));
    subText.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log("Intro animation completed, updating layout");
    updateLayout();
  }

  function updateLayout() {
    console.log("updateLayout called, isInitialized:", isInitialized);
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

      if (!circle.hasAttribute("data-listeners-added")) {
        circle.addEventListener("mouseover", () => {
          const circleName = circle.getAttribute("data-name");
          welcomeText.textContent = circleName;
          welcomeText.style.opacity = "1";
        });

        circle.addEventListener("mouseleave", () => {
          welcomeText.style.opacity = "0";
        });

        circle.addEventListener("click", () =>
          handleCircleClick(circle, radius, circleSize)
        );

        circle.setAttribute("data-listeners-added", "true");
      }
    });

    if (!isInitialized) {
      console.log("Initializing circle positions");
      isInitialized = true;
      initializeCirclePositions(radius);
    }

    console.log("Setting circle opacities and starting animation");
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
    try {
      console.log("Circle clicked:", circle.getAttribute("data-name"));

      const clickedLogoName = circle.getAttribute("data-name");

      if (
        (isShowsCentered && clickedLogoName === "Shows") ||
        (isClasesCentered && clickedLogoName === "Clases") ||
        (isModaCentered && clickedLogoName === "Moda") ||
        (isFDICentered && clickedLogoName === "Fondo de Inversión") ||
        (isTallerCentered && clickedLogoName === "Taller") ||
        (isAppsCentered && clickedLogoName === "Apps")
      ) {
        // Reset the page if a centered circle is clicked again
        window.location.href = window.location.pathname + "?skipIntro=true";
        return;
      } else if (
        clickedLogoName === "Shows" ||
        clickedLogoName === "Clases" ||
        clickedLogoName === "Moda" ||
        clickedLogoName === "Fondo de Inversión" ||
        clickedLogoName === "Taller" ||
        clickedLogoName === "Apps"
      ) {
        stopAnimation();
        centeredCircle = circle;
        centeredCircle.style.transition = "transform 0.3s ease";
        centeredCircle.style.transform = `translate(0, 0) scale(1.5)`;

        if (clickedLogoName === "Shows") {
          showShowsIntro();
          isShowsCentered = true;
          isClasesCentered = isModaCentered = isFDICentered = false;
        } else if (clickedLogoName === "Clases") {
          showClasesIntro();
          isClasesCentered = true;
          isShowsCentered = isModaCentered = isFDICentered = false;
        } else if (clickedLogoName === "Moda") {
          showModaIntro();
          isModaCentered = true;
          isShowsCentered = isClasesCentered = isFDICentered = false;
        } else if (clickedLogoName === "Fondo de Inversión") {
          showFDIIntro();
          isFDICentered = true;
          isShowsCentered = isClasesCentered = isModaCentered = false;
        } else if (clickedLogoName === "Taller") {
          showTallerIntro();
          isTallerCentered = true;
          isShowsCentered =
            isClasesCentered =
            isModaCentered =
            isFDICentered =
              false;
        } else if (clickedLogoName === "Apps") {
          showAppsIntro();
          isAppsCentered = true;
          isShowsCentered =
            isClasesCentered =
            isModaCentered =
            isFDICentered =
            isTallerCentered =
              false;
        }

        redistributeCircles(radius, circleSize, true);
      } else if (centeredCircle === circle) {
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
          resetCircles();
          redistributeCircles(radius, circleSize, false);
          requestAnimationFrame(() => {
            circles.forEach((c) => (c.style.opacity = "1"));
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
    } catch (error) {
      console.error("Error in handleCircleClick:", error);
    }
  }

  function showShowsIntro() {
    stopAnimation();
    transitionCircleImages(relatedContent["Shows"]);
  }

  function showClasesIntro() {
    stopAnimation();
    transitionCircleImages(relatedContent["Clases"]);
  }

  function showModaIntro() {
    stopAnimation();
    transitionCircleImages(relatedContent["Moda"]);
  }

  function showFDIIntro() {
    stopAnimation();
    transitionCircleImages(relatedContent["Fondo de Inversión"]);
  }

  function showTallerIntro() {
    stopAnimation();
    transitionCircleImages(relatedContent["Taller"]);
  }

  function showAppsIntro() {
    stopAnimation();
    transitionCircleImages(relatedContent["Apps"]);
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
      { src: "./img/logo2.gif", alt: "Clases" },
      { src: "./img/logo3.gif", alt: "Moda" },
      { src: "./img/logo4.png", alt: "Apps" },
      { src: "./img/logo5.jpg", alt: "Taller" },
      { src: "./img/logo6.png", alt: "Fondo de Inversión" },
    ];

    circles.forEach((circle, index) => {
      if (index < originalLogos.length) {
        const logo = originalLogos[index];
        let img = circle.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          circlse.appendChild(img);
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

  // Start the animation sequence
  console.log("Starting intro sequence");
  playIntroAnimation().catch((error) => {
    console.error("Error during intro animation:", error);
  });

  // Código para manejar la redirección a la página en construcción
  const links = document.querySelectorAll(".circle a");

  links.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault(); // Evita que el enlace navegue inmediatamente

      try {
        const response = await fetch(link.href, { method: "HEAD" });
        if (response.ok) {
          // Si la página existe, redirige normalmente
          window.location.href = link.href;
        } else {
          // Si no existe la página, redirige a la página en construcción
          window.location.href = "/404.html";
        }
      } catch (error) {
        console.error("Error al verificar la página:", error);
        // Si hay un error de red, también redirige a la página en construcción
        window.location.href = "/404.html";
      }
    });
  });
});
