<!------------------------------------------------------------------------------->
<!--  ListenView                                                               -->
<!--  Übersicht über die vorhandenen Listen                                    -->
<!------------------------------------------------------------------------------->
<template>
  <main>
    <h1>Verfügbare Listen</h1>
    <ul>
      <li v-for="(row, ix) in listen_T" :key="ix" :id="'Row' + ix" class="card">
        <div id="pic" class="flex-item-pic">
          <Router-Link :to="`/Listen/${ix + 1}`" href="">
            <img :src="'src/assets/' + row.Src">
          </Router-Link>
        </div>
        <div id="data" class="flex-item-data">
        <p id="item-data-name"> {{ row.Name }} </p>
        <p> Update: {{ dat_kurz2(row.Updated) }} </p> 
        <p> Items : {{ row.Anz }} </p> 
        </div>
      </li>
    </ul>
    <br />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'  
import { ref } from 'vue'
import axios from 'axios'

// Importieren und declarieren der Composables
import { useData } from '../../use/useComposables.js'
const { dat_kurz, showSidebar, hideSidebar, onUnmounted} = useData();

// Importieren und declarieren vom Store
import { useRRStore } from "../stores/store";    // das ist der Store
const myRRStore = useRRStore();                    // Reaktive Funktionalität aktivieren    

// Import Credentials für den DB-Zugriff
import * as config from '../dbCredentials.js';

let listen_T = ref([]);                 // Array für die Listen (Sätze aus der DB gelesen) 


// setzt den yyyy-mm-dd hh:mm:ss-Timestamp in 'dd.mm.yyyy' um
function dat_kurz2 (arg)  {
    return  arg.substring(8,10) + '.' + arg.substring(5,7) + '.'  + arg.substring(0,4);    // Tag und Monat
}

onMounted( () => {
    console.log(`* Component mounted: ListenView`);  
    const endpoint = 'rrhp/selectListen';
    const queryParam = '';  //zB ?fkt=1
    const fullUrl = `${config.protocol}://${config.host}:${config.port}/${config.path}/${endpoint}${queryParam}`;
   
    axios({
      method: 'get',
      url: fullUrl
    })     
    .then( function (response) {
      console.log('Response: ', response);
      listen_T.value = response.data;      
      console.log('Listen: ', listen_T.value);
      myRRStore.lade_listen(response.data);          // Laden des Array myRRStore.listen
    })
    .catch( function (error) { 	// handle error
      console.log(error);
    })
    .finally( function () {      // always executed
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
}
h1 {
  text-align: center;
}
li {
  display: flex;
  flex-direction: row;
  height: 10em;
  box-shadow: 10px 20px 15px silver;
  border: 1px solid;
	border-radius: 20px;
  /* box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px; */
  margin-top: 2em;
}
li:hover {
  box-shadow: 10px 20px 15px rgb(165, 243, 165);
  
      }
.flex-item-pic {
  flex-basis: 50%;
  margin-top: auto;
  margin-bottom: auto;
  cursor: pointer;
}
.flex-item-data {
  flex-basis: 50%;
  margin-top: auto;
  margin-bottom: auto;
}
img {
  width: 8em;  
  padding: 1em;
}
#item-data-name {
font-size: x-large;
}

</style>



