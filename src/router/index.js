import {createRouter, createWebHistory} from 'vue-router';

import { memberRouter } from './MemberRouter';
import HomeView from '@/views/common/HomeView.vue';
import {reservationRouter} from './reservationRouter';
import { wodRouter } from './wodRouter';
import { postRouter } from './poardRouter';

const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: HomeView
    },
    ...memberRouter,
    ...reservationRouter,
    ...wodRouter,
    ...postRouter
]

const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router;