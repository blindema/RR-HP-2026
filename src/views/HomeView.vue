<!------------------------------------------------------------------------------->
<!--  HomeView (Landing-Page)                                                  -->
<!--  Übersicht über die vorhandenen Anwendungen                               -->
<!------------------------------------------------------------------------------->
<template>
  <main>
    <header>
      <h1>Verfügbare Module</h1>
    </header>
    <div class="cards">
      <div v-for="(row, ix) in anwendungen_T" :key="ix" @click="router.push(`/${row.Name}`)" :id="'Row' + ix" class="card">
        <h3>{{ getIcon(row.Name) }} {{ row.Name }}</h3>
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

// Funktion, um Icons basierend auf dem Modulnamen zu bekommen
function getIcon(name) {
  const icons = {
    'Notizen': '📝',
    'Listen': '📋',
    'ToDo': '✅',
    'System': '⚙️',
    'About': 'ℹ️',
    'Remember': '🧠'
  };
  return icons[name] || '📱'; // Standard-Icon, wenn kein spezifisches gefunden
}



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
h1 {
  text-align: center;
  font-size: 3rem;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
}
.cards {  /* Ist eine Flexbox und enthält die 3 Aufgaben (.card) */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 2em;
}
/* der Text (hier eine h3) wird am besten formatiert, wenn man .card auch als Flexbox deklariert */
.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;  
  height: 120px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  text-align: center;
  padding: 20px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.card h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  main {
    width: 100%;
    padding: 10px;
  }
  h1 {
    font-size: 2.5rem;
  }
  .cards {
    gap: 15px;
  }
  .card {
    width: 150px;
    height: 100px;
  }
}

</style>