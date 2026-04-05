<!------------------------------------------------------------------------------->
<!--  NotizView (Modul Notizen)                                                -->
<!--  Hier werden die Notizen verwaltet                                        -->
<!------------------------------------------------------------------------------->
<template>
  <main>
      <div>       
        <button @click="leavePage" class="btnHome" title="Home">
          <Router-Link :to="`/`" href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
            </svg>
          </Router-Link>
        </button>       
       
        <button @click="leavePage" class="btnBack" title="Back">
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
      <div id="idKopf" class="classKopf">
        <div class="titel">
          <input v-model="notizTitel" type="text" name="nameTitel" class="classTitel" id="idTitel" required>
        </div>
        <button @click="push_inputButton()" class="classButton" type="button">Speichern</button>
      </div>

      <!--  Placeholder Rich Text Editor  -->
      <QuillEditor theme="snow" v-model:content="editorContent" contentType="html" />
      <div id="idInfos" class="classInfos">
        Stand: {{dat_de15(textUpdated)}}
      </div>
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
const { notizen } = storeToRefs(myRRStore);        // Array listen reaktiv machen

// Imports Middleware from Toastification
import { useToast } from "vue-toastification";    // graphische Darstellung von Hinweisen
const toast = useToast();

// Import Credentials für den DB-Zugriff
import * as config from "../dbCredentials.js";

// Import VueQuill
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';


// Datenaustausch mit der GUI
let editorContent = ref("");      // Diese Variable korrepontiert mit dem Inhalt vom Editor
let notizTitel = ref("");         // Variable für den Titel
let textUpdated = ref("");       // Datum der letzten Änderung


let isWaitingForWrite = false;                        // Inhalt der Notiz noch abspeichern?
watch(editorContent, () => isWaitingForWrite = true); // Änderungen im Editor Überwachen


// RRHP_Notizen_T
// (`Id`, `Titel`, `Inhalt`, `Format`, `Created`, `Updated`, `Beschreibung`, `Reserve`)
// let rowId = '';                      // variable für die Id
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
 * Sätze in die DB (Tabelle RRHP_Notizen_T) schreiben
 * - die veränderte Tabelle wird dann zurückgegeben
 * @param {}
 * @returns {}
 */
function write_notizen() {
  console.log(`* write_Notizen => Eintritt `);

  const endpoint = "rrhp/modul-notizen";
  const queryParam = ""; //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;

  let rowId = '';                           // variable für die Id
  if (route.params.id == 0) {     
    rowId = myRRStore.notizen.length + 1;   // die Id für die neue Notiz 
    }
  else {    
    rowId = route.params.id;                // die Id der Notiz, die bearbeitet werden soll 
    }

  console.log("Titel:: ");
  console.log(notizTitel.value);
  console.log("Inhalt: ");
  console.log(editorContent.value);

  axios({
    method: "POST",
    url: fullUrl,
    data: { fkt   : "db-ins",
            // id    : rowId,
            titel : notizTitel.value,
            inhalt: editorContent.value,
            format: "html"
          }
  })
    .then(function (response) {
      console.log("Response: ", response);
      // notizen.value = response.data;
      console.log(`Saetze gelesen: ${response.data.length}`)
      console.log("Notizen: ", response.data);
      isWaitingForWrite = false; // Zurücksetzen nach erfolgreichem Speichern
      router.push("/Notizen/"); // Zurück zur Notiz-Übersicht
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
      console.log(`* write_Notizen => Austritt `);
    });
}


/** Function
 * Fkt. wird ausgeführt, wenn der 'Save' Button gedrükt wird
 */
 function push_inputButton()  {
  console.log(`>>> Sichere Notiz-Text in die DB`);
  console.log(`Titel: ${notizTitel.value}`);
  console.log(`Notizen ${notizen.value}`);
  console.log(`editorContent: ${editorContent.value}`); 
  write_notizen();  
};


/** Function
 * Fkt. wird ausgeführt, bevor die Page von Vue entladen wird
  Achtung - die Funktion onBeforeUnmount wird asynchron ausgeführt. Keine Funktionsaufrufe im Funktionskorper platzieren.
 */
function leavePage() {
  console.log(`>>> Verlasse Notiz-Page `); 
  if (isWaitingForWrite) {
    if (confirm("Möchten Sie die Änderungen speichern?")) {
      write_notizen();  // Speichern der Daten in die DB
    }
  }
  router.push("/Notizen/"); // Zurück zur Notiz-Übersicht
  };


/** Function
 * Fkt. wird ausgeführt, nachdem die Page von Vue geladen wurde
 */
onMounted(() => {
  console.log(`*** Notiz (onMonted) => Eintritt `);

  if (route.params.id == 0) {                        
       console.log(`*** create_notiz => Eintritt `);

  notizTitel.value = "Neuer Notiztitel";   // 
  editorContent.value = "Neue Notiz";      // 
  textUpdated.value = new Date().toISOString(); // Zeige aktuelle Änderung an
  isWaitingForWrite = false; // Änderungen vorhanden, die noch gespeichert werden müssen
  let rowId = myRRStore.notizen.length + 1; // die Id für die neue Notiz (die Id wird in der DB automatisch hochgezählt, hier wird nur eine vorläufige Id für die Anzeige generiert)
  isWaitingForWrite = false; // Änderungen vorhanden, die noch gespeichert werden müssen
    
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

  isWaitingForWrite = false; // Änderungen vorhanden, die noch gespeichert werden müssen

  console.log(`*** create_notiz => Austritt `);
  }
  else {
    console.log(`*** edit_notiz => Eintritt `);

    let rowId = route.params.id; // die Id der Notiz, die bearbeitet werden soll (die Id wird in der DB automatisch hochgezählt, hier wird nur eine vorläufige Id für die Anzeige generiert)
    notizTitel.value = myRRStore.notizen[rowId - 1].titel;           // den Titel in die Variable für die Anzeige im Input-Feld schreiben
    editorContent.value = myRRStore.notizen[rowId - 1].inhalt;      // den Inhalt in die Variable für die Anzeige im Editor schreiben
    textUpdated.value = myRRStore.notizen[rowId - 1].updated;   
    isWaitingForWrite = false; // Änderungen vorhanden, die noch gespeichert werden müssen

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

    isWaitingForWrite = false; // Änderungen vorhanden, die noch gespeichert werden müssen
    console.log(`*** edit_notiz => Austritt `);
  }
     
  console.log(`***_Notiz (onMounted) => Austritt `);
  
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