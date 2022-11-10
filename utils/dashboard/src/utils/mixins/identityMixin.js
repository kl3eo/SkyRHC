import Vue from 'vue';
export default class IdentityMixin extends Vue {
    async identityOf(address) {
        const identity = this.$store.getters.getIdentityFor(address);
        if (identity) {
            return Promise.resolve(identity);
        }
        return await this.$store.dispatch('fetchIdentity', address)
            .then(() => this.$store.getters.getIdentityFor(address))
            .then(id => id || {});
    }
}
//# sourceMappingURL=identityMixin.js.map