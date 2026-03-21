<!------------------------------------------------------------------------------->
<!--  Component TemperatureForecast                                            -->
<!--  Vorschau der Temperaturen für die 5-6 nächsten Tage                      -->
<!------------------------------------------------------------------------------->
<template>
  <div class="temperature-list-area">
    <ul class="temperature-list">
      <li v-for="row in temperatureForecast" :key="row.Datum">
        <div>  
          <p> {{ row.Datum }} </p>
          <p> {{ row.MinTemp }} </p>
          <p> {{ row.MaxTemp }} </p>
        </div>
      </li>
    </ul>
  </div>
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
let temperatureForecast = ref([{}]);     // Array für die Temperaturen (JSON Objekte) 


//********************************** */
//*  Funktionen                      */
//********************************** */

/** Function
 * Abfragen der Kalenderdaten von Web.de über RR-Server
 * @param {Number} range Zeitraum in Tagen 
 * @returns {JSON} response Ergebnis-Daten der Abfrage
 */
async function fetchTemperatureForecast() {
  console.log(`*** fetchTemperatureForecast => Eintritt `);

  const endpoint = 'common/temperature_forecast';                       // wir befinden uns schon auf dem Pfad /api
  const queryParam = '';  //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;
  console.log("URL: " + fullUrl);

  try {
    console.log("Call Axios ");
    const response = await axios.get(fullUrl);
    console.log("Response: ", response.data);
    temperatureForecast.value = response.data;
    return response.data;
  } catch (error) {
    console.error("Fehler beim Axios-Request:", error);
    console.error("Response folgt:");
    console.error(error);
    console.error("==========");
    return null; // oder ein sinnvoller Fallback
  } finally {
    console.log(`*** fetchTemperatureForecast => Austritt`);
  }
}


/** Function
 * Aufbereiten der Kalenderdaten von Web.de 
 * @param {} 
 * @returns {} 
 */
async function startTemperatureForecast() {
  console.log(`*** startTemperatureForecast => Eintritt `);
  console.log(`* Component mounted: TemperatureForecast`);

  let jsonArray = await fetchTemperatureForecast();
  console.log(jsonArray);

  console.log(`* startTemperatureForecast => Austritt `);
}

// Start
startTemperatureForecast();
</script>


<style scoped>
.temperature-list-area{
  padding: 0;
  margin: 0;
}

.temperature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
}

.temperature-list li {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #ddd;
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