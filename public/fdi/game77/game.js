const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
  },
  backgroundColor: "#20232a",
};

const game = new Phaser.Game(config);

let currentLevel = 0;
let commander;
let lieutenants = [];
let orderText;
let nextButton;
let lieutenantOrders = [null, null];

// Añadir los botones de navegación al cargar el juego
window.onload = function () {
  createLevelNavigation();
};

function preload() {
  this.load.image("general", "knight_44.png");
  this.load.image("lieutenant", "teniente.png");
  this.load.image("flecha", "flecha.png");
}

function create() {
  createTitle.call(this);
  createLevelText.call(this);

  if (currentLevel === 0) {
    createLevel0.call(this);
  } else if (currentLevel === 1) {
    createLevel1.call(this);
  } else if (currentLevel === 2) {
    createLevel2.call(this);
  } else if (currentLevel === 3) {
    createLevel3.call(this);
  }
}

function createLevelNavigation() {
  const navContainer = document.createElement("div");
  navContainer.style.position = "fixed";
  navContainer.style.top = "50%";
  navContainer.style.right = "-150px";
  navContainer.style.transform = "translateY(-50%)";
  navContainer.style.zIndex = "1000";
  navContainer.style.display = "flex";
  navContainer.style.flexDirection = "column";
  navContainer.style.gap = "10px";
  navContainer.style.transition = "right 0.3s ease";

  const levels = [0, 1, 2, 3];

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

function createLevel0() {
  const welcomeText = this.add
    .text(
      400,
      175,
      '¡Bienvenido al juego de los generales bizantinos!\nEste es un comandante, él mismo puede dar dos tipos de órdenes:\n"avanzar" y "retirarse"',
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

function createLevel1() {
  const gameWidth = 800;
  const gameHeight = 600;

  this.add
    .text(gameWidth / 2, 50, "Juego de los Generales Bizantinos", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  this.add
    .text(gameWidth / 2, 100, "Nivel 1", {
      fontSize: "24px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

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

function createLevel2() {
  const welcomeText = this.add
    .text(400, 145, "Has ascendido a **General**.\n¡Intenta dar órdenes!", {
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
      .text(500, 350, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel3.call(this, "Retirarse"));

    commander.disableInteractive();
  }
}

function distributeOrdersLevel3(order) {
  const oppositeOrder = order === "Avanzar" ? "Retirarse" : "Avanzar";
  const traitorIndex = Math.floor(Math.random() * 2);

  lieutenantOrders[0] = order;
  lieutenantOrders[1] = order;
  lieutenantOrders[traitorIndex] = oppositeOrder;

  this.lieutenantStatusTexts[0].setText(lieutenantOrders[0]);
  this.lieutenantStatusTexts[1].setText(lieutenantOrders[1]);

  orderText.setText(`Orden "${order}" distribuida a los tenientes`);

  lieutenants[0].setInteractive();
  lieutenants[1].setInteractive();
}

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

function goToNextLevel() {
  currentLevel++;
  this.scene.restart();
}
