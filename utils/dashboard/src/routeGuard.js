import Connector from '@vue-polkadot/vue-api';
import { NotificationProgrammatic as Notification } from 'buefy';
export const apiEnabled = (to, from, next) => {
  if (Connector.getInstance().api) {
    next();
  } else {
	Notification.open({duration: 2000,message: `Please wait.. loading`,queue: false,type: 'is-info',position: 'is-top-right',});
	setTimeout(() => {if (Connector.getInstance().api) {
		next();
	} else {
		Notification.open({duration: 2000,message: `Please wait.. loading`,queue: false,type: 'is-info',position: 'is-top-right',});
		setTimeout(() => {if (Connector.getInstance().api) {
				next();
			} else {
				next({ name: 'landing' })
				Notification.open({duration: 3000,message: `Please wait.. loading<br>api takes time`,queue: false,type: 'is-danger',position: 'is-top-right',});
                	}
                },2000);
        }}, 2000);
  }
};
//# sourceMappingURL=routeGuard.js.map
