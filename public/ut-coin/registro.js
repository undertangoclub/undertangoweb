import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  runTransaction,
  setDoc,
  getDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC05s84tQfQbiJua0G0LHnQsZP76HqxMk4",
  authDomain: "undertango.firebaseapp.com",
  projectId: "undertango",
  storageBucket: "undertango.appspot.com",
  messagingSenderId: "21199358960",
  appId: "1:21199358960:web:6b751db7c333403057ab35",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

async function registrarUsuario(email, password, otrosDatos) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;
    const globalesRef = doc(db, "globales", "contadores");

    const result = await runTransaction(db, async (transaction) => {
      const globalesDoc = await transaction.get(globalesRef);

      if (!globalesDoc.exists()) {
        throw new Error("El documento de contadores globales no existe.");
      }

      let totalUsuariosRegistrados =
        globalesDoc.data().totalUsuariosRegistrados || 0;
      let totalCoinsDisponibles = globalesDoc.data().totalCoinsDisponibles || 0;

      totalUsuariosRegistrados += 1;
      let recompensa = Math.max(0, 100 - 10 * (totalUsuariosRegistrados - 1));

      if (totalCoinsDisponibles < recompensa) {
        throw new Error(
          "No hay suficientes monedas disponibles para otorgar la recompensa."
        );
      }

      transaction.update(globalesRef, {
        totalUsuariosRegistrados: increment(1),
        totalCoinsDisponibles: increment(-recompensa),
      });

      const userRef = doc(db, "usuarios", userId);
      const publicDataRef = doc(
        db,
        `usuarios/${userId}/publicData/perfilPublico`
      );

      transaction.set(userRef, {
        numeroRegistro: totalUsuariosRegistrados,
        undertangoCoins: recompensa,
        email: email,
        ...otrosDatos,
      });

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

    console.log("Usuario registrado exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw error;
  }
}

const welcomeMessage = document.getElementById("welcomeMessage");
const userInfoForm = document.getElementById("userInfoForm");
const currentPhotoContainer = document.getElementById("currentPhotoContainer");
const gameNameInput = document.getElementById("gameName");
const institutionInput = document.getElementById("institution");

let currentPhotoURL = "";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const displayName = user.displayName || user.email || "usuario";
    welcomeMessage.textContent = `¡Bienvenido, ${displayName}!`;

    try {
      const userId = user.uid;
      const userDocRef = doc(db, "usuarios", userId);
      const publicDataRef = doc(
        db,
        `usuarios/${userId}/publicData/perfilPublico`
      );

      const userDoc = await getDoc(userDocRef);
      const publicDataDoc = await getDoc(publicDataRef);

      if (publicDataDoc.exists()) {
        const publicData = publicDataDoc.data();
        gameNameInput.value = publicData.gameName || "";
        currentPhotoURL = publicData.photoURL || "";

        if (currentPhotoURL) {
          const img = document.createElement("img");
          img.src = currentPhotoURL;
          img.alt = "Foto de perfil actual";
          currentPhotoContainer.appendChild(img);
        }
      }

      if (userDoc.exists()) {
        const userData = userDoc.data();
        institutionInput.value = userData.institution || "";
      }

      if (gameNameInput.value && institutionInput.value) {
        alert("¡Ya estás inscripto, genial!");
        window.location.href = "juego.html";
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      alert("Hubo un error al cargar tus datos. Por favor, intenta de nuevo.");
    }

    userInfoForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const userId = user.uid;
        const gameName = gameNameInput.value;
        const institution = institutionInput.value;
        const profilePhotoInput = document.getElementById("profilePhoto");
        const profilePhoto = profilePhotoInput.files[0];

        let photoURL = currentPhotoURL;

        if (profilePhoto) {
          const storageRef = ref(storage, `profilePhotos/${userId}`);
          await uploadBytes(storageRef, profilePhoto);
          photoURL = await getDownloadURL(storageRef);
        }

        const result = await runTransaction(db, async (transaction) => {
          const userDocRef = doc(db, "usuarios", userId);
          const userDoc = await transaction.get(userDocRef);
          const globalesRef = doc(db, "globales", "contadores");
          const globalesDoc = await transaction.get(globalesRef);

          if (!globalesDoc.exists()) {
            throw new Error("El documento de contadores globales no existe!");
          }

          let undertangoCoins = 10;
          let isNewUser = false;

          if (!userDoc.exists()) {
            isNewUser = true;
            const globalesData = globalesDoc.data();
            const totalCoinsDisponibles =
              globalesData.totalCoinsDisponibles || 0;
            const totalUsuariosRegistrados =
              globalesData.totalUsuariosRegistrados || 0;

            undertangoCoins = Math.max(0, 100 - 10 * totalUsuariosRegistrados);

            if (totalCoinsDisponibles < undertangoCoins) {
              throw new Error(
                "No hay suficientes monedas disponibles para nuevos usuarios."
              );
            }

            transaction.update(globalesRef, {
              totalCoinsDisponibles: increment(-undertangoCoins),
              totalUsuariosRegistrados: increment(1),
            });
          } else {
            const userData = userDoc.data();
            undertangoCoins = userData.undertangoCoins || undertangoCoins;
          }

          transaction.set(
            userDocRef,
            {
              institution: institution,
              email: user.email,
              undertangoCoins: undertangoCoins,
            },
            { merge: true }
          );

          const publicDataRef = doc(
            db,
            `usuarios/${userId}/publicData/perfilPublico`
          );
          transaction.set(
            publicDataRef,
            {
              gameName: gameName,
              photoURL: photoURL,
              undertangoCoins: undertangoCoins,
            },
            { merge: true }
          );

          return { undertangoCoins, isNewUser };
        });

        console.log("Perfil de usuario actualizado con éxito:", result);

        localStorage.setItem("gameName", gameName);
        localStorage.setItem("institution", institution);
        localStorage.setItem("photoURL", photoURL);
        localStorage.setItem(
          "undertangoCoins",
          result.undertangoCoins.toString()
        );

        if (result.isNewUser) {
          alert(
            `¡Bienvenido! Has recibido ${result.undertangoCoins} UnderTango Coins como recompensa.`
          );
        } else {
          alert("Perfil actualizado con éxito.");
        }

        window.location.href = "juego.html";
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        alert(
          "Hubo un error al actualizar tu perfil. Por favor, intenta de nuevo."
        );
      }
    });
  } else {
    console.error("No se pudo obtener información del usuario.");
    alert("Error: No se pudo obtener información del usuario.");
    window.location.replace("registro.html");
  }
});

export { registrarUsuario };
