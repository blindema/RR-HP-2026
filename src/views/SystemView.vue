<!------------------------------------------------------------------------------->
<!--  SystemView (Modul Systeminformationen)                                   -->
<!--  Hier werden verschiedene Informationen aus dem System angezeigt          -->
<!------------------------------------------------------------------------------->
<template>
  <main>
    <header class="page-header">
      <div class="nav-buttons">
        <button @click="del_row(ix)" class="btnHome" title="Home">
          <Router-Link :to="`/`" href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
            </svg>
          </Router-Link>
        </button>

        <button @click="del_row(ix)" class="btnBack" title="Back">
          <Router-Link :to="`/Notizen/`">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
            </svg>
          </Router-Link>
        </button>
      </div>
      <h3>System Dashboard</h3>
    </header>

    <article class="grid-layout">
      <section class="box box-1">
        <b>📅 Termine</b>
        <Calendar/>
      </section>
      <section class="box box-2">
        <b>📊 Box 2</b>
        <p>Platzhalter für weitere Informationen</p>
      </section>
      <section class="box box-3">
        <b>🌡️ Temperaturen</b>
        <TemperatureForecast/>
      </section>
      <section class="box box-4">
        <b>🌤️ Wetter</b>
        <p>Außentemperatur: {{ Math.round(aTemp) }} °C</p>
        <p>Temperatur GH: {{ Math.round(aTempGHaus) }} °C</p>
        <p>Temperatur AZ: {{ Math.round(aTempAZ) }} °C</p>
      </section>
      <section class="box box-5">
        <b>🗑️ Abfall</b>
        <p>Informationen zu Abfallterminen</p>
      </section>
    </article>
  </main>
</template>


<script setup>
// Imports ,
import { onMounted, onBeforeUnmount, onBeforeMount} from "vue";
import { ref, watch, unref, toRaw } from "vue";
import axios from "axios";
import chevron from "../assets/chevron-double-down.svg";

// Imports from Router
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
console.log(route.params);

// Imports und declare from Composables
import { useData } from "../../use/useComposables.js";
const { dat_kurz, dat_kurz2, dat_de15, dat_de15_check, ioBroker} = useData();

// Imports und declare from Components
import Calendar from "../components/Calendar.vue";
import TemperatureForecast from "../components/TemperatureForecast.vue";

// Imports and declare from Store
import { useRRStore } from "../stores/store";     // das ist der Store
import { storeToRefs } from "pinia";              // Import Modul Reaktive Funktionalität von Pina
const myRRStore = useRRStore();                   // Reaktive Funktionalität aktivieren
const { listen } = storeToRefs(myRRStore);        // Array listen reaktiv machen

// Imports Middleware from Toastification
import { useToast } from "vue-toastification";    // graphische Darstellung von Hinweisen
const toast = useToast();

// Import Credentials für den DB-Zugriff
import * as config from "../dbCredentials.js";

// Variablen im HTML-Block
let aTemp      = ref("");                         // Außentemperatur
let aTempGHaus = ref("");                         // Temperatur Gewächshaus
let aTempAZ    = ref("");                         // Temperatur Arbeitszimmer



//********************************** */
//*  Funktionen                      */
//********************************** */

/** Function
 * Auslesen von einer Objekt-Id im ioBroker über Axios (HTTP Request)
 * @param {String} objektId Id des ioBroker Objektes
 * @returns {String} response Ergebnis-Daten der Abfrage
 */
 async function readIoBroker(objektId) {
  console.log(`*** readIoBroker => Eintritt `);

  let url = `${ioBroker.protokoll}://${ioBroker.ipAddress}:${ioBroker.simpleApiPort}/getPlainValue/${objektId}`;  
  console.log("url: " + url);

  try {
    const response = await axios.get(url);
    console.log("Response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Fehler beim Axios-Request:", error);
    console.error("Response folgt:");
    console.error(response);
    console.error("==========");
    return null; // oder ein sinnvoller Fallback
  } finally {
    console.log(`*** readIoBroker => Austritt`);
  }
}


/** Function
 * Fkt. wird ausgeführt, nachdem die Page von Vue geladen wurde
 * Fkt. muss async sein, um das await verwenden zu dürfen (der Hinweis hier im Editor ist unklar; es funktioniert)
 */
onMounted( async () => {
  console.log(`*** xxx => Eintritt `);  
  aTemp.value = await readIoBroker("0_userdata.0.Temperatur.parser.Script.Aussentemperatur");
  aTempGHaus.value = await readIoBroker("mqtt.0.ESP_Easy.T_Sensor_1.temperature");
  aTempAZ.value = await readIoBroker("fritzdect.0.DECT_087610055195.celsius");
  console.log("aTemp: " + aTemp.value);  
  console.log(`*** xxx => Austritt `);  
});


/** Function
 * Fkt. wird ausgeführt, bevor die Page von Vue entladen wird
 */
onBeforeUnmount(() => {

});

</script>



<style scoped>
/*
/*  Page für den System-View  */

main {
  margin-left: auto;
  margin-right: auto;
  width: 95%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #fff;
}

.btnHome, .btnBack {
  border: none;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 20px;
  border-radius: 50px;
  margin: 10px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btnHome:hover, .btnBack:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.svg-icon {
  width: 1.2em;
  height: 1.2em;
}

.svg-icon path {
  fill: #fff;
}

*,
::before,
::after {
  box-sizing: border-box;
}

h3 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

article {
  min-height: 100%;
  display: flex;
  justify-content: center;
}

/* Desktop-Layout */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 1rem;
  height: 100%;
  min-height: 400px;
}

/* Box-Zuweisung */
.box-1 {
  grid-row: 1 / 5;
  grid-column: 1;
}

.box-2 {
  grid-row: 1;
  grid-column: 2;
}

.box-3 {
  grid-row: 2;
  grid-column: 2;
}

.box-4 {
  grid-row: 3;
  grid-column: 2;
}

.box-5 {
  grid-row: 4;
  grid-column: 2;
}

/* Box-Styling */
.box {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: #333;
}

.box:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.box b {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #667eea;
}

/* Responsive für Handy */
@media (max-width: 768px) {
  main {
    width: 100%;
    padding: 10px;
  }
  .grid-layout {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
  .box {
    grid-column: 1;
    grid-row: auto;
    min-height: 120px;
    width: 100%;
  }
  h3 {
    font-size: 2rem;
  }
}

/* Media Query (immer am Ende platzieren) */
@media only screen and (max-width: 750px) {
  .grid-layout {
    gap: 1rem;
  }
  .box {
    padding: 1rem;
  }
}
</style>