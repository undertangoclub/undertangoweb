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

function preload() {
  this.load.image("general", "knight_44.png");
  this.load.image("lieutenant", "teniente.png");
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
  }
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
    .text(400, 100, `Nivel ${currentLevel + 1}`, {
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
      150,
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

  commander = this.add
    .image(400, 300, "general")
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
  const welcomeText = this.add
    .text(
      400,
      150,
      "Este es un teniente, el mismo puede recibir una orden\nque luego puede replicar. ¡Intenta darle una orden!",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 600 },
      }
    )
    .setOrigin(0.5);

  commander = this.add
    .image(300, 300, "general")
    .setScale(0.3)
    .setInteractive();
  commander.on("pointerdown", showOrderOptions.bind(this));

  lieutenants[0] = this.add
    .image(500, 300, "lieutenant")
    .setScale(0.3)
    .setInteractive();
  lieutenants[0].on("pointerdown", () => checkLieutenantOrder.call(this, 0));

  orderText = this.add
    .text(400, 450, "Haz clic sobre el comandante para dar una orden", {
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
}

function createLevel2() {
  const welcomeText = this.add
    .text(
      400,
      150,
      "En este nivel hay un comandante y dos tenientes.\n¡Intenta dar órdenes!",
      {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 600 },
      }
    )
    .setOrigin(0.5);

  commander = this.add
    .image(400, 300, "general")
    .setScale(0.2)
    .setInteractive();
  commander.on("pointerdown", showOrderOptions.bind(this));

  lieutenants[0] = this.add
    .image(200, 400, "lieutenant")
    .setScale(0.2)
    .setInteractive();
  lieutenants[0].on("pointerdown", () => checkLieutenantOrder.call(this, 0));

  lieutenants[1] = this.add
    .image(600, 400, "lieutenant")
    .setScale(0.2)
    .setInteractive();
  lieutenants[1].on("pointerdown", () => checkLieutenantOrder.call(this, 1));

  lieutenantOrders[1] = "Retirarse";

  orderText = this.add
    .text(400, 500, "Haz clic sobre el comandante para dar una orden", {
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
      .text(250, 430, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => giveOrder.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(450, 430, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => giveOrder.call(this, "Retirarse"));

    commander.disableInteractive();
  } else if (currentLevel === 1) {
    const advanceButton = this.add
      .text(200, 400, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => selectRecipient.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(400, 400, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => selectRecipient.call(this, "Retirarse"));

    commander.disableInteractive();
  } else if (currentLevel === 2) {
    const advanceButton = this.add
      .text(300, 550, "Avanzar", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => selectRecipient.call(this, "Avanzar"));

    const retreatButton = this.add
      .text(500, 550, "Retirarse", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => selectRecipient.call(this, "Retirarse"));

    commander.disableInteractive();
  }
}

function giveOrder(order) {
  orderText.setText(`¡Felicitaciones! Has dado tu primera orden: ${order}`);

  this.time.delayedCall(2000, () => {
    orderText
      .setText(
        "No obstante, ¿qué sentido tiene dar una orden si no hay nadie para oírla?\n¡Vamos al nivel 2!"
      )
      .setWordWrapWidth(600)
      .setAlign("center");

    nextButton = this.add
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
      .on("pointerdown", goToNextLevel.bind(this));
  });
}

function selectRecipient(order) {
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

  if (currentLevel === 1) {
    const recipientButton = this.add
      .text(600, 400, "Teniente 1", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => sendOrder.call(this, order, 0));

    orderText.setText("¿A quién?");
  } else if (currentLevel === 2) {
    const lieutenant1Button = this.add
      .text(200, 550, "Teniente 1", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => sendOrder.call(this, order, 0));

    const lieutenant2Button = this.add
      .text(400, 550, "Teniente 2", buttonStyle)
      .setInteractive()
      .on("pointerdown", () => sendOrder.call(this, order, 1));

    orderText.setText("¿A quién?");
  }
}

function sendOrder(order, lieutenantIndex) {
  lieutenantOrders[lieutenantIndex] = order;
  orderText.setText(
    `Orden "${order}" enviada al Teniente ${lieutenantIndex + 1}`
  );
  commander.setInteractive();
}

function checkLieutenantOrder(lieutenantIndex) {
  if (currentLevel === 1) {
    if (lieutenantOrders[lieutenantIndex] === null) {
      orderText.setText("Este teniente no tiene órdenes");
    } else {
      orderText.setText(
        `¡Felicitaciones! Has dado tu primera orden y fue recibida correctamente: ${lieutenantOrders[lieutenantIndex]}\n¡Pasemos al nivel 3!`
      );

      this.time.delayedCall(2000, () => {
        nextButton = this.add
          .text(400, 500, "Siguiente Nivel", {
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
      });
    }
  } else if (currentLevel === 2) {
    if (lieutenantOrders[lieutenantIndex] === null) {
      orderText.setText(`El Teniente ${lieutenantIndex + 1} no tiene órdenes`);
    } else if (
      lieutenantIndex === 1 &&
      lieutenantOrders[1] !== lieutenantOrders[0]
    ) {
      orderText.setText(
        "¡Oh! Este teniente tiene una orden contradictoria a la del comandante.\n¡Santas mandarinas saltarinas! ¡Un traidor!"
      );

      this.time.delayedCall(2000, () => {
        const dialogBox = this.add.rectangle(400, 300, 600, 200, 0x4a4a4a, 0.8);
        const dialogText = this.add
          .text(
            400,
            300,
            "¡No me peguen, soy Giordano!\nUn comandante me pasó esa orden.\nEn el nivel 4 puedo explicarlo, ¡se los aseguro!",
            {
              fontSize: "18px",
              fontFamily: "Arial, sans-serif",
              color: "#ffffff",
              align: "center",
              wordWrap: { width: 550 },
            }
          )
          .setOrigin(0.5);

        this.time.delayedCall(4000, () => {
          dialogBox.destroy();
          dialogText.destroy();
          nextButton = this.add
            .text(400, 500, "Siguiente Nivel", {
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
        });
      });
    } else {
      orderText.setText(
        `El Teniente ${lieutenantIndex + 1} recibió la orden: ${
          lieutenantOrders[lieutenantIndex]
        }`
      );
    }
  }
}

function goToNextLevel() {
  currentLevel++;
  this.scene.restart();
}
