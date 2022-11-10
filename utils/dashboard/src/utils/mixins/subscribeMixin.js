import { __decorate } from "tslib";
import { Component, Vue } from 'vue-property-decorator';
/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* usage import Component, { mixins } from 'vue-class-component';
* class ExtendedClass extends mixins(SubscribeMixin) {
*/
let SubscribeMixin = class SubscribeMixin extends Vue {
    constructor() {
        super(...arguments);
        this.subs = [];
    }
    async subscribe(fn, args, callback) {
        this.subs.push(await fn(...args, callback));
    }
    beforeDestroy() {
        this.subs.forEach((sub) => sub());
    }
};
SubscribeMixin = __decorate([
    Component
], SubscribeMixin);
export default SubscribeMixin;
//# sourceMappingURL=subscribeMixin.js.map