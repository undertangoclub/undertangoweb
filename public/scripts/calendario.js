// Constantes y configuración inicial
const AIRTABLE_TOKEN = "patuKKtlyfqvVNCpc.25468d0bda6badcfd90c84a03a681fc462c0b66b57b964eddb0449b24134a45e";
const BASE_ID = "appPGVN4sDJ0aTrSb";
const TABLE_NAME = "calendario";

let editMode = false;
const weekMap = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

let currentMonth = 0;

function createCalendarDays(calendarGrid, year, month) {
  calendarGrid.innerHTML = ''; // Limpia el contenido previo

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startingDay = firstDay.getDay();
  startingDay = (startingDay + 6) % 7; // Ajuste para que el domingo sea el último

  // Días vacíos al inicio del mes
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "day empty";
    calendarGrid.appendChild(emptyDay);
  }

  // Días del mes
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;

    const addEventBlock = document.createElement("div");
    addEventBlock.className = "event add-event";
    addEventBlock.textContent = "+ Agregar evento";
    addEventBlock.addEventListener("click", () => promptNewEvent(dayElement));

    dayElement.appendChild(dayNumber);
    dayElement.appendChild(addEventBlock);
    calendarGrid.appendChild(dayElement);
  }
}


function setMonth(monthIndex) {
  currentMonth = monthIndex;
  const calendarGrid = document.getElementById("calendar-grid");
  const monthTitle = document.getElementById("month-title");
  const year = 2025;

  console.log(`Cambiando a mes: ${monthIndex + 1}, año: ${year}`);
  monthTitle.textContent = `${monthNames[monthIndex]} ${year}`;
  createCalendarDays(calendarGrid, year, monthIndex);
  loadEvents(year, monthIndex);
}

async function loadEvents(year, month) {
  try {
    let allRecords = [];
    let offset = null;
    
    do {
      const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?sort%5B0%5D%5Bfield%5D=fecha&sort%5B1%5D%5Bfield%5D=hora${offset ? '&offset=' + offset : ''}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      allRecords = [...allRecords, ...data.records];
      offset = data.offset;
    } while (offset);

    const monthStr = String(month + 1).padStart(2, '0');
    const monthPattern = `${year}-${monthStr}`;
    
    const filteredRecords = allRecords.filter(record => 
      record.fields.fecha.startsWith(monthPattern)
    );

    displayEvents(filteredRecords);
  } catch (error) {
    console.error("Error cargando eventos:", error);
  }
}
/**
 * Muestra los eventos en el calendario
 */
function displayEvents(records) {
  records.forEach((record) => {
    const { fecha, hora, lugar, interprete } = record.fields;
    if (!fecha || !hora) {
      console.warn("Registro ignorado por falta de fecha u hora:", record);
      return;
    }

    const dayElement = document.querySelector(`.day[data-date="${fecha}"]`);
    if (!dayElement) {
      console.warn("No se encontró día para el registro:", record);
      return;
    }

    const eventElement = document.createElement("div");
    eventElement.className = "event";

    const horaElement = document.createElement("div");
    horaElement.className = "hora";
    horaElement.textContent = hora;

    const lugarElement = document.createElement("div");
    lugarElement.className = "lugar";
    lugarElement.textContent = lugar || "Sin lugar";

    const interpreteElement = document.createElement("div");
    interpreteElement.className = "interprete";
    if (Array.isArray(interprete)) {
      interpreteElement.textContent = interprete.join(", ");
    } else {
      interpreteElement.textContent = interprete || "Sin intérprete";
    }

    eventElement.appendChild(horaElement);
    eventElement.appendChild(lugarElement);
    eventElement.appendChild(interpreteElement);

    aplicarEstilos(eventElement, horaElement, lugarElement, interpreteElement);

    if (editMode) {
      eventElement.addEventListener("click", () => {
        editEvent(record.id, { fecha, hora, lugar, interprete });
      });
    }

    const addBlock = dayElement.querySelector(".add-event");
    if (addBlock) {
      dayElement.insertBefore(eventElement, addBlock);
    } else {
      dayElement.appendChild(eventElement);
    }
  });
}

/**
 * Aplica estilos de color según lugar, intérprete y hora
 */
