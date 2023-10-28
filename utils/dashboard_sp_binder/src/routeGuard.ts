import Connector from '@vue-polkadot/vue-api';
import { NotificationProgrammatic as Notification } from 'buefy';
import Router from 'vue-router';

export const apiEnabled = (to: any, from: any, next: any) => {
//const ti = this.$isMobile() ? 5000 : 2000;
const ti = 4000;
  if (Connector.getInstance().api) {
    next();
  } else {
	Notification.open({duration: ti,message: `Please wait.. loading`,queue: false,type: 'is-info',position: 'is-top-right',});
	setTimeout(() => {if (Connector.getInstance().api) {
		next();
	} else {
		Notification.open({duration: ti,message: `Please wait.. loading`,queue: false,type: 'is-info',position: 'is-top-right',});
		setTimeout(() => {if (Connector.getInstance().api) {
				next();
			} else {
				Notification.open({duration: ti,message: `Please wait.. loading`,queue: false,type: 'is-info',position: 'is-top-right',});
				setTimeout(() => {if (Connector.getInstance().api) {
						next();
					} else {
						next({ name: 'landing' })
						Notification.open({duration: 3000,message: `Please wait.. loading<br>api takes time`,queue: false,type: 'is-danger',position: 'is-top-right',});
					}}, ti);
                	}}, ti);
        }}, ti);
  }
};
