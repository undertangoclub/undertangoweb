// Configuración inicial de Phaser
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#282c34",
  parent: "game-container",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Variables globales
let nodes = []; // Lista de nodos
let playerTurn = true; // Controla el turno del jugador

const game = new Phaser.Game(config);

// Carga de recursos si es necesario
function preload() {
  this.load.image("node", "node.png"); // Imagen para el nodo
}

// Crear el tablero y los nodos
function create() {
  const cols = 5;
  const rows = 4;
  const nodeSize = 40;
  const offsetX = (config.width - cols * nodeSize) / 2;
  const offsetY = (config.height - rows * nodeSize) / 2;

  // Crear nodos en una cuadrícula
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const nodeX = offsetX + i * nodeSize;
      const nodeY = offsetY + j * nodeSize;
      const node = this.add.image(nodeX, nodeY, "node").setInteractive();
      node.status = "safe"; // Todos los nodos empiezan como seguros
      node.on("pointerdown", () => verifyNode(node));
      nodes.push(node);
    }
  }

  // Texto de instrucciones
  this.add.text(10, 10, "Haz clic en los nodos para verificar su estado", {
    fontSize: "16px",
    fill: "#fff",
  });
}

// Función para verificar nodos
function verifyNode(node) {
  if (playerTurn) {
    // Simular una verificación con una probabilidad de éxito
    const verificationSuccess = Math.random() > 0.3;

    if (verificationSuccess) {
      node.setTint(0x00ff00); // Verde si es seguro
      node.status = "verified";
      console.log("Nodo verificado correctamente.");
    } else {
      node.setTint(0xff0000); // Rojo si falla la verificación
      node.status = "compromised";
      console.log("Falló la verificación del nodo.");
    }

    playerTurn = false;
    // Iniciar el turno del rival (aún no implementado)
    setTimeout(() => {
      playerTurn = true;
    }, 1000);
  }
}

// Actualización en cada frame (si es necesario)
function update() {
  // Aquí se pueden implementar futuras actualizaciones en tiempo real
}