function aplicarEstilos(eventElement, horaEl, lugarEl, interpreteEl) {
  // LUGAR
  const lugarTexto = lugarEl.textContent?.trim().toLowerCase();
  if (lugarTexto === "cruceros") {
    lugarEl.style.backgroundColor = "#2084d7";
    lugarEl.style.color = "black";
  } else if (lugarTexto === "casa malbec") {
    lugarEl.style.backgroundColor = "#771613";
    lugarEl.style.color = "#b6b6b6";
  } else if (lugarTexto === "meliá") {
    lugarEl.style.backgroundColor = "yellow";
    lugarEl.style.color = "black";
  } else if (lugarTexto === "dam-cde") {
    lugarEl.style.backgroundColor = "white";
    lugarEl.style.color = "black";
  } else if (lugarTexto === "ensayo") {
    lugarEl.style.backgroundColor = "green";
    lugarEl.style.color = "black";
  } else if (lugarTexto === "cruceros nocturno") {
    lugarEl.style.backgroundColor = "#3e56ef";
    lugarEl.style.color = "white";
  } else if (lugarTexto === "reunión marketing") {
    lugarEl.style.backgroundColor = "violet";
    lugarEl.style.color = "black";
  }

  // INTÉRPRETE
  const interpreteTexto = interpreteEl.textContent?.trim();
  const interpretesArray = interpreteTexto
    .split(",")
    .map((i) => i.trim().toLowerCase());

  interpretesArray.forEach((it) => {
    if (it === "byp") {
      interpreteEl.style.backgroundColor = "#c24444";
      interpreteEl.style.color = "white";
    } else if (it === "tym") {
      interpreteEl.style.backgroundColor = "darkblue";
      interpreteEl.style.color = "white";
    } else if (it === "yyd") {
      interpreteEl.style.backgroundColor = "#267713";
      interpreteEl.style.color = "white";
    } else if (it === "team-6") {
      interpreteEl.style.backgroundColor = "green";
      interpreteEl.style.color = "black";
    } else if (it === "bypys") {
      interpreteEl.style.backgroundColor = "orange";
      interpreteEl.style.color = "black";
    } else if (it === "reunión marketing") {
      interpreteEl.style.backgroundColor = "violet";
      interpreteEl.style.color = "black";
    }
  });

  // HORA
  const horaTexto = horaEl.textContent?.trim();
  if (horaTexto) {
    const partes = horaTexto.split(":");
    const h = parseInt(partes[0], 10) || 0;
    if (h < 17) {
      horaEl.style.backgroundColor = "#b36155";
      horaEl.style.color = "#000";
    } else {
      horaEl.style.backgroundColor = "#5a382f";
      horaEl.style.color = "#ffd700";
    }
  }
}



/**
 * Obtiene la lista de lugares desde Airtable
 */
async function obtenerOpcionesLugares() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
      {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener lugares: ${response.status}`);
    }

    const data = await response.json();
    const lugaresSet = new Set();

    data.records.forEach((record) => {
      const campoLugar = record.fields.lugar;
      if (campoLugar && typeof campoLugar === "string") {
        lugaresSet.add(campoLugar);
      }
    });

    return Array.from(lugaresSet);
  } catch (error) {
    console.error("Error al obtener lugares:", error);
    return [];
  }
}

/**
 * Obtiene la lista de intérpretes desde Airtable
 */
async function obtenerOpcionesInterpretes() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
      {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener intérpretes: ${response.status}`);
    }

    const data = await response.json();
    const interpretesSet = new Set();

    data.records.forEach((record) => {
      const campoInterprete = record.fields.interprete;
      if (campoInterprete) {
        if (Array.isArray(campoInterprete)) {
          campoInterprete.forEach((item) => interpretesSet.add(item));
        } else {
          interpretesSet.add(campoInterprete);
        }
      }
    });

    return Array.from(interpretesSet);
  } catch (error) {
    console.error("Error al obtener intérpretes:", error);
    return [];
  }
}

/**
 * Crea botones para la hora
 */
function crearBotonesHora() {
  const container = document.createElement("div");

  const title = document.createElement("h4");
  title.textContent = "Seleccionar Hora:";
  title.style.margin = "4px 0";
  title.style.color = "#fff";
  container.appendChild(title);

  const horasDiv = document.createElement("div");
  horasDiv.style.display = "flex";
  horasDiv.style.flexWrap = "wrap";
  horasDiv.style.gap = "4px";

  let horaSeleccionada = "08";
  let minSeleccionado = "00";

  for (let h = 8; h <= 23; h++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = h.toString().padStart(2, "0");
    btn.style.padding = "5px 8px";
    btn.style.marginBottom = "5px";

    btn.addEventListener("click", () => {
      horaSeleccionada = h.toString().padStart(2, "0");
      actualizarEstilosBotones(horasDiv, btn);
    });
    horasDiv.appendChild(btn);
  }
  container.appendChild(horasDiv);

  const minsDiv = document.createElement("div");
  minsDiv.style.display = "flex";
  minsDiv.style.flexWrap = "wrap";
  minsDiv.style.gap = "4px";
  minsDiv.style.marginTop = "8px";

  const minutosPosibles = ["00", "15", "30", "45"];
  minutosPosibles.forEach((m) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = m;
    btn.style.padding = "5px 8px";
    btn.style.marginBottom = "5px";
    btn.addEventListener("click", () => {
      minSeleccionado = m;
      actualizarEstilosBotones(minsDiv, btn);
    });
    minsDiv.appendChild(btn);
  });
  container.appendChild(minsDiv);

  function actualizarEstilosBotones(containerDiv, activoBtn) {
    Array.from(containerDiv.querySelectorAll("button")).forEach((b) => {
      b.style.backgroundColor = "#444";
      b.style.color = "#fff";
    });
    activoBtn.style.backgroundColor = "yellow";
    activoBtn.style.color = "#000";
  }

  function getHoraFinal() {
    return `${horaSeleccionada}:${minSeleccionado}`;
  }

  return { container, getHoraFinal };
}

