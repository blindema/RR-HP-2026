import { createRouter, createWebHistory } from 'vue-router'
import HomeView     from '../views/HomeView.vue'
import SystemView   from '../views/SystemView.vue'
import ListenView   from '../views/ListenView.vue'
import ListView     from '../views/ListView.vue'
import ToDoView     from '../views/ToDoView.vue'
import RememberView from '../views/RememberView.vue'
import NotizenView  from '../views/NotizenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView             // Übersicht der verfügbaren Anwendungen
    },
    {
      path: '/System',
      name: 'system',
      component: SystemView           // Stellt Informationen zum System bereit
    },
    {
      path: '/Listen',
      name: 'lists',
      component: ListenView           // Übersicht der erstellten Listen
    },
    {
      path: '/Listen/:id',
      name: 'listitems',
      component: ListView             // Zeigt den Inhalt einer Liste an
    },
    {
      path: '/Aufgaben',
      name: 'to-do',
      component: ToDoView             // Zeigt die anstehenden Aufgaben an
    },
    {
      path: '/Erinnerungen',
      name: 'remember',
      component: RememberView         // Zeigt die gespeicherten Erinnerungen an
    },
    {
      path: '/Notizen',
      name: 'notizen',
      component: NotizenView          // Übersicht der erstellten Notizen
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
