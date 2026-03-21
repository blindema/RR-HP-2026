<!------------------------------------------------------------------------------->
<!--  ListView                                                                 -->
<!--  Zeigt den Inhalt einer Liste an .                                        -->
<!--  Select, Insert, Update und Delete sind integriert                        -->
<!------------------------------------------------------------------------------->
<template>
  <main class="list">
    <h1>Liste {{ myRRStore.listen[listId - 1].name }}</h1>
    <!-- ein Objekt mit den Listennamen im Store vorhalten; Anwendungen auch so -->

    <form id="form">
      <div class="form_row">
        <input v-model="inputString" id="formInputItem" type="text" name="newItem" class="form-control">
        <button @click="pushInputButton()" id="formButton" type="button">
          <img src="../assets/checkbox_apply.png">
        </button>
      </div>
      <!-- <input type="number" class="form-control" id="formRowId" value="-1"  hidden> -->
    </form>

    <ul>
      <li v-for="(row, ix) in liste" :key="ix" :id="ix" :class="row.Checked == true ? 'checked' : ''">

        <!-- <button title="checkButton" @click="setChecked(ix)"> -->
        <button title="checkButton" @click="upd_checkKZ(ix)">
          <svg v-if="row.Checked == true" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960"
            width="24">
            <path style=" fill: rgb(10, 200, 40);"
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q8 0 15 1.5t14 4.5l-74 74H200v560h560v-266l80-80v346q0 33-23.5 56.5T760-120H200Zm261-160L235-506l56-56 170 170 367-367 57 55-424 424Z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path style="fill: rgb(170, 170, 170)"
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
          </svg>
        </button>

        <!-- <div @click="selectListRow(ix)" class="li_content"> {{ row.content }} </div> -->
        <div @click="selectListRow(ix)" class="li_content"> {{ row.Content }} </div>
        <div class="li_datum"> {{ dat_kurz2(row.Created) }} </div>

        <!-- <button @click="delRow(listId, ix)" title="remove item">-->
        <button @click="del_row(ix)" title="remove item">
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none"
              d="M7.083,8.25H5.917v7h1.167V8.25z M18.75,3h-5.834V1.25c0-0.323-0.262-0.583-0.582-0.583H7.667c-0.322,0-0.583,0.261-0.583,0.583V3H1.25C0.928,3,0.667,3.261,0.667,3.583c0,0.323,0.261,0.583,0.583,0.583h1.167v14c0,0.644,0.522,1.166,1.167,1.166h12.833c0.645,0,1.168-0.522,1.168-1.166v-14h1.166c0.322,0,0.584-0.261,0.584-0.583C19.334,3.261,19.072,3,18.75,3z M8.25,1.833h3.5V3h-3.5V1.833z M16.416,17.584c0,0.322-0.262,0.583-0.582,0.583H4.167c-0.322,0-0.583-0.261-0.583-0.583V4.167h12.833V17.584z M14.084,8.25h-1.168v7h1.168V8.25z M10.583,7.083H9.417v8.167h1.167V7.083z">
            </path>
          </svg>
        </button>
      </li>
    </ul>

  </main>
</template>


<script setup>
// Imports 
import { onMounted, ref } from 'vue';
//import {ref}         from 'vue';
import axios from 'axios';

// Imports from Router
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
console.log(route.params);

// Imports und declare from Composables
import { useData } from '../../use/useComposables.js';
const { dat_kurz, dat_kurz2, showSidebar, hideSidebar, onUnmounted } = useData();

// Imports and declare from Store
import { useRRStore } from "../stores/store";    // das ist der Store
import { storeToRefs } from "pinia";                   // Import Modul Reaktive Funktionalität von Pina
const myRRStore = useRRStore();                // Reaktive Funktionalität aktivieren
const { listen } = storeToRefs(myRRStore);       // Array listen reaktiv machen

// Imports Middleware from Toastification
import { useToast } from 'vue-toastification';         // graphische Darstellung von Hinweisen
const toast = useToast();

// Import Credentials für den DB-Zugriff
import * as config from '../dbCredentials.js';


let titel = ref('');                   // Name der Liste in h1
let liste = ref([]);                  // Array für die Items einer Liste (Sätze aus der DB gelesen)
let listId = route.params.id;          // die aktuelle Listennummer kommt aus dem URL
let inputString = ref('');             // Inhalt vom Eingabefeld
let isNewItem = true;                 // Neue oder veränderte Zeile?
let rowIdUpdate = -1;                  // Zeilennummer (rowId) beim Update


//********************************** */
//*  Funktionen                      */
//********************************** */

/**
  * Sätze aus der DB (Tabelle RRHP_ListenItems_T) lesen
  * @param {} 
  * @return ()
  */
