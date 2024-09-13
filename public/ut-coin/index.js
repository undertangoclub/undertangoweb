/**
 * The above JavaScript code initializes Firebase, prompts the user to start an adventure, and
 * redirects to an intro page upon confirmation.
 */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC05s84tQfQbiJua0G0LHnQsZP76HqxMk4",
  authDomain: "undertango.firebaseapp.com",
  projectId: "undertango",
  storageBucket: "undertango.appspot.com",
  messagingSenderId: "21199358960",
  appId: "1:21199358960:web:6b751db7c333403057ab35",
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
