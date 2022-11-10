import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './icons';

import shortAddress from './utils/shortAddress';
import VueClipboard from 'vue-clipboard2';
import formatBalance from '@/utils/formatBalance'
import { toString, toNumber, toPercent } from '@/utils/filters'
import keyring from '@polkadot/ui-keyring';
import './registerServiceWorker'
import App from './App.vue';
import store from './store';
import router from './router';
import Connector from '@vue-polkadot/vue-api';
import 'setimmediate';
import Notifications from 'vue-notification'
//import FullpageModal from 'vue-fullpage-modal';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.filter('shortAddress', shortAddress);

(window as any).C = Connector; 
(window as any).K = keyring; 
// Connector.createInstance(store.state.setting.apiUrl);
Vue.prototype.$http = Connector.getInstance(); 


Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultIconComponent: 'vue-fontawesome',
  defaultFieldLabelPosition: 'inside',
  customIconPacks: {
    fas: {
      sizes: {
        'default': '',
        'is-small': '1x',
        'is-medium': '2x',
        'is-large': '3x',
      },
    },
  },
});

Vue.filter('formatBalance', formatBalance)
Vue.filter('toString', toString)
Vue.filter('toNumber', toNumber)
Vue.filter('toPercent', toPercent)

Vue.use(VueClipboard);
Vue.use(Notifications);
//Vue.use(FullpageModal);
Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
