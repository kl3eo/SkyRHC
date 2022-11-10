import { __decorate } from "tslib";
import { Component, Vue } from 'vue-property-decorator';
/*
* refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
* import { Component, Mixins } from 'vue-property-decorator';
* class ExtendedClass extends Mixins(ActualMixin) {
*/
let ExtrinsicMixin = class ExtrinsicMixin extends Vue {
    constructor() {
        super(...arguments);
        this.fnSection = '';
        this.fnMethod = '';
        this.args = [];
        this.selectedArguments = {};
        this.section = {};
    }
    get sections() {
        return Object.keys(this.section).sort();
    }
    setSection(section) {
        this.section = section;
    }
    get methods() {
        return this.fnSection
            // @ts-ignore: Method has always value
            ? Object.keys(this.section[this.fnSection]).sort()
            : [];
    }
    get params() {
        console.log(this.args);
        return this.args;
    }
    handleSectionSelection(value) {
        this.fnSection = value;
    }
    handleMethodSelection(value) {
        this.fnMethod = value;
    }
    setArgs(args) {
        this.args = args;
    }
    handleSelectedArguments(value) {
        this.selectedArguments = {
            ...this.selectedArguments,
            ...value,
        };
    }
    hasArgs() {
        return this.args && this.args.length > 0;
    }
    getSection() {
        // @ts-ignore: Method has always value
        return this.section[this.fnSection][this.fnMethod];
    }
    getFnSection() {
        // @ts-ignore: Method has always value
        return this.section[this.fnSection];
    }
    argMapper(arg) {
        const accessor = arg.name.toString();
        // @ts-ignore: Method has always value
        return this.selectedArguments[accessor];
    }
    mapArgs() {
        return this.args.map(this.argMapper);
    }
    getFnMethodAndSection() {
        const { fnMethod, fnSection } = this;
        return { fnMethod, fnSection };
    }
};
ExtrinsicMixin = __decorate([
    Component
], ExtrinsicMixin);
export default ExtrinsicMixin;
//# sourceMappingURL=extrinsicsMixin.js.map