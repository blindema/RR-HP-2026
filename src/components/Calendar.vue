<!------------------------------------------------------------------------------->
<!--  Component Calendar                                                       -->
<!--  Vorschau der Termine für die nächsten Tage                               -->
<!------------------------------------------------------------------------------->
<template>
  <main>
    <ul class="event-list">
      <li v-for="event in events" :key="event.start">
        <div>
          <div class="date_time">
            <span class="date">{{ formatDateTime('date', event) }}</span>
            <span class="time">{{ formatDateTime('time', event) }}</span>
          </div>
          <div :class="['summary', { recurring: event.isRecurringInstance }]">
            {{ event.summary }}
          </div>
        </div>
      </li>
    </ul>
  </main>
</template>


<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import axios from 'axios'

// Imports and declare from Store
import { useRRStore } from "../stores/store";
const myRRStore = useRRStore();

// Import HTTP-Credentials für den Zugriff zu RR-Server
import * as config from '../dbCredentials.js';

// Variablen Deklaration
let events = ref([{}]);     // Array für die Termine (JSON Objekte) 


//********************************** */
//*  Funktionen                      */
//********************************** */

/** Function
 * Abfragen der Kalenderdaten von Web.de über RR-Server
 * @param {Number} range Zeitraum in Tagen 
 * @returns {JSON} response Ergebnis-Daten der Abfrage
 */
async function fetchCalendar() {
  console.log(`*** fetchCalendar => Eintritt `);

  const endpoint = 'caldav';                       // wir befinden uns schon auf dem Pfad /api/caldav
  const queryParam = '';  //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;
  console.log("URL: " + fullUrl);

  try {
    console.log("Call Axios ");
    const response = await axios.get(fullUrl);
    console.log("Response: ", response.data);
    events.value = response.data;
    return response.data;
  } catch (error) {
    console.error("Fehler beim Axios-Request:", error);
    console.error("Response folgt:");
    console.error(error);
    console.error("==========");
    return null; // oder ein sinnvoller Fallback
  } finally {
    console.log(`*** fetchCalendar => Austritt`);
  }
}


/** Function
 * Aufbereiten der Kalenderdaten von Web.de 
 * @param {} 
 * @returns {} 
 */
async function startCalendar() {
  console.log(`*** startCalendar => Eintritt `);
  console.log(`* Component mounted: Calendar`);

  let jsonArray = await fetchCalendar();
  console.log(jsonArray);

  console.log(`* startCalendar => Austritt `);
}


/** Function
 * Datum / Uhrzeit so aufbereiten, wie es auf der Seite dargestellt werden soll
 * Hinweise:
 * Die Methode String.padStart() füllt die aktuelle Zeichenkette mit einer gegebenen Zeichenkette auf (ggf. wiederholt), 
 * so dass die resultierende Zeichenkette eine gegebene Länge erreicht. 
 * Das Auffüllen erfolgt ab dem STart der aktuellen Zeichenkette. 
 * @param {string} typ Datum oder Zeit
 * @param {string} termin Datums-String im UTC 
 * @returns {string} ddmmyy  
 */
function formatDateTime(typ, termin) {
  const date = new Date(termin.start);                         // Datumsobjekt aus einer Zeichenkette (UTC Format) erstellen

  switch (typ) {
    case "date":
      const day   = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year  = String(date.getFullYear());
      //const year = String(date.getFullYear()).slice(-2);         // Nur die letzten 2 Stellen vom Jahr
      return `${day}.${month}.${year}`;
    case "time":
      const hour   = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const zeit   = `${hour}:${minute}`;
      if ( termin.datatype === 'date' ) return "";                  // ganztägiger Termin - keine Uhrzeit
      return zeit;
    default:
      break;
  }

}

startCalendar();
</script>


<style scoped>
.event-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
}

.event-list li {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.date_time {
  flex: 1;
  width: 130px;
  color: #555;
}

.date {  
  width: 60px;
  color: #555;
}

.time {
  margin-left: 0.75em;
  width: 60px;
  color: #555;
}

.summary {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
}

.recurring {
  color: #0077cc;
}

@media only screen and (max-width: 750px) {
  .event-list {
    font-size: 0.85rem;
  }

  .date {
    width: 50px;
  }
}
</style>