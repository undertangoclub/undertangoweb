// registro.js
// Función para registrar un nuevo usuario y actualizar contadores globales
function registrarUsuario(email, password, otrosDatos) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      const db = firebase.firestore();
      const globalesRef = db.collection("globales").doc("contadores");

      // Iniciar una transacción para actualizar contadores globales y registrar usuario
      return db
        .runTransaction((transaction) => {
          return transaction.get(globalesRef).then((globalesDoc) => {
            if (!globalesDoc.exists) {
              throw "El documento de contadores globales no existe.";
            }

            let totalUsuariosRegistrados =
              globalesDoc.data().totalUsuariosRegistrados;
            let totalCoinsDisponibles =
              globalesDoc.data().totalCoinsDisponibles;

            // Incrementar el contador de usuarios
            totalUsuariosRegistrados += 1;

            // Calcular la recompensa
            let recompensa = Math.max(
              0,
              100 - 10 * (totalUsuariosRegistrados - 1)
            );

            // Verificar que hay suficientes monedas disponibles
            if (totalCoinsDisponibles < recompensa) {
              throw "No hay suficientes monedas disponibles para otorgar la recompensa.";
            }

            // Actualizar los contadores globales
            transaction.update(globalesRef, {
              totalUsuariosRegistrados: totalUsuariosRegistrados,
              totalCoinsDisponibles: totalCoinsDisponibles - recompensa,
            });

            // Crear el perfil del usuario
            const userRef = db.collection("usuarios").doc(userId);
            transaction.set(userRef, {
              numeroRegistro: totalUsuariosRegistrados,
              undertangoCoins: recompensa,
              ...otrosDatos,
            });

            // Retornar los resultados
            return {
              numeroRegistro: totalUsuariosRegistrados,
              recompensa: recompensa,
              totalCoinsDisponibles: totalCoinsDisponibles - recompensa,
            };
          });
        })
        .then((result) => {
          // Mostrar los datos al usuario
          console.log(
            `¡Bienvenido! Eres el usuario número ${result.numeroRegistro}.`
          );
          console.log(`Has recibido ${result.recompensa} Undertango Coins.`);
          console.log(
            `Monedas disponibles en la plataforma: ${result.totalCoinsDisponibles}`
          );
        })
        .catch((error) => {
          console.error("Error en la transacción: ", error);
        });
    })
    .catch((error) => {
      console.error("Error al crear el usuario: ", error);
    });
}
