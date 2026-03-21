<!------------------------------------------------------------------------------->
<!--  SystemView (Modul Systeminformationen)                                   -->
<!--  Hier werden verschiedene Informationen aus dem System angezeigt          -->
<!------------------------------------------------------------------------------->
<template>
  <main>

    <div>
      <button @click="del_row(ix)" class="btnHome" title="Home">
        <Router-Link :to="`/`" href="">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path
              d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
          </svg>
        </Router-Link>
      </button>


      <button @click="del_row(ix)" class="btnBack" title="Back">
          <Router-Link :to="`/Notizen/`">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
            </svg>
          </Router-Link>
        </button>       
    </div>

    <header>
      <h3>System</h3>
    </header>

    <article class="grid-layout">
      <section class="box box-1">
        <b>Termine</b>
        <Calendar/>
      </section>
      <section class="box box-2">
        <b>Box 2</b>
      </section>
      <section class="box box-3">
        <b>Temperaturen</b>
        <TemperatureForecast/>
      </section>
      <section class="box box-4">
        <b>Wetter</b>
        <p>Außentemperatur: {{ Math.round(aTemp) }} °C</p>  
        <p>Temperatur GH: {{ Math.round(aTempGHaus) }} °C</p>     
        <p>Temperatur AZ: {{ Math.round(aTempAZ) }} °C</p>     
      </section>
      <section class="box box-5">
        <b>Abfall</b>
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
  /* background-color: #eee; */
  margin-left: auto;
  margin-right: auto;
  width: 95%;
  height: 100vh; 
  background-color: #fafafa; 
  }

.btnHome, .btnBack{
  border: 0;
  background-color: #f6f6f6; 
  padding: 0 20px 0 20px;
}

.svg-icon {
  width: 1.2em;
  height: 1.2em;   
}

.svg-icon path {
  fill: #000;
}

*,
::before,
::after {
	box-sizing: border-box
}

h1 {
	border-radius: 0 .5em .5em;
	border: thin solid #d5d5d5;
	padding: .5em;
	margin: .5em auto;
}

h3 {
  text-align: center;
}

article{
  min-height: 100%;
  display: flex;
  justify-content: center;
} 


/* Desktop-Layout */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  min-height: 400px; /* oder was du brauchst */
}

/* Box-Zuweisung */
.box-1 {
  grid-row: 1 / 5; /* nimmt alle 4 Zeilen ein */
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
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content:flex-start;
}

/* Responsive für Handy */
@media (max-width: 768px) {
   
 .main {
    width: 100%;
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
}


/*                  */

/*********************************************************************/
/* Media Query  (immer am Ende plazieren)                                                     */
/*********************************************************************/

/* For iPhones          : Breite=414px; Höhe=736 bei Viewport=1.0*/
/* For Galaxy S24 Ultra : Breite=378px; Höhe=819 bei Viewport=1.0*/
@media only screen and (max-width: 750px) {
}
</style>