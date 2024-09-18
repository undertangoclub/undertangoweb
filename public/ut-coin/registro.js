function registrarUsuario(email, password, otrosDatos) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      const db = firebase.firestore();
      const globalesRef = db.collection("globales").doc("contadores");

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

            totalUsuariosRegistrados += 1;
            let recompensa = Math.max(
              0,
              100 - 10 * (totalUsuariosRegistrados - 1)
            );

            if (totalCoinsDisponibles < recompensa) {
              throw "No hay suficientes monedas disponibles para otorgar la recompensa.";
            }

            transaction.update(globalesRef, {
              totalUsuariosRegistrados: totalUsuariosRegistrados,
              totalCoinsDisponibles: totalCoinsDisponibles - recompensa,
            });

            const userRef = db.collection("usuarios").doc(userId);
            const publicDataRef = db
              .collection("usuarios")
              .doc(userId)
              .collection("publicData")
              .doc("perfilPublico");

            // Crear el perfil privado del usuario
            transaction.set(userRef, {
              numeroRegistro: totalUsuariosRegistrados,
              undertangoCoins: recompensa,
              email: email,
              ...otrosDatos,
            });

            // Crear el perfil público del usuario
            transaction.set(publicDataRef, {
              gameName: otrosDatos.gameName || "Usuario Anónimo",
              undertangoCoins: recompensa,
              photoURL: otrosDatos.photoURL || null,
            });

            return {
              numeroRegistro: totalUsuariosRegistrados,
              recompensa: recompensa,
              totalCoinsDisponibles: totalCoinsDisponibles - recompensa,
            };
          });
        })
        .then((result) => {
          console.log(
            `¡Bienvenido! Eres el usuario número ${result.numeroRegistro}.`
          );
          console.log(`Has recibido ${result.recompensa} Undertango Coins.`);
          console.log(
            `Monedas disponibles en la plataforma: ${result.totalCoinsDisponibles}`
          );
          console.log("Perfil de usuario creado con éxito.");
        })
        .catch((error) => {
          console.error("Error en la transacción: ", error);
        });
    })
    .catch((error) => {
      console.error("Error al crear el usuario: ", error);
    });
}
