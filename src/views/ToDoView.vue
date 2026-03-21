<!------------------------------------------------------------------------------->
<!--  ToDoView (Aufgaben Modul)                                                -->
<!--  Hier werden die anstehenden Aufgaben verwaltet                           -->
<!------------------------------------------------------------------------------->
<template>
  <main>
    <h2>ToDo List</h2>

    <div class="accordion" id="">
      <div class="accordion-header" @click="toggleAnswer()">
        <div class="accordion-title"> Neue Aufgabe erfassen </div>
        <div :class="['icon', { open: isOpen }]">
          <img :src="chevron" alt="chevron-icon" />
        </div>                         
      </div>

      <div :class="['accordion-content',  { open: isOpen } ]">  
        <!-- Formular: neue Aufgabe anlegen -->
        <form id="formAddTask" >
          <div class="form_row1">
            <label for="input_Bezeichnung" class="form-label">Bezeichnung:</label>
            <input v-model="row_Bezeichnung" type="text" name="todo_Bezeichnung" class="form-control" id="input_Bezeichnung" required
                    aria-describedby="BezeichnungHelp">
            <div id="AufgabeHelp" class="form-text">Die Aufgabe benennen</div>
          </div>
          <div class="form-row2">
            <div class="form-row2-col1">
              <label for="input_Endedatum" class="form-label">Endedatum:</label>
              <input v-model="row_Endedatum" type="date" name="todo_Endedatum" class="form-control" id="input_Endedatum"
                      aria-describedby="EndedatumHelp">
              <div id="EndedatumHelp" class="form-text">Endedatum der Aufgabe</div>
            </div>
            <div class="form-row2-col2">
              <label for="input_Fortschritt" class="form-label">Fortschritt:</label>
              <input v-model="row_Fortschritt" type="number" name="todo_Fortschritt" class="form-control" id="input_Fortschritt" min="0" max="100" value="0"
                      aria-describedby="FortschrittHelp">
              <div id="FortschrittHelp" class="form-text">Aufgabe erledigt in %</div>
            </div>
            <div class="form-row2-col3">
              <label for="select_Prio" class="form-label">Priorität:</label>
              <select v-model="row_Prio" name="todo_Prio" class="form-control" id="select_Prio" aria-describedby="PriotHelp">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <div id="PrioHelp" class="form-text">Priorität auswählen</div>
            </div>
  				</div>
        </form>
        <!-- Button raus aus dem Formular; wird sonst immer abgeschickt; -->
        <!-- <button @click="push_inputButton()" class="form-button">Speichern</button> -->
        <button @click="push_inputButton()" class="form-button" type="button">Speichern</button>
      </div>
    </div>          

    <ul>
      <li v-for="(row, ix) in todoList" :key="ix" :id="ix" >
        <div class="card">
          <div class="card_prio" :style="'background-color: ' + prioColor[row.Prio]">
          </div>
          <div class="card_main_wrapper">
            <div class="card_main">
              <div class="card_main_row1_wrapper">
                <div class="card_main_row1">{{ row.Bezeichnung }}</div>
              </div>
              <div class="card_main_row2_wrapper">
                <div class="card_main_row2">{{ row.Endedatum.substring(8,10) + '.' + row.Endedatum.substring(5,7) + '.' + row.Endedatum.substring(0,4) }}</div>
              </div>
              <div class="card_main_row3_wrapper">
                <div class="card_main_row3">
                  <div class="card_main_row3_col1">
                    <span id="card_main_row3_span11">ID:</span>
                    <span id="card_main_row3_span12">{{ row.Id }}</span>
                  </div>
                  <div class="card_main_row3_col2">
                    <span id="card_main_row3_span21">Erstellt:</span>
                    <span id="card_main_row3_span22">{{ dat_de15(row.Created) }}</span>
                  </div>
                  <div class="card_main_row3_col3">
                    <span id="card_main_row3_span31">Verändert:</span>
                    <span id="card_main_row3_span32">{{ dat_de15( dat_de15_check(row.Updated,row.Created) ) }}</span>
                  </div>
                </div>
              </div>
              <div class="card_main_row4_wrapper" >
                <div class="card_main_row4" :style= "'width: ' + row.Fortschritt + '%; background-color: ' + progressColor(ix, row.Created, row.Endedatum, row.Fortschritt) " >       
                </div>
              </div>
            </div>
          </div>
          <div class="card_cmd_wrapper">
            <div class="card_cmd">
              <button @click="push_updateButton(ix)" class="">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="svg-icon-pensil"
                  viewBox="0 0 16 16">
                  <path
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                </svg>
              </button>
              <button @click="del_todolist_row(ix)" class="">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="svg-icon-trash"
                  viewBox="0 0 16 16">
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </main>
</template>


