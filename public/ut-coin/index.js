// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPOqsSOWg8M9KWohuzZH7N-tr_NF_2mLew",
  authDomain: "ut-coin.firebaseapp.com",
  projectId: "ut-coin",
  storageBucket: "ut-coin.appspot.com",
  messagingSenderId: "628936536007",
  appId: "1:628936536007:web:88176e0bc957ac5f9e73e2",
  measurementId: "G-DRPDJVSD26",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Función para comenzar la aventura
function comenzarAventura() {
  if (confirm("¡Tu aventura está por comenzar! ¿Deseas continuar?")) {
    window.location.href = "/ut-coin/pages/intro.html";
  }
}

// Agregar el evento click al botón cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const adventureBtn = document.getElementById("adventure-btn");
  adventureBtn.addEventListener("click", comenzarAventura);
});