function read_ListenItems() {
  const endpoint = 'rrhp/selectListenItems';
  const queryParam = '';  //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;

  console.log(`* read ListenItems => Eintritt `);
  console.log(`Zusammengebaute URL: ${fullUrl}`);

  axios({
    method: 'get',
    url: fullUrl,
    params: { listen_id: route.params.id },     // Listen-Nummer aus der URL verschickt als 'query' nicht 'body'

  })
    .then(function (response) {
      console.log('Response: ', response);
      liste.value = response.data;
      //console.log('ListItems: ', liste.value);
    })
    .catch(function (error) { 	// handle error
      console.log(error);
    })
    .finally(function () {      // always executed
    });
}

/**
  * Neuen Satz in die DB (Tabelle RRHP_ListenItems_T) schreiben
  * @param {} 
  * @return ()
  */
function add_row() {
  const endpoint = 'rrhp/insertListenItems';
  const queryParam = '';  //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;

  console.log("* add_row => Eintritt ");
 
  axios({
    method: 'post',
    url: fullUrl,
    data: {
      new_item: inputString.value,
      listen_id: route.params.id
    }
  })
    .then(function (response) {
      console.log('Response: ', response);
      liste.value = response.data;
      inputString.value = '';                        // Eingabefeld leeren
      toast.success('Row added');
    })
    .catch(function (error) { 	// handle error
      console.log(error);
    })
    .finally(function () {      // always executed
    });

  console.log("* add_row => Austritt ");
}


/**
  * Satz aus der DB (Tabelle RRHP_ListenItems_T) löschen
  * @param {number} row_ix 
  * @return ()
  */
function del_row(row_ix) {
  const endpoint = 'rrhp/deleteListenItems';
  const queryParam = '';  //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;

  console.log("* del_row => Eintritt ");
  console.log('row_ix in der Tabelle: ', row_ix);
  console.log('Row_Id im Datensatz: ', liste.value[row_ix].Id);
  
  axios({
    method: 'post',
    url: fullUrl,
    data: {
      row_id: liste.value[row_ix].Id,
      listen_id: route.params.id
    }
  })
    .then(function (response) {
      console.log('Response: ', response);
      liste.value = response.data;
      toast.success('Row deleted');
    })
    .catch(function (error) { 	// handle error
      console.log(error);
    })
    .finally(function () {      // always executed
    });

  console.log("* del_row => Austritt ");
}


/**
  * Einen Satz in der DB (Tabelle RRHP_ListenItems_T) ändern
  * @param {number} rowId 
  * @return ()
  */
function upd_row(rowId) {
  const endpoint = 'rrhp/updateListenItems';
  const queryParam = '';  //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;

  console.log("* upd_row => Eintritt ");
  //console.log('row_ix in der Tabelle: ', row_ix);  
  console.log('  Row_Id im Datensatz: ', rowId);
  console.log('* AXIOS Post ==> db-update_ListenItems.php');
 

  axios({
    method: 'post',
    url: fullUrl,
    data: {
      row_id: rowId,
      upd_item: inputString.value.trim(),
      listen_id: route.params.id
    }
  })
    .then(function (response) {
      console.log('Response: ', response);
      liste.value = response.data;
      toast.success('Row updated');
    })
    .catch(function (error) { 	// handle error
      console.log(error);
    })
    .finally(function () {      // always executed
    });

  console.log("* upd_row => Austritt ");
}


/**
  * Checked-Button wurde gedrückt
  * Check-KZ in einem Satz in der DB (Tabelle RRHP_ListenItems_T) ändern
  * @param {} 
  * @return ()
  */
function upd_checkKZ(rowIx) {
  const endpoint = 'rrhp/updateCheckKzListenItems';
  const queryParam = '';  //zB ?fkt=1
  const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;

  console.log("* upd_checkKZ => Eintritt ");
  console.log(`* Statuswechsel checked: Listen_ID = ${listId}; Row_Ix = ${rowIx}`);
  let rowId = liste.value[rowIx].Id;               // über den rowIx die rowId auslesen 
  let checkKZ_old = liste.value[rowIx].Checked;    // über den rowIx das CheckKZ auslesen 
  let checkKZ = 0;
  if (checkKZ_old == 0) { checkKZ = 1; }
  else { checkKZ = 0; }

  console.log('  Row_Id im Datensatz:', rowId, '  ==>  set Checked to ', checkKZ);
  console.log('* AXIOS Post ==> db-update_CheckKZ_ListenItems.php');

  axios({
    method: 'post',
    url: fullUrl,
    data: {
      row_id: rowId,
      check_kz: checkKZ,
      listen_id: route.params.id
    },
    auth: { username: 'blindema', password: 'abcd1234' }
  })
    .then(function (response) {
      console.log('Response: ', response);
      liste.value = response.data;
      toast.success('Row updated');
    })
    .catch(function (error) { 	// handle error
      console.log(error);
    })
    .finally(function () {      // always executed
    });

  console.log("* upd_checkKz => Austritt ");
}