<script setup>
// Imports ,
import { onMounted } from 'vue';
import { ref }       from 'vue';
import axios         from 'axios';
import chevron from '../assets/chevron-double-down.svg'

// Imports from Router
import { useRoute, useRouter } from 'vue-router';
const route  = useRoute();
const router = useRouter();
console.log(route.params);

// Imports und declare from Composables
import { useData } from '../../use/useComposables.js';
const { dat_kurz, dat_kurz2, dat_de15, dat_de15_check, progressColor, showSidebar, hideSidebar, onUnmounted} = useData();

// Imports and declare from Store
import { useRRStore } from "../stores/store";  // das ist der Store
import { storeToRefs } from "pinia";             // Import Modul Reaktive Funktionalität von Pina
const myRRStore = useRRStore();                  // Reaktive Funktionalität aktivieren
const {listen} = storeToRefs(myRRStore);         // Array listen reaktiv machen

// Imports Middleware from Toastification
import { useToast } from 'vue-toastification';   // graphische Darstellung von Hinweisen
const toast = useToast();

// Import Credentials für den DB-Zugriff
import * as config from '../dbCredentials.js';


let todoList  = ref([]);               // Array für die Items einer Liste (Sätze aus der DB gelesen)
let inputString = ref('');             // Inhalt vom Eingabefeld
let isNewItem  = true;                 // Neue oder veränderte Zeile?
let isOpen = ref(false);               // das Accordeon fürs Formular ist geöffnet

//Datensatz todoList
let rowId             = 0;             // Id           
let row_Bezeichnung   = ref('');       // Bezeichnung           
let row_Prio          = ref('');       // Prio
let row_Endedatum     = ref('');       // Endedatum
let row_Fortschritt   = ref('');       // Fortschritt

let prioColor = { Low    : '#eee;',    // Json-Objekt zur Umrechnung der Priorität in einen css Farbwert
                  Medium : '#f8d50e;',
                  High   : '#f554bs;'
                }


//********************************** */
//*  Funktionen                      */
//********************************** */


/** Function
  * Sätze aus der DB (Tabelle RRHP_ToDoList_T) lesen
  * @param {} 
  * @returns {}
  */
  function read_todolist () {
    const endpoint = 'rrhp/modul-aufgaben';
    const queryParam = '';  //zB ?fkt=1
    const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`; 

    console.log(`* read_ToDoList => Eintritt `); 
     
    axios({
      method: 'GET',
      url: fullUrl,    
      //auth: { username: 'blindema',  password: 'abcd1234' },
      params: { fkt: 'db-sel' }        // 
    })     
    .then( function (response) {
      console.log('Response: ', response);
      todoList.value = response.data;
      console.log('ListItems: ', todoList.value);
    })
    .catch( function (error) { 	// handle error
      console.log(error);
    })
    .finally( function () {      // always executed
    });   
  }


/**
  * Neuen Satz in die Tabelle RRHP_ToDoList_T schreiben
  * @param {} 
  * @return ()
  */
  function add_todolist_row() {
    const endpoint = 'rrhp/modul-aufgaben';
    const queryParam = '';  //zB ?fkt=1
    const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`; 

    console.log(`* ins_todolist_row => Eintritt `); 
    // console.log('row_ix in der Tabelle: ', row_ix);  
    // console.log('Row_Id im Datensatz: ', todoList.value[row_ix].Id);     
   
    axios({
      method: 'POST',
      url: fullUrl,  
      //auth: { username: 'blindema',  password: 'abcd1234' },     
      data: { fkt       : 'db-ins',
              bez       : row_Bezeichnung.value,
              prio      : row_Prio.value,
              ende      : row_Endedatum.value,
              fs        : row_Fortschritt.value
              }            
    })     
    .then( function (response) {
      console.log('Response: ', response);
      todoList.value = response.data;
      toast.success('Row added');
      //console.log('ListItems: ', todoList.value);
    })
    .catch( function (error) { 	// handle error
      console.log(error);
    })
    .finally( function () {      // always executed
    });   
    
    console.log(`* ins_todolist_row => Austritt `); 
  }


