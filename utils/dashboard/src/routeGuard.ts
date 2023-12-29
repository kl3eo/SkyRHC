import Connector from '@vue-polkadot/vue-api';
import { NotificationProgrammatic as Notification } from 'buefy';
import Router from 'vue-router';

export const apiEnabled = (to: any, from: any, next: any) => {
  if (Connector.getInstance().api) {
    next();
  } else {
    next({ name: 'landing' })
    Notification.open({
      duration: 3000,
      message: `Please wait..trying to connect`,
      queue: false,
      type: 'is-info',
      position: 'is-top-right',
    });
  }
};