/**
* Input-Button (im Formular) wurde gedrückt
  * @param {} 
  * @return {} 
  */
function pushInputButton() {
  console.log("* pushInputButton => Einstieg ");

  // Ist das Eingabefeld leer, dann mache nichts
  if (inputString.value.trim() === '') {
    toast.error('Eingabefeld darf nicht leer sein!');
    console.log('Eingabefeld ist leer => No Aktion');
    console.log("* pushInputButton => Verlassen ");
    return;
  }

  // Prüfung ob ein neues Item erstellt wird oder ein bestehendes Item verändert wurde
  if (isNewItem) {                                           // neus Item (neue Zeile)  
    console.log('  Input-String: ', inputString.value);
    add_row(inputString.value.trim());
  }
  else {                                                    // geänderte Zeile
    let item = document.getElementById("formInputItem");
    item.classList.remove("input_selected");                // Hintergrund-Farbe zurücksetzten 

    upd_row(rowIdUpdate);                                   // Update in der DB anstoßen
    inputString.value = '';                                 // Feldinhalt löschen
    rowIdUpdate = -1;                                       // Initial-Wert setzen 
    isNewItem = false;                                      // Initial-Wert setzen      
  }

  console.log("* pusInputButton => Verlassen ");
}


/**
* Eine Zeile wurde angeklickt; der Content der Zeile wird bestimmt und in das Eingabefeld copiert
  * @param {string} rowIx Zeilennummer in der Tabelle
  * @return {void} 
  */
function selectListRow(rowIx) {
  console.log('selected Row (for update): ', rowIx);
  console.log('connected List Id:         ', listId);
  //hier ist es einfacher die Daten aus dem listen-Objekt auszulesen, als aus dem HTML Tag 
  //console.log(listen[rowId].content);
  inputString.value = liste.value[rowIx].Content;
  rowIdUpdate = liste.value[rowIx].Id;               // über den rowIx die rowId auslesen und sichern
  isNewItem = false;
};


/**
* Fkt. wird ausgeführt, nachdem die Page von Vue geladen wurde
*/
onMounted(() => {
  console.log(`* Component mounted: ListenView`);
  read_ListenItems();  // Einlesen der Daten aus der DB
}
);

</script>


<style scoped>
/*
/*  Darstellung einer Liste  */
main {
  /* background-color: #eee; */
  margin-left: auto;
  margin-right: auto;
  width: 24em;
  margin-top: 1em;
}

h1 {
  text-align: center;
}

/**  das Formular  **/
.form_row {
  display: flex;
  /* wird so ein flexibler Container               */
  justify-content: space-around;
  margin-bottom: 0.5em;
}

form input {
  flex: 80%;
  background-color: rgb(248, 250, 239);
  border-style: outset;
  border-radius: 1em;
  margin-left: 1em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  font-size: 22px;
}

form button {
  /* das ist der OK-Knopf */
  flex: 20%;
  border: none;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
}

form button img {
  width: 2.5em;
  height: 2.5em;
}

.input_selected {
  background-color: rgb(250, 242, 207);
  border-style: outset;
}

/**  die Liste  **/
ul {
  list-style: none;
  /* keine Aufzählungszeichen                      */
  padding-left: 0;
}

li {
  display: flex;
  margin-top: 0.6em;
  padding-left: 0.5em;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.3) 5px 5px 5px;
}

ul li input {
  /* Checkbox                                      */
  flex: 5%;
  height: 1em;
  width: 1em;
  margin-top: 0.2em;
  margin-left: 0.5em;
}

.li_content {
  flex: 70%;
  text-align: left;
  font-size: 20px;
}

.li_content:hover {
  background-color: rgb(248, 250, 239);
  cursor: pointer;
}

.li_datum {
  flex: 5%;
}

ul li button {
  /* das ist der Lösch-Knopf */
  /* hier kein flex: xx% */
  display: flex;
  /* der Müllkübel soll zentriert werden */
  align-items: center;
  justify-content: center;
  border: none;
  /* ohne Rand */
  background-color: white;
  margin-right: 0.5em;
  cursor: pointer;
}

ul .svg-icon {
  width: 1.2em;
  height: 1.2em;
}

ul .svg-icon path {
  fill: #aaa;
}
</style>