/** Function
  * Einen Satz in die Tabelle RRHP_ToDoList_T verändern (updaten)
  * @param {} 
  * @return {}
  */
  function upd_todolist_row() {
    const endpoint = 'rrhp/modul-aufgaben';
    const queryParam = '';  //zB ?fkt=1
    const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`; 

    console.log(`* upd_todolist_row => Eintritt `); 
    // console.log('row_ix in der Tabelle: ', row_ix);  
    // console.log('Row_Id im Datensatz: ', todoList.value[row_ix].Id);     
   
    axios({
      method: 'POST',
      url: fullUrl, 
      auth: { username: config.username, password: config.password },  // angepasst copilot 19.03.2026
      data: { fkt       : 'db-upd',
              id        : rowId,
              bez       : row_Bezeichnung.value,
              prio      : row_Prio.value,
              ende      : row_Endedatum.value,
              fs        : row_Fortschritt.value
              }            
    })     
    .then( function (response) {
      console.log('Response: ', response);
      todoList.value = response.data;
      toast.success('Row updated');
      //console.log('ListItems: ', todoList.value);
    })
    .catch( function (error) { 	// handle error
      console.log(error);
    })
    .finally( function () {      // always executed
    });   
    console.log(`* ins_todolist_row => Austritt `); 
  }


/** Function
  * Einen Satz in die Tabelle RRHP_ToDoList_T löschen (delete)
  * @param {number} rowIx 
  * @return {}
  */
  function del_todolist_row(rowIx) {
    const endpoint = 'rrhp/modul-aufgaben';
    const queryParam = '';  //zB ?fkt=1
    const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`; 
    
    console.log(`* del_todolist_row => Eintritt `); 
    rowId = todoList.value[rowIx].Id;                                               // über den rowIx die rowId auslesen und sichern      
    console.log("* Delete einer Zeile; rowIx = " , rowIx ,  ", rowId = " , rowId ); //Achtung: die Variablen enthalten Zahlen; keine Verkettung mit String   
   
    axios({
      method: 'POST',
      url: fullUrl,      
      data: { fkt       : 'db-del',
              id        : rowId,
              }            
    })     
    .then( function (response) {
      console.log('Response: ', response);
      todoList.value = response.data;
      toast.success('Row deleted');
      //console.log('ListItems: ', todoList.value);
    })
    .catch( function (error) { 	// handle error
      console.log(error);
      toast.error("Error deleting row")
    })
    .finally( function () {      // always executed
    });   
    console.log(`* del_todolist_row => Austritt `); 
  }


/** Function
  * Plausibilitäts-Check ToDoList Eingabeformular
  * @param {} 
  * @return {boolen}  true / false
  */  
  function checkForm () {

    console.log("Beginn ToDoList Eingabeformular Plausibilitäts-Check");
    //console.log("arg1: " , arg1);   

    if (row_Bezeichnung.value.trim() === '') {    
      toast.error('Eingabefeld darf nicht leer sein!');       
      console.log('Eingabefeld ist leer => No Aktion');
      console.log("* checkForm => Verlassen ");
      return false;  
    } 
    console.log("Plausibilitäts-Check bestanden");
    return true;
  }


