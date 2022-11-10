import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import SettingModule from '@vue-polkadot/vue-settings';
import Connector from '@vue-polkadot/vue-api';
import IdentityModule from './vuex/IdentityModule';
const vuexLocalStorage = new VuexPersist({
    key: 'vuex',
    storage: window.sessionStorage,
});
const apiPlugin = (store) => {
    const { getInstance: Api } = Connector;
    Api().on('connect', async (api) => {
        const { chainSS58, chainDecimals, chainToken } = api.registry;
        const { genesisHash } = api;
        console.log('[API] Connect to <3', store.state.setting.apiUrl, { chainSS58, chainDecimals, chainToken, genesisHash });
        store.commit('setChainProperties', {
            ss58Format: chainSS58 || 42,
            tokenDecimals: chainDecimals || 12,
            tokenSymbol: chainToken || 'Unit',
            genesisHash: genesisHash || ''
        });
        const nodeInfo = store.getters.availableNodes
            .filter((o) => o.value === store.state.setting.apiUrl)
            .map((o) => { return o.info; })[0];
        store.commit('setExplorer', { 'chain': nodeInfo });
    });
    Api().on('error', async (error) => {
        store.commit('setError', error);
        console.warn('[API] error', error);
    });
};
const myPlugin = (store) => {
    const { getInstance: Api } = Connector;
    Api().connect(store.state.setting.apiUrl);
    store.subscribeAction(({ type, payload }, _) => {
        if (type === 'setApiUrl' && payload) {
            store.commit('setLoading', true);
            Api().connect(payload);
        }
    });
    // // called when the store is initialized
    // store.subscribe(({ type, payload }: any, state: any) => {
    //   if (type === 'setSettings' && payload.apiUrl) {
    //     Connector.getInstance().changeApiUrl(payload.apiUrl);
    //   }
    // });
};
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        loading: false,
        keyringLoaded: false,
        chainProperties: {},
        explorer: {},
        explorerOptions: {},
        development: {},
        error: null,
    },
    mutations: {
        keyringLoaded(state) {
            state.keyringLoaded = true;
        },
        setChainProperties(state, data) {
            state.chainProperties = Object.assign({}, data);
        },
        setDevelopment(state, data) {
            state.development = Object.assign(state.development, data);
        },
        setExplorer(state, data) {
            state.explorer = Object.assign(state.explorer, data);
        },
        setExplorerOptions(state, data) {
            state.explorerOptions = Object.assign({}, data);
        },
        setLoading(state, toggleTo) {
            state.loading = toggleTo;
        },
        setError(state, error) {
            state.loading = false;
            state.error = error.message;
        }
    },
    getters: {
        getChainProperties: ({ chainProperties }) => chainProperties
    },
    modules: {
        setting: SettingModule,
        identity: IdentityModule,
    },
    plugins: [vuexLocalStorage.plugin, apiPlugin, myPlugin],
});
//# sourceMappingURL=store.js.map