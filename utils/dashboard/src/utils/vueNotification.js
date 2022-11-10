import Vue from 'vue';
/**
 * NotificationService for vue
 * @example
 * // Show success message
 * NS.success('Success')
 * @example
 * // Show info message
 * NS.info('This is info message');
 */
class NotificationService extends Vue {
    constructor() {
        super(...arguments);
        this.snackbarTypes = {
            success: {
                type: 'is-success',
                actionText: 'View',
            },
            info: {
                type: 'is-info',
                actionText: 'OK',
            },
            danger: {
                type: 'is-danger',
                actionText: 'Oh no!',
            },
        };
    }
    success(message, params) {
        this.showNotification(message, { ...this.snackbarTypes.success, ...params });
    }
    info(message, params) {
        this.showNotification(message, { ...this.snackbarTypes.info, ...params });
    }
    danger(message, params) {
        this.showNotification(message, { ...this.snackbarTypes.danger, ...params });
    }
    /**
     * Show error message
     */
    error(message, params) {
        this.danger(message, params);
    }
    showNotification(message, params = this.snackbarTypes.info) {
        this.$buefy.snackbar.open({
            duration: 10000,
            message,
            type: 'is-success',
            position: 'is-top-right',
            actionText: 'OK',
            queue: false,
            ...params,
        });
    }
}
const bus = new NotificationService();
export default bus;
//# sourceMappingURL=vueNotification.js.map