/** Function
  * Button im Formular gedrückt
  * @param {number} rowIx  Zeilenindex
  * @return {}
  */
  function push_inputButton () {
    console.log(`* push_inputButton => Eintritt `);           
    
    // Plausibilitäts-Check Eingabe-Formular
    if (!checkForm()) {    
      //toast.error('Eingabefeld darf nicht leer sein!');       
      console.log("* pushInputButton => Verlassen ");
      return;   
    }  

    // Prüfung ob ein neues Item erstellt wird oder ein bestehendes Item verändert wurde
    if( isNewItem ) {                                           // neus Item (neue Zeile)  
      console.log('  Bezeichnung: ', row_Bezeichnung.value);
      console.log("* Insert in der DB anstossen; Datensatz folgt: "); 
      console.log("  ", rowId, row_Bezeichnung.value, row_Prio.value, row_Endedatum.value, row_Fortschritt.value); 
      isOpen = false;                                           // Formular schließen
      add_todolist_row();                                     
      }
      else {                                                    // geänderte Zeile        
        console.log("* Update in der DB anstossen; Datensatz folgt: "); 
        console.log("  ", rowId, row_Bezeichnung.value, row_Prio.value, row_Endedatum.value, row_Fortschritt.value); 
        isOpen = false;                                         // Formular schließen
        upd_todolist_row();                                     // Update in der DB anstoßen
        //inputString.value = '';                               // Feldinhalt löschen                      
      }        
    
    rowId = 0;                                 // Datenfelder zurücksetzen
    row_Bezeichnung.value   = '';            
    row_Prio.value          = ''; 
    row_Endedatum.value     = '';    
    row_Fortschritt.value   = 0; 
    isNewItem = true;                    
    console.log("* push_inputButton => Verlassen ");  
  }


/**
  * Update-Button in der Row gedrückt
  * @param {number} rowIx Zeilenindex
  * @return {}
  */
  function push_updateButton(rowIx) {
    console.log(`* push_updateButton => Eintritt `);    
    rowId                  = todoList.value[rowIx].Id;               // über den rowIx die rowId auslesen und sichern       
    row_Bezeichnung.value  = todoList.value[rowIx].Bezeichnung;      // und die Werte der Row in das Formular übernehmen
    row_Prio.value         = todoList.value[rowIx].Prio;
    row_Endedatum.value    = todoList.value[rowIx].Endedatum;
    row_Fortschritt.value  = todoList.value[rowIx].Fortshritt;    
    
    isNewItem = false;                                    // Schalter für ein Update setzen   
    console.log("* Update einer Zeile; rowId = " , rowIx ,  ", rowId = " , rowId ); //Achtung: die Variablen enthalten Zahlen; keine Verkettung mit String
    console.log("* push_updateButton => Verlassen ");
    isOpen = true;                                        // Formular öffnen
    // Hier ist Schluss - jetzt können die Werte im Formular bearbeitet werden    
  }


/** Function
* Fkt. wird ausgeführt, Accordeon öffnen oder schließen
*/
  function toggleAnswer()  {
      console.log('toggleAnswer');
      isOpen.value = !isOpen.value
  }


/** Function
* Fkt. wird ausgeführt, nachdem die Page von Vue geladen wurde
*/
  onMounted( () => {
    console.log(`* Component mounted: ToDoList`);  
    read_todolist();  // Einlesen der Daten aus der DB
    }
  );
  
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
h2 {
  text-align: center;
}

/*  Accordion für das Eingabe-Formular                */

.accordion {
  border:  solid rgb(178, 210, 247);
}
.accordion-header {
  /* width: 90%; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 2em;
  padding-right: 2em;
  background-color: rgb(178, 210, 247); 
  cursor: pointer;
}
.accordion-title {
  font-size: larger;
}
.icon{
  /* width: 30px;alt="chevron-icon"
  height: 30px; */
  transition: transform .5s;
}
.icon img {
  width: 100%;
  height: auto;
}
.accordion-content{  
  height: 0;
  overflow: hidden;
  line-height: 1.5;
  background-color: rgb(208, 236, 245);
  transition: height .5s;
}
.accordion-content p{
  padding: 10px;
}
.accordion-content.open{  
  height: 16em;
}
.icon.open{
  transform: rotate(180deg);
}

/* Formular (innerhalb von Accordion)  */
form {
  display: flex;
  flex-direction: column;
  /* width: 95%; */
  padding-left: 1em;
  padding-right: 1em;
}
form label { 
  /* display: block; */
}
.form-control {
  width: 100%;
}
.form-text {
  margin-bottom: 1em;
}
.form-row2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1em;
  /* flex-wrap: wrap; */
}
.form-row2-col1 {
  /* flex: 25%; */
  /* min-width: 10em;  */
}
.form-row2-col2 {  
  /* flex: 25%; */
  /* min-width: 10em; */
}
.form-row2-col3 {
  /* flex: 25%; */
  /* min-width: 10em; */
}
.form-button {  
  border: none;
  display:block;  /* 2 Zeilen um den Button zu zentrieren */
  margin:0 auto;
  margin-top: 1em;
  width:8em;
  font-size: larger;
  border-radius: .5em; 
  box-shadow: 0 .2em .4em gray; 
  background-color: rgb(178, 210, 247); 
  cursor: pointer;
}


