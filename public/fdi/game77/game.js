// Configuración del juego
const config = {
  type: Phaser.AUTO,
  parent: "game-container", // Especificamos el contenedor del juego
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
  },
  backgroundColor: "#20232a",
};

// Inicialización del juego
const game = new Phaser.Game(config);

// Variables globales
let currentLevel = 0;
let commander;
let lieutenants = [];
let orderText;
let nextButton;
let lieutenantOrders = [];
let traitorIndex;

// Variables auxiliares para los niveles
let lieutenantOrdersFromOthers = {}; // Para almacenar las órdenes recibidas de otros tenientes
let lieutenantDecisions = []; // Para almacenar las decisiones finales de los tenientes
let level4Attempts = 0; // Contador de intentos en el Nivel 4
let failedLines = []; // Para simular fallos en las líneas de comunicación
let level5Rounds = 0; // Contador de rondas en el Nivel 5

let backgroundMusic; // Variable global para la música de fondo

function preload() {
  this.load.image("general", "knight_44.png");
  this.load.image("lieutenant", "teniente.png");
  this.load.image("flecha", "flecha.png");
  this.load.audio("background-music", "rsapaper.mp3");
  this.load.image("logo1", "bartes.jpeg");
  this.load.image("logo2", "ONG-Bitcoin-Argentina.png");
  this.load.image("logo3", "under.png");
}

function create() {
  // Verificamos si debemos mostrar la pantalla final
  if (this.scene.settings.data && this.scene.settings.data.showFinalScreen) {
    showFinalScreen.call(this);
    return;
  }

  // Reproducir música si está habilitado y no se está reproduciendo ya
  const audioEnabled = localStorage.getItem("audioEnabled") === "true";
  if (audioEnabled) {
    if (!backgroundMusic) {
      backgroundMusic = this.sound.add("background-music", { loop: true });
      backgroundMusic.play();
    }
  }

  createTitle.call(this);
  createLevelText.call(this);

  // Lógica específica de cada nivel
  if (currentLevel === 0) {
    createLevel0.call(this);
  } else if (currentLevel === 1) {
    createLevel1.call(this);
  } else if (currentLevel === 2) {
    createLevel2.call(this);
  } else if (currentLevel === 3) {
    createLevel3.call(this);
  } else if (currentLevel === 4) {
    createLevel4.call(this);
  } else if (currentLevel === 5) {
    createLevel5.call(this);
  }

  // Asegurar que los botones de navegación siempre estén disponibles
  createLevelNavigation.call(this);
}

function createLevelNavigation() {
  // Eliminamos cualquier navegador existente
  const existingNav = document.getElementById("level-nav");
  if (existingNav) {
    existingNav.remove();
  }

  const navContainer = document.createElement("div");
  navContainer.id = "level-nav"; // Asignamos un ID para facilitar su manejo
  navContainer.style.position = "fixed";
  navContainer.style.top = "50%";
  navContainer.style.right = "-150px";
  navContainer.style.transform = "translateY(-50%)";
  navContainer.style.zIndex = "1000";
  navContainer.style.display = "flex";
  navContainer.style.flexDirection = "column";
  navContainer.style.gap = "10px";
  navContainer.style.transition = "right 0.3s ease";

  const levels = [0, 1, 2, 3, 4, 5];

  levels.forEach((level) => {
    const button = document.createElement("button");
    button.innerText = `Nivel ${level}`;
    button.style.padding = "10px";
    button.style.backgroundColor = "#4a6785";
    button.style.color = "#ffffff";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.fontFamily = "Arial, sans-serif";
    button.style.fontSize = "14px";
    button.addEventListener("click", () => {
      currentLevel = level;
      level4Attempts = 0;
      level5Rounds = 0;
      lieutenantOrders = [];
      lieutenantOrdersFromOthers = {};
      lieutenantDecisions = [];
      failedLines = [];
      game.scene.getScene("default").scene.restart();
    });
    navContainer.appendChild(button);
  });

  document.body.appendChild(navContainer);

  document.body.addEventListener("mousemove", (e) => {
    if (e.clientX > window.innerWidth - 50) {
      navContainer.style.right = "0px";
    } else {
      navContainer.style.right = "-150px";
    }
  });
}

