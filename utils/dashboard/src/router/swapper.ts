import { apiEnabled } from '@/routeGuard';

const Swapper = () => import('@/components/transfer/Swapper.vue');

export default [
    {
        path: '/swapper',
        name: 'swapper',
        component: Swapper,
        beforeEnter: apiEnabled,
      },
      {
        path: '/swapper/at/:at',
        name: 'swapperAt',
        component: Swapper,
        // beforeEnter: apiEnabled,
      },
]

