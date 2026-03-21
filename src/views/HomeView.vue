<!------------------------------------------------------------------------------->
<!--  HomeView (Landing-Page)                                                  -->
<!--  Übersicht über die vorhandenen Anwendungen                               -->
<!------------------------------------------------------------------------------->
<template>
  <main>
    <h1>Verfügbare Module</h1>
    <div class="cards">
      <div v-for="(row, ix) in anwendungen_T" :key="ix" @click="router.push(`/${row.Name}`)" :id="'Row' + ix" class="card">           
        <h3> {{ row.Name }} </h3>             
      </div>
    </div>    
  </main>
</template> 


<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import axios from 'axios'

import { useRRStore } from "../stores/store";
const myRRStore = useRRStore();

// Import Credentials für den DB-Zugriff
import * as config from '../dbCredentials.js';

const router = useRouter();

let anwendungen_T = ref([]);        // Array für die Anwendungen (Sätze aus der DB gelesen und sortiert)



//********************************** */
//*  Funktionen                      */
//********************************** */


onMounted( () => {
    console.log(`* Component mounted: HomeView`);  
    const endpoint = 'rrhp/selectAnwendungen';
    const queryParam = '';  //zB ?fkt=1
    const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;
    console.log("URL: " + fullUrl);
   
    axios({
      method: 'get',
      url: fullUrl
    })     
    .then( function (response) {
      console.log('Response: ', response);
      let rows = response.data;
      rows.sort((a, b) => a.Rang - b.Rang);       // Rows nach Spalte Rang sortieren (==> Onenote)
      anwendungen_T.value = rows;                 // Übergabe der sortierten Sätze (siehe Onenote)
      myRRStore.lade_anwendungen(rows);           // Laden des Array myRRStore.anwendungen
    })
    .catch( function (error) { 	                  // handle error
      console.log(error);
    })
    .finally( function () {                       // always executed
    });   
  }
);
</script>


<style scoped>
main {
  /* background-color: #eee; */
  margin-left: auto;
  margin-right: auto;
  width: 95%;
  height: 100vh; 
  background-color: #f6f6f6; 
}
h1 {
  text-align: center;
  color: blue;
}
.cards {  /* Ist eine Flexbox und enthält die 3 Aufgaben (.card) */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around ;
  margin-top: 1em;
}
/* der Text (hier eine h3) wird am besten formatiert, wenn man .card auch als Flexbox deklariert */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-around ;
  width: 10em;  
  height: 3em;
  margin: 1em;
  text-align: center;  
  color: darkblue;
  background-color:azure;  
  cursor: pointer;
}

</style>