import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from './views/Login.vue'
import HomePage from './views/HomePage.vue'
import ProloguePage from './views/Prologue.vue'
import CorridorPage from './views/Corridor.vue'
import AnalysisRoomPage from './views/AnalysisRoom.vue'
import ClueDetailPage from './views/ClueDetail.vue'
import CommissionerOfficePage from './views/CommissionerOffice.vue'
import FinalEndPage from './views/FinalEnd.vue'

const routes = [
    {path: '/', component: HomePage },
    {path: '/start', component: LoginPage },
    {path: '/prologue', component: ProloguePage },
    {path: '/corridor', component: CorridorPage },
    {path: '/analysis-room', component: AnalysisRoomPage },
    {path: '/commissioner-office', component: CommissionerOfficePage },
    {path: '/finalend', component: FinalEndPage },
    {path: '/clue/:pid', component: ClueDetailPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;