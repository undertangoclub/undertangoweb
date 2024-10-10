// Game configuration
const config = {
  type: Phaser.AUTO,
  parent: "game-container", // Specify the game container
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
  },
  backgroundColor: "#20232a",
};

// Game initialization
const game = new Phaser.Game(config);

// Global variables
let currentLevel = 0;
let commander;
let lieutenants = [];
let orderText;
let nextButton;
let lieutenantOrders = [];
let traitorIndex;

// Auxiliary variables for levels
let lieutenantOrdersFromOthers = {}; // To store orders received from other lieutenants
let lieutenantDecisions = []; // To store final decisions of lieutenants
let level4Attempts = 0; // Counter for attempts in Level 4
let failedLines = []; // To simulate failures in communication lines
let level5Rounds = 0; // Counter for rounds in Level 5

let backgroundMusic; // Global variable for background music

function preload() {
  this.load.image("general", "knight_44.png");
  this.load.image("lieutenant", "teniente.png");
  this.load.image("arrow", "flecha.png");
  this.load.audio("background-music", "rsapaper.mp3");
  this.load.image("logo1", "bartes.jpeg");
  this.load.image("logo2", "ONG-Bitcoin-Argentina.png");
  this.load.image("logo3", "under.png");
}

function create() {
  // Check if we should show the final screen
  if (this.scene.settings.data && this.scene.settings.data.showFinalScreen) {
    showFinalScreen.call(this);
    return;
  }

  // Play music if enabled and not already playing
  const audioEnabled = localStorage.getItem("audioEnabled") === "true";
  if (audioEnabled) {
    if (!backgroundMusic) {
      backgroundMusic = this.sound.add("background-music", { loop: true });
      backgroundMusic.play();
    }
  }

  createTitle.call(this);
  createLevelText.call(this);

  // Level-specific logic
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

  // Ensure navigation buttons are always available
  createLevelNavigation.call(this);
}

function createLevelNavigation() {
  // Remove any existing navigator
  const existingNav = document.getElementById("level-nav");
  if (existingNav) {
    existingNav.remove();
  }

  const navContainer = document.createElement("div");
  navContainer.id = "level-nav"; // Assign an ID for easy handling
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
    button.innerText = `Level ${level}`;
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
    .text(400, 50, "Byzantine Generals Game", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);
}

