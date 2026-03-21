<!------------------------------------------------------------------------------->
<!-- App-View                                                                  -->
<!------------------------------------------------------------------------------->

<template>
  <header>
    <nav>
      <ul class="sidebar">
        <li @click="hideSidebar">
          <RouterLink to="/" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/" active-class="active">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/System" active-class="active">System</RouterLink>
        </li>
        <li>
          <RouterLink to="/Listen" active-class="active">Listen</RouterLink>
        </li>
        <li>
          <RouterLink to="/Notizen" active-class="active">Notizen</RouterLink>
        </li>
        <li>
          <RouterLink to="/Aufgaben" active-class="active">Aufgaben</RouterLink>
        </li>
        <li>
          <RouterLink to="/about" active-class="active">About</RouterLink>
        </li>
      </ul>
      <ul>
        <li>
          <div id="divTitelHP">
            <RouterLink to="/">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 52 52">
                <title>internet</title><g id="internet"><g id="internet-2" data-name="internet">
                  <circle cx="26" cy="26" r="24" fill="#fff"/><circle cx="26" cy="26" r="17.5" fill="#26c6da"/>
                  <path d="M26,2A24,24,0,1,0,50,26,24,24,0,0,0,26,2Zm0,46.08A22.08,22.08,0,1,1,48.08,26,22.1,22.1,0,0,1,26,48.08Z" fill="#80deea"/><path d="M26,50c-5.68,0-12.9-11.3-12.9-24S20.32,2,26,2,38.9,13.3,38.9,26,31.68,50,26,50ZM26,4c-3.73,0-10.9,9.29-10.9,22S22.27,48,26,48s10.9-9.29,10.9-22S29.73,4,26,4Z" fill="#80deea"/><rect x="25" y="2" width="2" height="48" fill="#80deea"/><rect x="2" y="25" width="48" height="2" fill="#80deea"/><path d="M26,16C13.13,16,8.68,10.53,8.5,10.3L10.2,9s4.09,4.88,15.8,4.88S41.76,9,41.8,9l1.7,1.3C43.32,10.53,38.87,16,26,16Z" fill="#80deea"/><path d="M26,36C13.13,36,8.68,41.47,8.5,41.7L10.2,43s4.09-4.88,15.8-4.88S41.76,43,41.8,43l1.7-1.3C43.32,41.47,38.87,36,26,36Z" fill="#80deea"/></g></g></svg>
            </RouterLink>
            <span id="spanTitelHP">RR-HP-2026</span>
        </div>
        </li>
        <li class="hideOnMobile">
          <RouterLink to="/System" active-class="active">System</RouterLink>
        </li>
        <li class="hideOnMobile">
          <RouterLink to="/Listen" active-class="active">Listen</RouterLink>
        </li>
        <li class="hideOnMobile">
          <RouterLink to="/Notizen" active-class="active">Notizen</RouterLink>
        </li>
        <li class="hideOnMobile">
          <RouterLink to="/Aufgaben" active-class="active">Aufgaben</RouterLink>
        </li>
        <li class="hideOnMobile">
          <RouterLink to="/Erinnerungen" active-class="active">Erinnerungen</RouterLink>
        </li>
        <li class="menu-button" @click="showSidebar">
          <RouterLink to="/" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 -960 960 960" width="26">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>

  <RouterView />
</template>


<script setup>
//import { onMounted } from 'vue'
//import { RouterLink, RouterView } from 'vue-router'
//import axios from 'axios'
import { storeToRefs } from "pinia";
import { useRRStore } from "./stores/store";

const myRRStore = useRRStore();
const {bibliothek} = storeToRefs(myRRStore);

</script>


<style scoped>

/*********************************************************************/
/* Navigations-Menü                                                  */
/*********************************************************************/
nav {
  background-color: white;
  box-shadow: 3px 3px 5px rgba(0,0,0,0.1);
  padding-right: 2em;
}

/* ul als Flexbox */
nav ul {
  width: 100%;                    /*                                  */
  list-style: none;               /* ohne Aufzählungszeichen          */
  display: flex;                  /* Flexbox                          */
  justify-content: flex-end;      /* Inhalt nach rechts positioniert  */
  align-items: center;            /* vertical zentriert               */
}

/* li sind die Elemente (Items) der Flexbox */
nav li {
height: 50px;
}

/* a sind die Anker-tags */
nav a {
height: 50px;
padding: 0 30px;
text-decoration: none;
display: flex;
align-items: center;
color: black;
}

/* Hover-Effekt */
nav a:hover {
background-color: #f0f0f0;
}

/* responsive machen */
nav li:first-child {
margin-right: auto;
}

#divTitelHP {
  display: flex;
}
#spanTitelHP {
  margin-top: auto;
  margin-bottom: auto;
  font-size: large;
}

/* class sidebar */
.sidebar {
position: fixed;              /* immer an der gleichen Stelle                      */
top: 0;
right: 0;
height: 100vh;
width: 250px;                 /* orientiert sich an der Länge der Wörter der Items */
z-index: 999;                 /* immer ganz oben drauf                             */
background-color: rgba(255,255,255,0.2);
backdrop-filter: blur(10px);  /* blur ist Unschärfe für die überlagerten Elemente  */
box-shadow: -10px 0 10px rgba(0,0,0,0.1);
display: none;                /* am Anfang verstecken (schalten über JS)           */
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
}
.sidebar li {
  width: 100%;
}
.sidebar a {
  width: 100%;
}
.menu-button {
  display: none;              /* bei großem BS verstecken                          */
}

.active {
  color: purple ;
}

/*********************************************************************/
/* Media Query  (immer am Ende plazieren)                                                     */
/*********************************************************************/

 /* For iPhones          : Breite=414px; Höhe=736 bei Viewport=1.0*/
 /* For Galaxy S24 Ultra : Breite=378px; Höhe=819 bei Viewport=1.0*/
@media only screen and (max-width: 750px) {
  .hideOnMobile {
    display: none;
  }
  .menu-button {
    display: block;
  }
}

</style>
