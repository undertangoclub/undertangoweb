const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

console.log("Inicio del script googleSheets.js");

// Cargar el archivo de credenciales JSON descargado de Google Cloud
const auth = new GoogleAuth({
  keyFile: "./fdi-undertango-e79f5b9b8985.json", // Ruta relativa al archivo JSON
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

console.log("Credenciales cargadas correctamente");

async function appendDataToSheet() {
  try {
    console.log("Autenticando al cliente...");
    // Obtener el cliente autenticado
    const authClient = await auth.getClient();
    console.log("Cliente autenticado con éxito");

    const sheets = google.sheets({ version: "v4", auth: authClient });

    // ID de tu Google Sheets (lo puedes obtener de la URL del Google Sheet)
    const spreadsheetId = "TU_ID_DE_HOJA_DE_GOOGLE_SHEET";

    console.log("Preparando los datos para añadir al Google Sheet");

    // Datos a añadir a la hoja (categoría, nombre, fecha, cantidad)
    const values = [
      ["Categoría Ejemplo", "Ingreso de Ejemplo", "2024-11-08", 5000],
    ];

    // Definir la solicitud para añadir datos a la hoja
    const request = {
      spreadsheetId,
      range: "Sheet1!A:D", // Cambia el rango según la hoja y columnas donde quieres los datos
      valueInputOption: "RAW",
      resource: {
        values,
      },
    };

    console.log("Enviando datos a Google Sheets...");
    // Llamada a la API de Google Sheets para añadir los datos
    const response = await sheets.spreadsheets.values.append(request);
    console.log(
      `Añadido a Google Sheets con éxito: ${response.data.updates.updatedCells} celdas actualizadas.`
    );
  } catch (error) {
    console.error("Error al añadir datos a Google Sheets:", error);
  }
}

// Llamar a la función para añadir los datos
appendDataToSheet();