function createLevelText() {
  this.add
    .text(400, 100, `Level ${currentLevel}`, {
      fontSize: "24px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);
}

// Level 0: Introduction
function createLevel0() {
  const welcomeText = this.add
    .text(
      400,
      175,
      'Welcome to the Byzantine Generals game!\nThis is a commander, he can give two types of orders:\n"Advance" and "Retreat"',
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
    .text(400, 250, "Commander", {
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
    .text(400, 500, "Click on the commander to give an order", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
}

// Level 1: Commander and Lieutenant
function createLevel1() {
  const gameWidth = 800;
  const gameHeight = 600;

  const instructionsText = this.add
    .text(
      gameWidth / 2,
      150,
      "This is a lieutenant, he can receive an order\nwhich he can then replicate. Try giving him an order!",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
      }
    )
    .setOrigin(0.5);

  this.add
    .text(gameWidth / 3, 205, "Commander", {
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
    .text((2 * gameWidth) / 3, 215, "Lieutenant", {
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
    .text((2 * gameWidth) / 3, 380, "No orders", {
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  orderText = this.add
    .text(gameWidth / 2, 500, "Click on the commander to give an order", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);

  const arrow = this.add.image(gameWidth / 2, instructionsText.y + 80, "arrow");
  arrow.setScale(0.3);
  arrow.setRotation(Phaser.Math.DegToRad(0));
}

// Level 2: Commander and two Lieutenants
function createLevel2() {
  const welcomeText = this.add
    .text(400, 145, "You've been promoted to General.\nTry giving orders!", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 600 },
    })
    .setOrigin(0.5);

  this.add
    .text(400, 180, "Commander", {
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
    .text(200, 300, "Lieutenant 1", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  lieutenants[0] = this.add.image(200, 350, "lieutenant").setScale(0.2);

  this.add
    .text(600, 300, "Lieutenant 2", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  lieutenants[1] = this.add.image(600, 350, "lieutenant").setScale(0.2);

  this.lieutenantStatusTexts = [
    this.add
      .text(200, 400, "No orders", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      })
      .setOrigin(0.5),
    this.add
      .text(600, 400, "No orders", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      })
      .setOrigin(0.5),
  ];

  orderText = this.add
    .text(400, 450, "Click on the commander to give an order", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
}

// Level 3: Introduction of a Traitor
function createLevel3() {
  const welcomeText = this.add
    .text(400, 145, "Level 3: Beware of traitors!", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 600 },
    })
    .setOrigin(0.5);

  this.add
    .text(400, 180, "Commander", {
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
    .text(200, 300, "Lieutenant 1", {
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
    .text(600, 300, "Lieutenant 2", {
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
      .text(200, 400, "No orders", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      })
      .setOrigin(0.5),
    this.add
      .text(600, 400, "No orders", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      })
      .setOrigin(0.5),
  ];

  orderText = this.add
    .text(400, 450, "Click on the commander to give an order", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
}

// Level 4: Consensus with 4 Generals
function createLevel4() {
  const gameWidth = 800;
  const gameHeight = 600;

  this.add
    .text(gameWidth / 2, 140, "Level 4: Consensus with 4 Generals", {
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
      "Communicate and use the majority function to  reach a consensus.",
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
    .text(commanderPosition.x, commanderPosition.y - 60, "Commander", {
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
        `Lieutenant ${i + 1}`,
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
        "Waiting for order",
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
    .text(gameWidth / 2, 500, "Click on the commander to give an order", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);

  const possibleTraitors = [0, 1, 2];
  traitorIndex = Phaser.Utils.Array.GetRandom(possibleTraitors);
}

// Level 5: Signed Messages and Line Failures
function createLevel5() {
  const gameWidth = this.scale.width;
  const gameHeight = this.scale.height;

  // Remove previous elements
  this.children.removeAll();

  // Add main title
  this.add
    .text(gameWidth / 2, 50, "Byzantine Generals Game", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  // Add level description
  const instructionsText = this.add
    .text(
      gameWidth / 2,
      120,
      "Level 5: Signed Messages and Line Failures\n\nCommunication lines may fail.\nUse signed messages to ensure communication.",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 700 },
      }
    )
    .setOrigin(0.5);

  // Position the commander
  const commanderPosition = { x: gameWidth / 2, y: 250 };

  // Adjust lieutenant positions
  const lieutenantPositions = [
    { x: gameWidth / 4, y: 400 },
    { x: gameWidth / 2, y: 450 }, // Middle lieutenant lower
    { x: (3 * gameWidth) / 4, y: 400 },
  ];

  this.add
    .text(commanderPosition.x, commanderPosition.y - 60, "Commander", {
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
        `Lieutenant ${i + 1}`,
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
        "Waiting for order",
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
    .text(gameWidth / 2, 550, "Click on the commander to give an order", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);

  const possibleTraitors = ["commander", 0, 1, 2];
  traitorIndex = Phaser.Utils.Array.GetRandom(possibleTraitors);

  failedLines = [];
  for (let i = 0; i < 3; i++) {
    if (Phaser.Math.Between(0, 1) === 0) {
      failedLines.push(i);
    }
  }
}

// Show order options
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
      .text(300, 450, "Advance", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => giveOrder.call(this, "Advance"));

    const retreatButton = this.add
      .text(400, 450, "Retreat", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => giveOrder.call(this, "Retreat"));

    commander.disableInteractive();
  } else if (currentLevel === 1) {
    const advanceButton = this.add
      .text(175, 385, "Advance", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => selectRecipient.call(this, "Advance"));

    const retreatButton = this.add
      .text(275, 385, "Retreat", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => selectRecipient.call(this, "Retreat"));

    commander.disableInteractive();
  } else if (currentLevel === 2) {
    const advanceButton = this.add
      .text(300, 350, "Advance", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrders.call(this, "Advance"));

    const retreatButton = this.add
      .text(400, 350, "Retreat", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrders.call(this, "Retreat"));

    commander.disableInteractive();
  } else if (currentLevel === 3) {
    const advanceButton = this.add
      .text(300, 350, "Advance", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel3.call(this, "Advance"));

    const retreatButton = this.add
      .text(400, 350, "Retreat", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel3.call(this, "Retreat"));

    commander.disableInteractive();
  } else if (currentLevel === 4) {
    const advanceButton = this.add
      .text(300, 350, "Advance", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel4.call(this, "Advance"));

    const retreatButton = this.add
      .text(400, 350, "Retreat", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel4.call(this, "Retreat"));

    commander.disableInteractive();
  } else if (currentLevel === 5) {
    const advanceButton = this.add
      .text(300, 310, "Advance", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel5.call(this, "Advance"));

    const retreatButton = this.add
      .text(400, 310, "Retreat", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => distributeOrdersLevel5.call(this, "Retreat"));
    commander.disableInteractive();
  }
}

// Level 1: Select order recipient
function selectRecipient(order) {
  orderText.setText(`Click on the lieutenant to give the order: ${order}`);

  lieutenants[0].setInteractive();
  lieutenants[0].on("pointerdown", () => {
    giveOrderToLieutenant.call(this, order);
  });
}

// Level 1: Give order to lieutenant
function giveOrderToLieutenant(order) {
  this.lieutenantStatusText.setText(order);
  orderText.setText(`Order "${order}" given to the lieutenant`);
  lieutenants[0].disableInteractive();

  commander.setInteractive();

  const nextLevelButton = this.add
    .text(400, 550, "Next Level", {
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

// Level 2: Distribute orders to lieutenants
function distributeOrders(order) {
  lieutenantOrders[0] = order;
  lieutenantOrders[1] = order;

  this.lieutenantStatusTexts[0].setText(order);
  this.lieutenantStatusTexts[1].setText(order);

  orderText.setText(`Order "${order}" distributed to the lieutenants`);

  const nextLevelButton = this.add
    .text(400, 550, "Next Level", {
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

// Level 3: Distribute orders with a traitor
function distributeOrdersLevel3(order) {
  const oppositeOrder = order === "Advance" ? "Retreat" : "Advance";
  traitorIndex = 1;

  lieutenantOrders[0] = order;
  lieutenantOrders[1] = oppositeOrder;

  this.lieutenantStatusTexts[0].setText(lieutenantOrders[0]);
  this.lieutenantStatusTexts[1].setText(lieutenantOrders[1]);

  orderText.setText(`Order "${order}" distributed to the lieutenants`);

  lieutenants[0].setInteractive();
  lieutenants[1].setInteractive();
}

// Level 4: Distribute orders and achieve consensus
function distributeOrdersLevel4(order) {
  const oppositeOrder = order === "Advance" ? "Retreat" : "Advance";

  lieutenantOrders = lieutenants.map(() => order);

  if (traitorIndex !== undefined) {
    lieutenantOrders[traitorIndex] = oppositeOrder;
  }

  orderText.setText(`Orders have been sent to the lieutenants.`);

  lieutenants.forEach((lt) => lt.setInteractive());
}

// Level 5: Distribute signed orders with possible line failures
function distributeOrdersLevel5(order) {
  const oppositeOrder = order === "Advance" ? "Retreat" : "Advance";

  const commanderSignature = `CommanderSignature(${order})`;

  if (traitorIndex === "commander") {
    lieutenantOrders = lieutenants.map(() => {
      const fakeOrder = Phaser.Utils.Array.GetRandom([order, oppositeOrder]);
      return {
        order: fakeOrder,
        signature: `FakeSignature(${fakeOrder})`,
      };
    });
  } else {
    lieutenantOrders = lieutenants.map(() => ({
      order: order,
      signature: commanderSignature,
    }));
  }

  orderText.setText(`Signed orders have been sent to the lieutenants.`);

  lieutenants.forEach((lt) => lt.setInteractive());
}

// Check order received by lieutenants in Level 3
function checkLieutenantOrder(index) {
  if (lieutenantOrders[index]) {
    this.lieutenantStatusTexts[index].setText(lieutenantOrders[index]);

    if (index === traitorIndex) {
      const dialogBox = this.add.rectangle(400, 300, 600, 200, 0x000000, 0.8);
      const dialogText = this.add
        .text(
          400,
          300,
          "The lieutenant says: \n\nIt's not my fault, the commander gave me that order!",
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
        .text(400, 380, "Click to continue", {
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
        `Lieutenant ${index + 1} has received the order: ${
          lieutenantOrders[index]
        }`
      );
    }
  } else {
    orderText.setText(`Lieutenant ${index + 1} hasn't received orders yet`);
  }
}

// Check order and make decisions in Level 4
function checkLieutenantOrderLevel4(index) {
  if (!lieutenantOrders[index]) {
    orderText.setText(`Lieutenant ${index + 1} hasn't received orders yet.`);
    return;
  }

  this.lieutenantStatusTexts[index].setText(
    `Order received: ${lieutenantOrders[index]}`
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
      lieutenantOrders[index] === "Advance" ? "Retreat" : "Advance";
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

// Check order and make decisions in Level 5
function checkLieutenantOrderLevel5(index) {
  if (!lieutenantOrders[index]) {
    orderText.setText(`Lieutenant ${index + 1} hasn't received orders yet.`);
    return;
  }

  this.time.delayedCall(Phaser.Math.Between(500, 2000), () => {
    if (failedLines.includes(index)) {
      this.lieutenantStatusTexts[index].setText("No order received.");
      orderText.setText(`The line to lieutenant ${index + 1} has failed.`);

      this.lieutenantStatusTexts[index].setText("Default order: Advance");
      lieutenantDecisions[index] = "Advance";
    } else {
      const receivedMessage = lieutenantOrders[index];
      const expectedSignature = `CommanderSignature(${receivedMessage.order})`;

      if (receivedMessage.signature !== expectedSignature) {
        this.lieutenantStatusTexts[index].setText(
          "Invalid signature. Message rejected."
        );
        orderText.setText(
          `Lieutenant ${
            index + 1
          } has detected an invalid signature and rejected the message.`
        );

        this.lieutenantStatusTexts[index].setText("Default order: Advance");
        lieutenantDecisions[index] = "Advance";
      } else {
        this.lieutenantStatusTexts[index].setText(
          `Order received: ${receivedMessage.order}`
        );
        orderText.setText(
          `Lieutenant ${index + 1} has received a valid order.`
        );
        lieutenantDecisions[index] = receivedMessage.order;
      }
    }

    if (lieutenantDecisions.filter((d) => d !== undefined).length === 3) {
      verifyConsensusLevel5.call(this);
    }
  });
}

// Make decisions in Level 4
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

  this.lieutenantStatusTexts[index].setText(`Decision: ${decision}`);

  orderText.setText(`Lieutenant ${index + 1} has made their decision.`);

  if (lieutenantDecisions.filter((d) => d !== undefined).length === 3) {
    verifyConsensus.call(this);
  }
}

// Verify consensus in Level 4
function verifyConsensus() {
  const decisionSet = new Set(
    lieutenantDecisions.filter((d) => d !== undefined)
  );

  if (decisionSet.size === 1) {
    orderText.setText(
      `Consensus reached! All lieutenants decided: ${lieutenantDecisions[0]}`
    );
  } else {
    orderText.setText(
      `Consensus not reached. The decisions were: ${lieutenantDecisions.join(
        ", "
      )}`
    );
  }

  level4Attempts++;

  let buttonText = "Restart Level";

  if (level4Attempts >= 3) {
    buttonText = "Next Level";
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

// Verify consensus in Level 5
function verifyConsensusLevel5() {
  const decisionSet = new Set(
    lieutenantDecisions.filter((d) => d !== undefined)
  );

  if (decisionSet.size === 1) {
    orderText.setText(
      `Consensus reached! All lieutenants decided: ${lieutenantDecisions[0]}`
    );
  } else {
    orderText.setText(
      `Consensus not reached. The decisions were: ${lieutenantDecisions.join(
        ", "
      )}`
    );
  }

  level5Rounds++;

  if (level5Rounds >= 3) {
    this.time.delayedCall(2000, showFinalScreen.bind(this));
  } else {
    this.time.delayedCall(2000, () => {
      this.scene.restart();
    });
  }
}

// Majority vote function
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

// Show accusation dialog in Level 3
function showAccusationDialog() {
  const dialogBox = this.add.rectangle(400, 300, 600, 200, 0x000000, 0.8);
  const dialogText = this.add
    .text(
      400,
      300,
      "The commander says: \n\nSlander! The lieutenant is a traitor!",
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
    .text(400, 400, "Let's resolve this in the next level", {
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

// Give order in Level 0
function giveOrder(order) {
  orderText.setText(`Congratulations! You've given your first order: ${order}`);

  let timer;
  let clickEnabled = false;

  const showNextText = () => {
    if (!clickEnabled) return;

    if (timer) this.time.removeEvent(timer);
    orderText
      .setText(
        "However, what's the point of giving an order if there's no one to hear it?\nLet's go to level 1!"
      )
      .setWordWrapWidth(600)
      .setAlign("center");

    orderText.setY(520);

    nextButton = this.add
      .text(400, 570, "Next Level", {
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

// Go to next level
function goToNextLevel() {
  currentLevel++;
  this.scene.restart();
}

function showFinalScreen() {
  // Clear the screen
  this.children.removeAll();

  // Add background
  this.add.rectangle(400, 300, 800, 600, 0x20232a);

  // Add title
  this.add
    .text(400, 80, "Byzantine Generals Game", {
      fontSize: "32px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  // Add thank you message
  const endingText = this.add
    .text(
      400,
      180,
      "Thank you very much for playing the Byzantine Generals Game.\n\nWe hope this brief game adds to your curiosity about the fantastic world of cryptography.",
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

  // Add contest information
  const finalText = this.add
    .text(
      400,
      320,
      "This game is part of the B·Artes award contest organized by the ONG Bitcoin Argentina to spread the principle of -Verify vs Trust-",
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

  // Add button to return to start
  const backButton = this.add
    .text(400, 450, "Back to Start", {
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

  // Add logos
  const logoScale = 0.5;
  const logoY = 550;
  const logo1 = this.add.image(200, logoY, "logo1").setScale(logoScale);
  const logo2 = this.add.image(400, logoY, "logo2").setScale(logoScale);
  const logo3 = this.add.image(600, logoY, "logo3").setScale(logoScale);
}
