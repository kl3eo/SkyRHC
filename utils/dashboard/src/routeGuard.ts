import Connector from '@vue-polkadot/vue-api';
import { NotificationProgrammatic as Notification } from 'buefy';
import Router from 'vue-router';

export const apiEnabled = (to: any, from: any, next: any) => {
  if (Connector.getInstance().api) {
    next();
  } else {
    next({ name: 'landing' })
    Notification.open({
      duration: 7000,
      message: `API is not connected yet. <br> Please wait..trying to connect`,
      queue: false,
      type: 'is-danger',
      position: 'is-top-right',
    });
  }
};
