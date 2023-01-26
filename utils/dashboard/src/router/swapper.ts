import { apiEnabled } from '@/routeGuard';

const Swapper = () => import('@/components/transfer/Swapper.vue');

export default [
    {
        path: '/swapper',
        name: 'swapper',
        component: Swapper,
        beforeEnter: apiEnabled,
      },
]