function createTitle() {
  this.add
    .text(400, 50, "Juego de los Generales Bizantinos", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);
}

function createLevelText() {
  this.add
    .text(400, 100, `Nivel ${currentLevel}`, {
      fontSize: "24px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);
}

// Nivel 0: Introducción
function createLevel0() {
  const welcomeText = this.add
    .text(
      400,
      175,
      '¡Bienvenido al juego de los generales bizantinos!\nEste es un comandante, él mismo puede dar dos tipos de órdenes:\n"Avanzar" y "Retirarse"',
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        lineSpacing: 10,
        wordWrap: { width: 600 },
      }
    )
    .setOrigin(0.5);

  this.add
    .text(400, 250, "Comandante", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  commander = this.add
    .image(400, 360, "general")
    .setScale(0.3)
    .setInteractive();
  commander.on("pointerdown", showOrderOptions.bind(this));

  orderText = this.add
    .text(400, 500, "Haz clic sobre el comandante para dar una orden", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
}

// Nivel 1: Comandante y Teniente
function createLevel1() {
  const gameWidth = 800;
  const gameHeight = 600;

  const instructionsText = this.add
    .text(
      gameWidth / 2,
      150,
      "Este es un teniente, el mismo puede recibir una orden\nque luego puede replicar. ¡Intenta darle una orden!",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
      }
    )
    .setOrigin(0.5);

  this.add
    .text(gameWidth / 3, 205, "Comandante", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  commander = this.add
    .image(gameWidth / 3, 300, "general")
    .setScale(0.3)
    .setInteractive();
  commander.on("pointerdown", showOrderOptions.bind(this));

  this.add
    .text((2 * gameWidth) / 3, 215, "Teniente", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  lieutenants[0] = this.add
    .image((2 * gameWidth) / 3, 300, "lieutenant")
    .setScale(0.3)
    .setInteractive();
  lieutenants[0].on("pointerdown", () => checkLieutenantOrder.call(this, 0));

  this.lieutenantStatusText = this.add
    .text((2 * gameWidth) / 3, 380, "Sin órdenes", {
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  orderText = this.add
    .text(
      gameWidth / 2,
      500,
      "Haz clic sobre el comandante para dar una orden",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
      }
    )
    .setOrigin(0.5);

  const flecha = this.add.image(
    gameWidth / 2,
    instructionsText.y + 80,
    "flecha"
  );
  flecha.setScale(0.3);
  flecha.setRotation(Phaser.Math.DegToRad(0));
}

// Nivel 2: Comandante y dos Tenientes
function createLevel2() {
  const welcomeText = this.add
    .text(400, 145, "Has ascendido a General.\n¡Intenta dar órdenes!", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 600 },
    })
    .setOrigin(0.5);

  this.add
    .text(400, 180, "Comandante", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  commander = this.add
    .image(400, 250, "general")
    .setScale(0.2)
    .setInteractive();
  commander.on("pointerdown", showOrderOptions.bind(this));

  this.add
    .text(200, 300, "Teniente 1", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  lieutenants[0] = this.add.image(200, 350, "lieutenant").setScale(0.2);

  this.add
    .text(600, 300, "Teniente 2", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  lieutenants[1] = this.add.image(600, 350, "lieutenant").setScale(0.2);

  this.lieutenantStatusTexts = [
    this.add
      .text(200, 400, "Sin órdenes", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      })
      .setOrigin(0.5),
    this.add
      .text(600, 400, "Sin órdenes", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      })
      .setOrigin(0.5),
  ];

  orderText = this.add
    .text(400, 450, "Haz clic sobre el comandante para dar una orden", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
}

// Nivel 3: Introducción de un Traidor
function createLevel3() {
  const welcomeText = this.add
    .text(400, 145, "Nivel 3: ¡Cuidado con los traidores!", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 600 },
    })
    .setOrigin(0.5);

  this.add
    .text(400, 180, "Comandante", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  commander = this.add
    .image(400, 250, "general")
    .setScale(0.2)
    .setInteractive();
  commander.on("pointerdown", showOrderOptions.bind(this));

  this.add
    .text(200, 300, "Teniente 1", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  lieutenants[0] = this.add
    .image(200, 350, "lieutenant")
    .setScale(0.2)
    .setInteractive();
  lieutenants[0].on("pointerdown", () => checkLieutenantOrder.call(this, 0));

  this.add
    .text(600, 300, "Teniente 2", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  lieutenants[1] = this.add
    .image(600, 350, "lieutenant")
    .setScale(0.2)
    .setInteractive();
  lieutenants[1].on("pointerdown", () => checkLieutenantOrder.call(this, 1));

  this.lieutenantStatusTexts = [
    this.add
      .text(200, 400, "Sin órdenes", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      })
      .setOrigin(0.5),
    this.add
      .text(600, 400, "Sin órdenes", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      })
      .setOrigin(0.5),
  ];

  orderText = this.add
    .text(400, 450, "Haz clic sobre el comandante para dar una orden", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
}

// Nivel 4: Consenso con 4 Generales
function createLevel4() {
  const gameWidth = 800;
  const gameHeight = 600;

  this.add
    .text(gameWidth / 2, 140, "Nivel 4: Consenso con 4 Generales", {
      fontSize: "22px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);

  const instructionsText = this.add
    .text(
      gameWidth / 2,
      180,
      "Comunícate y utiliza la función de mayoría para llegar a un consenso.",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 700 },
      }
    )
    .setOrigin(0.5);

  const commanderPosition = { x: gameWidth / 2, y: 260 };
  const lieutenantPositions = [
    { x: gameWidth / 4, y: 400 },
    { x: gameWidth / 2, y: 400 },
    { x: (3 * gameWidth) / 4, y: 400 },
  ];

  this.add
    .text(commanderPosition.x, commanderPosition.y - 60, "Comandante", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  commander = this.add
    .image(commanderPosition.x, commanderPosition.y, "general")
    .setScale(0.2)
    .setInteractive();
  commander.on("pointerdown", showOrderOptions.bind(this));

  lieutenants = [];
  lieutenantOrders = [];
  lieutenantDecisions = [];
  lieutenantOrdersFromOthers = {};

  this.lieutenantStatusTexts = [];

  for (let i = 0; i < 3; i++) {
    this.add
      .text(
        lieutenantPositions[i].x,
        lieutenantPositions[i].y - 60,
        `Teniente ${i + 1}`,
        {
          fontSize: "18px",
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const lieutenant = this.add
      .image(lieutenantPositions[i].x, lieutenantPositions[i].y, "lieutenant")
      .setScale(0.2)
      .setInteractive();
    lieutenant.on("pointerdown", () => {
      checkLieutenantOrderLevel4.call(this, i);
    });

    lieutenants.push(lieutenant);

    const statusText = this.add
      .text(
        lieutenantPositions[i].x,
        lieutenantPositions[i].y + 60,
        "Esperando orden",
        {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);
    this.lieutenantStatusTexts.push(statusText);
  }

  orderText = this.add
    .text(
      gameWidth / 2,
      500,
      "Haz clic sobre el comandante para dar una orden",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
      }
    )
    .setOrigin(0.5);

  const possibleTraitors = [0, 1, 2];
  traitorIndex = Phaser.Utils.Array.GetRandom(possibleTraitors);
}

// Nivel 5: Mensajes Firmados y Fallos en las Líneas
function createLevel5() {
  const gameWidth = this.scale.width;
  const gameHeight = this.scale.height;

  // Eliminamos elementos previos
  this.children.removeAll();

  // Añadimos el título principal
  this.add
    .text(gameWidth / 2, 50, "Juego de los Generales Bizantinos", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  // Añadimos la descripción del nivel
  const instructionsText = this.add
    .text(
      gameWidth / 2,
      120,
      "Nivel 5: Mensajes Firmados y Fallos en las Líneas\n\nLas líneas de comunicación pueden fallar.\nUsa mensajes firmados para asegurar la comunicación.",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 700 },
      }
    )
    .setOrigin(0.5);

  // Posicionamos al comandante
  const commanderPosition = { x: gameWidth / 2, y: 250 };

  // Ajustamos las posiciones de los tenientes
  const lieutenantPositions = [
    { x: gameWidth / 4, y: 400 },
    { x: gameWidth / 2, y: 450 }, // Teniente medio más abajo
    { x: (3 * gameWidth) / 4, y: 400 },
  ];

  this.add
    .text(commanderPosition.x, commanderPosition.y - 60, "Comandante", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  commander = this.add
    .image(commanderPosition.x, commanderPosition.y, "general")
    .setScale(0.2)
    .setInteractive();
  commander.on("pointerdown", showOrderOptions.bind(this));

  lieutenants = [];
  lieutenantOrders = [];
  lieutenantDecisions = [];
  lieutenantOrdersFromOthers = {};

  this.lieutenantStatusTexts = [];

  for (let i = 0; i < 3; i++) {
    this.add
      .text(
        lieutenantPositions[i].x,
        lieutenantPositions[i].y - 40,
        `Teniente ${i + 1}`,
        {
          fontSize: "18px",
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const lieutenant = this.add
      .image(lieutenantPositions[i].x, lieutenantPositions[i].y, "lieutenant")
      .setScale(0.2)
      .setInteractive();
    lieutenant.on("pointerdown", () => {
      checkLieutenantOrderLevel5.call(this, i);
    });

    lieutenants.push(lieutenant);

    const statusText = this.add
      .text(
        lieutenantPositions[i].x,
        lieutenantPositions[i].y + 40,
        "Esperando orden",
        {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);
    this.lieutenantStatusTexts.push(statusText);
  }

  orderText = this.add
    .text(
      gameWidth / 2,
      550,
      "Haz clic sobre el comandante para dar una orden",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
      }
    )
    .setOrigin(0.5);

  const possibleTraitors = ["commander", 0, 1, 2];
  traitorIndex = Phaser.Utils.Array.GetRandom(possibleTraitors);

  failedLines = [];
  for (let i = 0; i < 3; i++) {
    if (Phaser.Math.Between(1, 5) === 1) {
      // 20% de probabilidad de fallo
      failedLines.push(i);
    }
  }
}

// Mostrar opciones de órdenes
function showOrderOptions() {
  const buttonStyle = {
    fontSize: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#4a4a4a",
    padding: {
      left: 10,
      right: 10,
      top: 5,
      bottom: 5,
    },
  };

  if (currentLevel === 0) {
    const advanceButton = this.add
      .text(300, 450, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => giveOrder.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(400, 450, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => giveOrder.call(this, "Retirarse"));

    commander.disableInteractive();
  } else if (currentLevel === 1) {
    const advanceButton = this.add
      .text(175, 385, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => selectRecipient.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(275, 385, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => selectRecipient.call(this, "Retirarse"));

    commander.disableInteractive();
  } else if (currentLevel === 2) {
    const advanceButton = this.add
      .text(300, 350, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrders.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(400, 350, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrders.call(this, "Retirarse"));

    commander.disableInteractive();
  } else if (currentLevel === 3) {
    const advanceButton = this.add
      .text(300, 350, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel3.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(400, 350, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel3.call(this, "Retirarse"));

    commander.disableInteractive();
  } else if (currentLevel === 4) {
    const advanceButton = this.add
      .text(300, 350, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel4.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(400, 350, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel4.call(this, "Retirarse"));

    commander.disableInteractive();
  } else if (currentLevel === 5) {
    const advanceButton = this.add
      .text(300, 310, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel5.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(400, 310, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel5.call(this, "Retirarse"));
    commander.disableInteractive();
  }
}

// Nivel 1: Seleccionar destinatario de la orden
function selectRecipient(order) {
  orderText.setText(`Haz clic en el teniente para dar la orden: ${order}`);

  lieutenants[0].setInteractive();
  lieutenants[0].on("pointerdown", () => {
    giveOrderToLieutenant.call(this, order);
  });
}

// Nivel 1: Dar orden al teniente
function giveOrderToLieutenant(order) {
  this.lieutenantStatusText.setText(order);
  orderText.setText(`Orden "${order}" dada al teniente`);
  lieutenants[0].disableInteractive();

  commander.setInteractive();

  const nextLevelButton = this.add
    .text(400, 550, "Siguiente Nivel", {
      fontSize: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#4a4a4a",
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {
      currentLevel = 2;
      this.scene.restart();
    });
}

// Nivel 2: Distribuir órdenes a los tenientes
function distributeOrders(order) {
  lieutenantOrders[0] = order;
  lieutenantOrders[1] = order;

  this.lieutenantStatusTexts[0].setText(order);
  this.lieutenantStatusTexts[1].setText(order);

  orderText.setText(`Orden "${order}" distribuida a los tenientes`);

  const nextLevelButton = this.add
    .text(400, 550, "Siguiente Nivel", {
      fontSize: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#4a4a4a",
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {
      currentLevel = 3;
      this.scene.restart();
    });
}

// Nivel 3: Distribuir órdenes con un traidor
function distributeOrdersLevel3(order) {
  const oppositeOrder = order === "Avanzar" ? "Retirarse" : "Avanzar";
  traitorIndex = 1;

  lieutenantOrders[0] = order;
  lieutenantOrders[1] = oppositeOrder;

  this.lieutenantStatusTexts[0].setText(lieutenantOrders[0]);
  this.lieutenantStatusTexts[1].setText(lieutenantOrders[1]);

  orderText.setText(`Orden "${order}" distribuida a los tenientes`);

  lieutenants[0].setInteractive();
  lieutenants[1].setInteractive();
}

// Nivel 4: Distribuir órdenes y lograr consenso
function distributeOrdersLevel4(order) {
  const oppositeOrder = order === "Avanzar" ? "Retirarse" : "Avanzar";

  lieutenantOrders = lieutenants.map(() => order);

  if (traitorIndex !== undefined) {
    lieutenantOrders[traitorIndex] = oppositeOrder;
  }

  orderText.setText(`Las órdenes han sido enviadas a los tenientes.`);

  lieutenants.forEach((lt) => lt.setInteractive());
}

// Nivel 5: Distribuir órdenes firmadas con posibles fallos en las líneas
function distributeOrdersLevel5(order) {
  const oppositeOrder = order === "Avanzar" ? "Retirarse" : "Avanzar";

  const commanderSignature = `FirmaComandante(${order})`;

  if (traitorIndex === "commander") {
    // El comandante traidor envía órdenes incorrectas con firmas válidas
    lieutenantOrders = lieutenants.map(() => ({
      order: oppositeOrder,
      signature: `FirmaComandante(${oppositeOrder})`,
    }));
  } else {
    lieutenantOrders = lieutenants.map(() => ({
      order: order,
      signature: commanderSignature,
    }));
  }

  orderText.setText(`Las órdenes firmadas han sido enviadas a los tenientes.`);

  lieutenants.forEach((lt) => lt.setInteractive());
}

// Verificar orden recibida por los tenientes en el Nivel 3
function checkLieutenantOrder(index) {
  if (lieutenantOrders[index]) {
    this.lieutenantStatusTexts[index].setText(lieutenantOrders[index]);

    if (index === traitorIndex) {
      const dialogBox = this.add.rectangle(400, 300, 600, 200, 0x000000, 0.8);
      const dialogText = this.add
        .text(
          400,
          300,
          "El teniente dice: \n\n¡Yo no tengo la culpa, el comandante me dio esa orden!",
          {
            fontSize: "18px",
            fontFamily: "Arial, sans-serif",
            color: "#ffffff",
            align: "center",
            wordWrap: { width: 550 },
          }
        )
        .setOrigin(0.5);

      const continueText = this.add
        .text(400, 380, "Haz clic para continuar", {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      const clickHandler = () => {
        dialogBox.destroy();
        dialogText.destroy();
        continueText.destroy();
        this.input.off("pointerdown", clickHandler);
        showAccusationDialog.call(this);
      };

      this.time.delayedCall(100, () => {
        this.input.once("pointerdown", clickHandler);
      });
    } else {
      orderText.setText(
        `El teniente ${index + 1} ha recibido la orden: ${
          lieutenantOrders[index]
        }`
      );
    }
  } else {
    orderText.setText(`El teniente ${index + 1} aún no ha recibido órdenes`);
  }
}

// Verificar orden y tomar decisiones en el Nivel 4
function checkLieutenantOrderLevel4(index) {
  if (!lieutenantOrders[index]) {
    orderText.setText(`El teniente ${index + 1} aún no ha recibido órdenes.`);
    return;
  }

  this.lieutenantStatusTexts[index].setText(
    `Orden recibida: ${lieutenantOrders[index]}`
  );

  if (traitorIndex !== index) {
    const otherLieutenants = [0, 1, 2].filter((i) => i !== index);
    otherLieutenants.forEach((i) => {
      if (!lieutenantOrdersFromOthers[i]) {
        lieutenantOrdersFromOthers[i] = {};
      }
      lieutenantOrdersFromOthers[i][index] = lieutenantOrders[index];
    });
  } else {
    const oppositeOrder =
      lieutenantOrders[index] === "Avanzar" ? "Retirarse" : "Avanzar";
    const otherLieutenants = [0, 1, 2].filter((i) => i !== index);
    otherLieutenants.forEach((i) => {
      if (!lieutenantOrdersFromOthers[i]) {
        lieutenantOrdersFromOthers[i] = {};
      }
      lieutenantOrdersFromOthers[i][index] = oppositeOrder;
    });
  }

  if (Object.keys(lieutenantOrdersFromOthers[index] || {}).length === 2) {
    makeDecisionLevel4.call(this, index);
  }
}

// Verificar orden y tomar decisiones en el Nivel 5
function checkLieutenantOrderLevel5(index) {
  if (!lieutenantOrders[index]) {
    orderText.setText(`El teniente ${index + 1} aún no ha recibido órdenes.`);
    return;
  }

  this.time.delayedCall(Phaser.Math.Between(500, 2000), () => {
    if (failedLines.includes(index)) {
      this.lieutenantStatusTexts[index].setText("No se recibió ninguna orden.");
      orderText.setText(`La línea al teniente ${index + 1} ha fallado.`);

      // Asumir una orden por defecto
      this.lieutenantStatusTexts[index].setText("Orden por defecto: Retirarse");
      lieutenantDecisions[index] = "Retirarse";
    } else {
      const receivedMessage = lieutenantOrders[index];
      const expectedSignature = `FirmaComandante(${receivedMessage.order})`;

      if (receivedMessage.signature !== expectedSignature) {
        this.lieutenantStatusTexts[index].setText(
          "Firma inválida. Mensaje rechazado."
        );
        orderText.setText(
          `El teniente ${
            index + 1
          } ha detectado una firma inválida y rechazó el mensaje.`
        );

        // Asumir una orden por defecto
        this.lieutenantStatusTexts[index].setText(
          "Orden por defecto: Retirarse"
        );
        lieutenantDecisions[index] = "Retirarse";
      } else {
        this.lieutenantStatusTexts[index].setText(
          `Orden recibida: ${receivedMessage.order}`
        );
        orderText.setText(
          `El teniente ${index + 1} ha recibido una orden válida.`
        );
        lieutenantDecisions[index] = receivedMessage.order;
      }
    }

    // Una vez que todos los tenientes hayan tomado una decisión
    if (lieutenantDecisions.filter((d) => d !== undefined).length === 3) {
      verifyConsensusLevel5.call(this);
    }
  });
}

// Tomar decisiones en el Nivel 4
function makeDecisionLevel4(index) {
  const ownOrder = lieutenantOrders[index];
  const receivedOrders = lieutenantOrdersFromOthers[index];

  const votes = [
    ownOrder,
    receivedOrders[Object.keys(receivedOrders)[0]],
    receivedOrders[Object.keys(receivedOrders)[1]],
  ];

  if (traitorIndex !== undefined) {
    const traitorIndexStr = traitorIndex.toString();
    delete receivedOrders[traitorIndexStr];
  }

  const filteredVotes = [ownOrder];
  for (const key in receivedOrders) {
    filteredVotes.push(receivedOrders[key]);
  }

  const decision = majorityVote(filteredVotes);

  lieutenantDecisions[index] = decision;

  this.lieutenantStatusTexts[index].setText(`Decisión: ${decision}`);

  orderText.setText(`El teniente ${index + 1} ha tomado su decisión.`);

  if (lieutenantDecisions.filter((d) => d !== undefined).length === 3) {
    verifyConsensus.call(this);
  }
}

// Verificar consenso en el Nivel 4
function verifyConsensus() {
  const decisionSet = new Set(
    lieutenantDecisions.filter((d) => d !== undefined)
  );

  if (decisionSet.size === 1) {
    orderText.setText(
      `¡Consenso alcanzado! Todos los tenientes decidieron: ${lieutenantDecisions[0]}`
    );
  } else {
    orderText.setText(
      `No se alcanzó el consenso. Las decisiones fueron: ${lieutenantDecisions.join(
        ", "
      )}`
    );
  }

  level4Attempts++;

  let buttonText = "Reiniciar Nivel";

  if (level4Attempts >= 3) {
    buttonText = "Siguiente Nivel";
  }

  const nextLevelButton = this.add
    .text(400, 550, buttonText, {
      fontSize: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#4a4a4a",
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {
      if (level4Attempts >= 3) {
        currentLevel = 5;
        level4Attempts = 0;
      }
      this.scene.restart();
    });
}

// Verificar consenso en el Nivel 5
function verifyConsensusLevel5() {
  const decisionSet = new Set(
    lieutenantDecisions.filter((d) => d !== undefined)
  );

  if (decisionSet.size === 1) {
    orderText.setText(
      `¡Consenso alcanzado! Todos los tenientes decidieron: ${lieutenantDecisions[0]}`
    );
  } else {
    orderText.setText(
      `No se alcanzó el consenso. Las decisiones fueron: ${lieutenantDecisions.join(
        ", "
      )}`
    );
  }

  level5Rounds++;

  if (level5Rounds >= 3) {
    this.time.delayedCall(2000, showFinalScreen.bind(this));
  } else {
    const retryButton = this.add
      .text(400, 500, "Intentar de nuevo", {
        fontSize: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#4a6785",
        padding: {
          left: 20,
          right: 20,
          top: 10,
          bottom: 10,
        },
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.restart();
      });
  }
}

// Función de mayoría
function majorityVote(votes) {
  const count = {};
  votes.forEach((vote) => {
    count[vote] = (count[vote] || 0) + 1;
  });
  let majority = votes[0];
  let maxCount = 0;
  for (const vote in count) {
    if (count[vote] > maxCount) {
      maxCount = count[vote];
      majority = vote;
    }
  }
  return majority;
}

// Mostrar diálogo de acusación en el Nivel 3
function showAccusationDialog() {
  const dialogBox = this.add.rectangle(400, 300, 600, 200, 0x000000, 0.8);
  const dialogText = this.add
    .text(
      400,
      300,
      "El comandante dice: \n\n¡Calumnias! ¡El teniente es un traidor!",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 550 },
      }
    )
    .setOrigin(0.5);

  const nextLevelButton = this.add
    .text(400, 400, "Resolvamos el asunto en el siguiente nivel", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#4a4a4a",
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {
      dialogBox.destroy();
      dialogText.destroy();
      nextLevelButton.destroy();
      currentLevel++;
      this.scene.restart();
    });
}

// Dar orden en el Nivel 0
function giveOrder(order) {
  orderText.setText(`¡Felicitaciones! Has dado tu primera orden: ${order}`);

  let timer;
  let clickEnabled = false;

  const showNextText = () => {
    if (!clickEnabled) return;

    if (timer) this.time.removeEvent(timer);
    orderText
      .setText(
        "No obstante, ¿qué sentido tiene dar una orden si no hay nadie para oírla?\n¡Vamos al nivel 1!"
      )
      .setWordWrapWidth(600)
      .setAlign("center");

    orderText.setY(520);

    nextButton = this.add
      .text(400, 570, "Siguiente Nivel", {
        fontSize: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#4a4a4a",
        padding: {
          left: 10,
          right: 10,
          top: 5,
          bottom: 5,
        },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", goToNextLevel.bind(this));

    this.input.off("pointerdown", showNextText);
    this.input.keyboard.off("keydown-SPACE", showNextText);
  };

  this.time.delayedCall(100, () => {
    clickEnabled = true;
  });

  timer = this.time.delayedCall(2000, showNextText);

  this.input.on("pointerdown", showNextText);
  this.input.keyboard.on("keydown-SPACE", showNextText);
}

// Ir al siguiente nivel
function goToNextLevel() {
  currentLevel++;
  this.scene.restart();
}

function showFinalScreen() {
  // Limpiar la pantalla
  this.children.removeAll();

  // Añadir fondo
  this.add.rectangle(400, 300, 800, 600, 0x20232a);

  // Añadir título
  this.add
    .text(400, 80, "Juego de los Generales Bizantinos", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  // Añadir mensaje de agradecimiento
  const endingText = this.add
    .text(
      400,
      180,
      "Muchas gracias por haber jugado el Juego de los Generales Bizantinos.\n\nEsperamos que este breve juego sume a tu curiosidad por el fantástico mundo de la criptografía.",
      {
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 700 },
        lineSpacing: 10,
      }
    )
    .setOrigin(0.5);

  // Añadir información del concurso
  const finalText = this.add
    .text(
      400,
      320,
      "Este juego se enmarca en el concurso del premio B·Artes organizado por la ONG Bitcoin Argentina para difundir el principio de -Verificar vs Confiar-",
      {
        fontSize: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 700 },
        lineSpacing: 10,
      }
    )
    .setOrigin(0.5);

  // Añadir botón para volver al inicio
  const backButton = this.add
    .text(400, 450, "Volver al Inicio", {
      fontSize: "24px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#4a6785",
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10,
      },
      color: "#ffffff",
    })
    .setOrigin(0.5)
    .setInteractive()
    .on("pointerdown", () => {
      currentLevel = 0;
      this.scene.restart();
    });

  // Añadir logos
  const logoScale = 0.5;
  const logoY = 550;
  const logo1 = this.add.image(200, logoY, "logo1").setScale(logoScale);
  const logo2 = this.add.image(400, logoY, "logo2").setScale(logoScale);
  const logo3 = this.add.image(600, logoY, "logo3").setScale(logoScale);
}
