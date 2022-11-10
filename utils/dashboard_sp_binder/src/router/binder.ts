import { apiEnabled } from '@/routeGuard';

const Binder = () => import(/* webpackChunkName:'binder' */ '@/components/transfer/Binder.vue');

export default [
    {
        path: '/binder',
        name: 'binder',
        component: Binder,
        beforeEnter: apiEnabled,
      },
      ]
