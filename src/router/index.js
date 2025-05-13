import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue'
import AppReg from '../components/AppReg.vue'
import AppSendEmail from '../components/AppSendEmail.vue'
import AppSearchFilters from '../components/AppSearchFilters.vue'
import AppCreateAnnouncement from '../components/AppCreateAnnouncement.vue'
import AppAnnouncement from '../components/AppAnnouncement.vue'
import AppTest from '../components/AppTest.vue'

const routes = [
  {
    path: '/',
    component: () => import('../components/AppMainPage.vue'),
  },
  {
    path: '/reg',
    name: 'reg',
    component: () => import('../components/AppReg.vue'),
  },
  {
    path: '/email',
    component: () => import('../components/AppSendEmail.vue'),
  },
  {
    path: '/filters-search',
    name: 'filters',
    component: () => import('../components/AppSearchFilters.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../components/AppTest.vue'),
  },
  {
    path: '/create_announ',
    name: 'create',
    component: () => import('../components/AppCreateAnnouncement.vue'),
  },
  {
    path: '/announ/:id',  // Добавляем параметр :id
    name: 'announ',
    component: () => import('../components/AppAnnouncement.vue'),
    props: true  // Передаем параметры как props
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../components/AppProfile.vue'),
  },

  {
    path: '/reviews/:realtyId',
    name: 'RealtyReviews',
    component: () => import('../components/RealtyReviews.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
