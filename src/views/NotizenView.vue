<!------------------------------------------------------------------------------->
<!--  NotizenView (Modul Notizen)                                                -->
<!--  Hier werden die Notizen verwaltet                                        -->
<!------------------------------------------------------------------------------->
<template>
  <main>

      <div>       
        <button  class="btnHome" title="Home">
          <Router-Link :to="`/`" href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
            </svg>
          </Router-Link>
        </button>
       
       
        <button  class="btnBack" title="Back">
          <Router-Link :to="`/Notizen/`">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
            </svg>
          </Router-Link>
        </button>        
      </div>

    <h2>Notizen Übersicht</h2>
    
    <div class="add-note-container">
      <Router-Link :to="`/Notiz/0`" class="btn-add-note" title="Neue Notiz">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </Router-Link>
    </div>
    
    <!-- Hidden divs for HTML previews -->
    <div v-for="(row, ix) in notizen" :key="'preview-' + ix" :id="'preview-' + ix" v-html="row.Inhalt" class="preview-hidden"></div>
    
     <ul>
      <li v-for="(row, ix) in notizen" :key="ix" :id="'Row' + ix" class="card">
        <Router-Link :to="`/Notiz/${ix + 1}`" href="" class="card-link">
          <div class="card-content">
            <div class="flex-item-pic">
              <img :src="previewImages[ix] || 'src/assets/' + getImageForRow(ix)" alt="Notiz Bild">
            </div>
            <div class="flex-item-data">
              <h3 class="item-title">{{ row.Titel }}</h3>
              <p class="item-date">Aktualisiert: {{ dat_kurz2(row.Updated) }}</p>
              <p class="item-date">Erstellt: {{ dat_kurz2(row.Created) }}</p>
            </div>
          </div>
        </Router-Link>
      </li>
    </ul>

  </main>
</template>


<script setup>
// Imports ,
import { onMounted, onBeforeUnmount, onBeforeMount, nextTick} from "vue";
import { ref, watch, unref, toRaw } from "vue";
import axios from "axios";
import html2canvas from 'html2canvas';
import chevron from "../assets/chevron-double-down.svg";

// Imports from Router
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
console.log(route.params);

// Imports und declare from Composables
import { useData } from "../../use/useComposables.js";
const { dat_kurz, dat_kurz2, dat_de15, dat_de15_check, progressColor, showSidebar, hideSidebar, onUnmounted} = useData();

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


let notizen = ref({});                                // Inhalt vom Eingabefeld
let notizTitel = ref("");                        // Variable für den Titel

// Array of images for notes
const noteImages = ['buch.png', 'task.png', 'shopping.jpg', 'oma2.jpg'];

// Function to get image for row
const getImageForRow = (ix) => {
  return noteImages[ix % noteImages.length];
};

// Preview images for HTML content
let previewImages = ref([]);


// RRHP_Notizen_T
// (`Id`, `Titel`, `Inhalt`, `Format`, `Created`, `Updated`, `Beschreibung`, `Reserve`)
//let rowId = 2;                        // variable für die Id
//let titel = "";                       // Variable für den Titel
//let inhalt = "";                      // Variable für den Inhalt
//let format = "html";                  // Variable für das Format (zB html, markdown, text)
//let created = ref("");                // Variable für das Erstellungsdatum
//let updated = ref("");                // Variable für das Aktualisierungsdatum  
//let beschreibung = "";                // Variable für die Beschreibung



//********************************** */
//*  Funktionen                      */
//********************************** */


/** Function
 * Fkt. wird ausgeführt, nachdem die Page von Vue geladen wurde
 */
onMounted(() => {
  console.log(`*** read_Notizen (onMonted) => Eintritt `);
  
  const endpoint = "rrhp/modul-notizen";
  const queryParam = ""; //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`; 

  axios({
    method: "GET",
    url: fullUrl
  })
    .then(function (response) {
      
      console.log("Response: ", response);
      //notizen.value = response.data;                            // Datensätze in Variable speichern
      console.log(`Saetze aus DB  gelesen: ${response.data.length}`)
      console.log("Rows: ", response.data);   
      myRRStore.lade_notizen(response.data);          // Laden des Array myRRStore.notizen rows = response.data  
      notizen.value = response.data;
      
      // Generate previews after data is loaded
      nextTick(() => {
        notizen.value.forEach((row, ix) => {
          if (row.Inhalt) {
            const element = document.getElementById(`preview-${ix}`);
            if (element) { html2canvas(element, { width: 200, height: 150 
              })
              .then(canvas => { previewImages.value[ix] = canvas.toDataURL();
              })
              .catch(err => {
                console.error('html2canvas error:', err);
              });
            }
          }
        });
      });
    })
    .catch(function (error) {     
      console.log(error);                                                // handle error
    })
    .finally(function () {      
      console.log("Axion.finally:")                                      // always executed  
    });
  
    console.log(`*** read_Notizen (onMounted) => Austritt `);
  
});

</script>



<style scoped>
/*
/*  Page für die ToDo Liste  */

main {
  /* background-color: #eee; */
  margin-left: auto;
  margin-right: auto;
  width: 96vw;
  margin-top: 1em;
}

.btnHome, .btnBack{
  border: 0;
  background-color: #fff;
  padding: 0 20px 0 20px;
}

.svg-icon {
  width: 1.2em;
  height: 1.2em;
}

.svg-icon path {
  fill: #000;
}

h2 {
  text-align: center;
  margin-bottom: 1em;
  font-size: 2em;
  color: #333;
}

.add-note-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5em;
}

.btn-add-note {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.btn-add-note:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.btn-add-note:active {
  transform: scale(0.95);
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card-content {
  display: flex;
  align-items: center;
  padding: 1em;
}

.flex-item-pic {
  flex-shrink: 0;
  margin-right: 1em;
}

.flex-item-pic img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.flex-item-data {
  flex: 1;
}

.item-title {
  margin: 0 0 0.5em 0;
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
}

.item-date {
  margin: 0.2em 0;
  font-size: 0.9em;
  color: #7f8c8d;
}

.preview-hidden {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 200px;
  height: 150px;
  overflow: hidden;
  background: white;
}

/*********************************************************************/
/* Media Query  (immer am Ende plazieren)                                                     */
/*********************************************************************/

/* For iPhones          : Breite=414px; Höhe=736 bei Viewport=1.0*/
/* For Galaxy S24 Ultra : Breite=378px; Höhe=819 bei Viewport=1.0*/
@media only screen and (max-width: 750px) {
}
</style>