/**
 * Modal para crear un nuevo evento
 */
// ... (mantener las constantes y funciones anteriores hasta promptNewEvent)

/**
 * Modal para crear un nuevo evento
 */
async function promptNewEvent(dayElement) {
  const fecha = dayElement.dataset.date;
  if (!fecha) {
      console.error('No se encontró fecha en el elemento del día');
      return;
  }

  console.log('Creando evento para fecha:', fecha); // Debug

  const lugares = await obtenerOpcionesLugares();
  const interpretes = await obtenerOpcionesInterpretes();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal-content";

  modal.innerHTML = `
      <h3>Nuevo Evento</h3>
      <label for="lugar-select">Lugar:</label>
      <select id="lugar-select" size="5"></select>
      <label for="interprete-select">Intérprete(s):</label>
      <select id="interprete-select" multiple size="5"></select>
      <div class="modal-buttons">
          <button id="guardar-btn">Guardar</button>
          <button id="cancelar-btn">Cancelar</button>
      </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const { container: horaContainer, getHoraFinal } = crearBotonesHora();
  const lugarLabel = modal.querySelector('label[for="lugar-select"]');
  modal.insertBefore(horaContainer, lugarLabel);

  const lugarSelect = modal.querySelector("#lugar-select");
  const interpreteSelect = modal.querySelector("#interprete-select");

  // Poblar opciones de lugar
  lugares.forEach((l) => {
      const option = document.createElement("option");
      option.value = l;
      option.textContent = l;
      lugarSelect.appendChild(option);
  });

  // Poblar opciones de intérpretes
  interpretes.forEach((i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      interpreteSelect.appendChild(option);
  });

  const guardarBtn = modal.querySelector("#guardar-btn");
  const cancelarBtn = modal.querySelector("#cancelar-btn");

  guardarBtn.addEventListener("click", async () => {
      try {
          const hora = getHoraFinal();
          const lugarValue = lugarSelect.value;
          if (!lugarValue) {
              alert("Debe seleccionar un lugar.");
              return;
          }

          const interpretesSeleccionados = Array.from(
              interpreteSelect.selectedOptions
          ).map((opt) => opt.value);

          if (!interpretesSeleccionados.length) {
              alert("Debe seleccionar al menos un intérprete.");
              return;
          }

          console.log('Guardando evento con datos:', { // Debug
              fecha,
              hora,
              lugar: lugarValue,
              interprete: interpretesSeleccionados
          });

          const fields = {
              fecha,
              hora,
              lugar: lugarValue,
              interprete: interpretesSeleccionados,
          };

          const resultado = await saveToAirtable(null, fields);
          
          if (resultado) {
              console.log('Evento guardado exitosamente:', resultado); // Debug
              document.body.removeChild(overlay);
              // Recargar el mes actual después de guardar
              await setMonth(currentMonth);
          }
      } catch (error) {
          console.error('Error al guardar el evento:', error);
          alert('Error al guardar el evento. Por favor, intenta nuevamente.');
      }
  });

  cancelarBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
  });
}

/**
* Guarda en Airtable
*/
async function saveToAirtable(recordId, fields) {
  const url = recordId
      ? `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${recordId}`
      : `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

  const method = recordId ? "PATCH" : "POST";
  const body = { fields };

  try {
      console.log('Enviando solicitud a Airtable:', { // Debug
          url,
          method,
          body: JSON.stringify(body)
      });

      const response = await fetch(url, {
          method,
          headers: {
              'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const errorDetails = await response.json();
          console.error('Error en la respuesta de Airtable:', errorDetails);
          throw new Error(`Error en la solicitud a Airtable: ${response.status} - ${errorDetails.error?.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      console.log('Respuesta exitosa de Airtable:', data);
      return data;
  } catch (error) {
      console.error('Error en saveToAirtable:', error);
      throw error;
  }
}


/*Inicializa el calendario y navegacion de meses*/
document.addEventListener("DOMContentLoaded", () => {
  const monthsList = document.getElementById("months-list");
  const monthItems = monthsList.querySelectorAll("li");
  
  monthItems.forEach((item) => {
    item.replaceWith(item.cloneNode(true));
  });

  document.querySelectorAll("#months-list li").forEach((item, index) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#months-list li").forEach(li => li.classList.remove("active"));
      item.classList.add("active");
      setMonth(index);
    });
  });

  setMonth(0);
  document.querySelector("#months-list li[data-month='0']").classList.add("active");

  const editBtn = document.querySelector("#edit-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      editMode = !editMode;
      editBtn.textContent = `Editar (${editMode ? "ON" : "OFF"})`;
    });
    editBtn.textContent = "Editar (OFF)";
  }
});