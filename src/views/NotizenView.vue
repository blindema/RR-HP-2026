<!------------------------------------------------------------------------------->
<!--  NotizenView (Modul Notizen)                                                -->
<!--  Hier werden die Notizen verwaltet                                        -->
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

    <h2>Notizen</h2>

    <section id="idEditor" class="classEditor">
     
    </section>

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

// Import VueQuill
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';


//let todoList = ref([]); // Array für die Items einer Liste (Sätze aus der DB gelesen)
let notizen = ref({});                                // Inhalt vom Eingabefeld
let editorContent = ref("");                          // Diese Variable korrepontiert mit dem Inhalt vom Editor
let notizTitel = ref("");                        // Variable für den Titel

let isWaitingForWrite = false;                        // Inhalt der Notiz noch abspeichern?
watch(editorContent, () => isWaitingForWrite = true); // Änderungen im Editor Überwachen

//Datensatz Notiz
let rowId = 2; // Id
//let titel = "";                        // Variable für den Titel
//let inhalt = "";                                // Variable für den Inhalt
let textFormat = "html";                            // Variable für den Titel
let textUpdated = ref("");


//********************************** */
//*  Funktionen                      */
//********************************** */

/** Function
 * Sätze aus der DB (Tabelle RRHP_Notizen_T) lesen
 * @param {}
 * @returns {}
 */
function read_notizen() {
  const endpoint = "rrhp/modul-notizen";
  const queryParam = ""; //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;

  console.log(`*** read_Notizen => Eintritt `);

  axios({
    method: "GET",
    url: fullUrl
  })
    .then(function (response) {
      
      console.log("Response: ", response);
      //notizen.value = response.data;                          // Datensätze in Variable speichern
      console.log(`Saetze gelesen: ${response.data.length}`)
      console.log("Rows: ", response.data);      
      console.log("Rows JO: ");      
      //console.log(response.data[0].Inhalt);  
      var JO = response.data[0].Inhalt;   
      textUpdated.value = response.data[0].Updated; 
      console.log("Geladener Inhalt:", JO);
      console.log("Typ:", typeof JO);
      editorContent.value = JO;                                 // Datensatz 0 an den Editor übergeben
      notizTitel = response.data[0].Titel;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });  
    console.log(`*** read_Notizen (onMounted) => Austritt `);
}



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
      console.log(`Saetze gelesen: ${response.data.length}`)
      console.log("Rows: ", response.data);          
      textUpdated = response.data[0].Updated;                      // Datum der letzten Änderung 
      editorContent.value = response.data[0].Inhalt;               // Datensatz 0 an den Editor übergeben
      notizTitel = response.data[0].Titel;                         // .value wird nicht benötigt     
     
      /* Da ich nur einen Datensatz habe, kann ich diesen auch als einzelnes JSON-Objekt speichern
      let test1 = {};  test1 = notizen.value[0];  console.log  ("test1: ");  console.log  (test1.Titel);
      */
    })
    .then(function () {                                                  // Setze CSS Eigenschaften beim Editor
      const editorContainer = document.querySelector('.ql-container');
      const stylesContainer = window.getComputedStyle(editorContainer);
      console.log(editorContainer.style);                                // 
      editorContainer.style.border = '0px';
      editorContainer.style.backgroundColor = 'rgb(250,250,250)';

      const editorToolbar = document.querySelector('.ql-toolbar');
      const stylesToolbar = window.getComputedStyle(editorToolbar);
      console.log(editorToolbar.style); 
      //console.log(styles);                                             // 
      editorToolbar.style.border = '0px';
      editorToolbar.style.backgroundColor = 'rgb(240,240,240)';
    })
    .catch(function (error) {     
      console.log(error);                                                // handle error
    })
    .finally(function () {      
      console.log("Axion.finally:")                                      // always executed  
    });
  
    console.log(`*** read_Notizen (onMounted) => Austritt `);
  
});



/** Function
 * Fkt. wird ausgeführt, bevor die Page von Vue entladen wird
 */
onBeforeUnmount(() => {
  console.log(`*** Page before unmount: Notiz`);
  // Die folgende Zeile ist nur zeitweise bis eine Notizen-Übersicht programmiert wird.
  if (isWaitingForWrite == true) {
    write_notizen();  // Speichern der Daten in die DB
  }
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
}
textarea {
  display: block;
  width: 50%;
  margin: 0 auto;
  text-align: left;
}

.classKopf {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}
.classTitel {
  width: 20em;
  border-radius: 0.75em;
  /*justify-content: flex-start; */
}
/*                  */
.classButton {
  width: 5.5em;
  border-radius: 0.75em;
  color:green;
  border: 1px;
  cursor: pointer;
  
  /*justify-content: flex-end; */
}

.classButton:hover {
  color:rgb(2, 189, 2);
}

.ql-toolbar.ql-snow {
  border-radius: 0.5em;
}

.ql-container.ql-snow {
  border: 0px;
}

.classInfos {
font-size: small;
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