/**  die Liste                         **/
ul {
  list-style: none;                 /* keine Aufzählungszeichen                      */
  padding-left: 0;
}
/**  Ebene 0  (eine Karte) **/
.card {
  display: flex;
  flex-direction: row;
  margin-top: 1em;
  background-color: #f0f0f0;
}

/**  Ebene 1  (3 Spalten) **/
.card_prio {
  flex: 5;
  background-color: #f8d50e;
}
.card_main_wrapper {
flex: 85%;
background-color: #e0e0e0;
}
.card_cmd_wrapper {
  flex:  10%;
  background-color: #dadada;
}

/**  Ebene 2  (mittlere Spalte mit 4 Zeilen) **/
.card_main {
  display: flex;
  flex-direction: column;
}
.card_main_row1.wrapper {
  flex: 40%;
}
.card_main_row2.wrapper {
  flex: 40%;
}
.card_main_row3.wrapper {
  flex: 15%;
}
.card_main_row4.wrapper {
  flex: 5%;
}

/**  Ebene 2  (Spalte 2, Zeile 1 ) **/
.card_main_row1 {
  padding-left: 0.5em;
  font-size: larger;
}

/**  Ebene 2  (Spalte 2, Zeile 2 ) **/
.card_main_row2 {
  padding-right: 1em;
  text-align: right;
  font-size: larger;
}
/**  Ebene 2  (Spalte 2, Zeile 3 mit 3 Spalten) **/
.card_main_row3{
  display: flex;
  flex-direction: row;
  /*flex-wrap: wrap;*/
  justify-content: space-around;
  font-size: smaller;
}

/**  Ebene 2  (Spalte 3 mit 2 Zeilen) **/
.card_cmd {
  height: 100%;                           /* 100% Hohe vom Eltern-Element */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #dadada;
}
.card_cmd button {                          /* das ist der Lösch-Knopf */
  /* hier kein flex: xx% */                                 
  /* display: flex;                        der Müllkübel soll zentriert werden                       */
  /* align-items: center; */
  /* justify-content: center; */
  border: none;                         /* ohne Rand */
  background-color: #dadada;
  /* margin-right: 0.5em; */
  cursor: pointer;
}
.svg-icon-pensil {  
  width: 2em;
  height: 2em;
}
.svg-icon-pensil path {
  fill: rgb(10, 127, 223);
}
.svg-icon-trash {  
  width: 2em;
  height: 2em;
}
.svg-icon-trash path {
  fill: rgb(10,127,223);
}

/**  Ebene 3  (3 Spalten) **/
#card_main_row3_span11 {
  font-weight: bold;
}
#card_main_row3_span12 {
padding-left: 0.5em;
}
#card_main_row3_span21 {
  font-weight: bold;
}
#card_main_row3_span22 {
  padding-left: 0.5em;
}
#card_main_row3_span31 {
  font-weight: bold;
}
#card_main_row3_span32 {
  padding-left: 0.5em;
}
/**  Ebene 2  (Zeile 4 mit 4 Spalten) **/
.card_main_row4 {
  height: 0.5em;
  margin-top: 0.5em;  
}

/*********************************************************************/
/* Media Query  (immer am Ende plazieren)                                                     */
/*********************************************************************/

 /* For iPhones          : Breite=414px; Höhe=736 bei Viewport=1.0*/
 /* For Galaxy S24 Ultra : Breite=378px; Höhe=819 bei Viewport=1.0*/
 @media only screen and (max-width: 750px) {
  .accordion-content.open{  height: 20em; }
  .form-text { display: none;}
  .form-row2 { display: flex; flex-direction: column; }
  .form-row2-col1 { flex: 100%; margin-top: 1em;}
  .form-row2-col2 { flex: 100%;}
  .form-row2-col3 { flex: 100%;}
}

</style>