import Connector from '@vue-polkadot/vue-api';
import Vue from 'vue';
const defaultState = {
    identities: {},
};
const IdentityModule = {
    state: { ...defaultState },
    mutations: {
        addIdentity(state, identityRequest) {
            const { address, identity } = identityRequest;
            if (!state.identities[address]) {
                Vue.set(state.identities, address, identity);
            }
        }
        // addAvaibleOption(state: SettingsStruct, settings: Partial<SettingsStruct>) {
        // }
    },
    actions: {
        setIdentity({ commit }, identityRequest) {
            commit('addIdentity', identityRequest);
        },
        async fetchIdentity({ dispatch }, address) {
            const { api } = Connector.getInstance();
            try {
                const optionIdentity = await api.query.identity.identityOf(address);
                console.log(optionIdentity);
                const identity = optionIdentity.unwrapOr(null);
                if (identity) {
                    dispatch('setIdentity', { address, identity });
                }
            }
            catch (e) {
                console.error('[FETCH IDENTITY] Unable to get identity', e);
            }
        }
    },
    getters: {
        availableIdentities(state) {
            return state.identities;
        },
        getIdentityFor(state) {
            return (address) => state.identities[address];
        }
    }
};
export default IdentityModule;
//# sourceMappingURL=IdentityModule.js.map