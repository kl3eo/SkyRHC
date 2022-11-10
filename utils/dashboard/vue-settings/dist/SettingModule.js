var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { CRYPTOS, ENDPOINT_DEFAULT, ENDPOINTS, LANGUAGE_DEFAULT, LOCKING_DEFAULT, LOCKING, PREFIX_DEFAULT, PREFIXES, UIMODE_DEFAULT, UIMODES, UITHEME_DEFAULT, UITHEMES, ICONS, ICON_DEFAULT, CAMERA_DEFAULT, LEDGER_CONN_DEFAULT, CAMERA, LEDGER_CONN } from './defaults/index';
const avaibleOptions = {
    nodes: ENDPOINTS,
    cryptos: CRYPTOS,
    languages: [],
    locking: LOCKING,
    prefixes: PREFIXES,
    uiModes: UIMODES,
    uiThemes: UITHEMES,
    icons: ICONS,
    cameras: CAMERA,
    ledgers: LEDGER_CONN,
};
const defaultState = {
    apiUrl: ENDPOINT_DEFAULT,
    camera: CAMERA_DEFAULT,
    ledgerConn: LEDGER_CONN_DEFAULT,
    i18nLang: LANGUAGE_DEFAULT,
    icon: ICON_DEFAULT,
    locking: LOCKING_DEFAULT,
    prefix: PREFIX_DEFAULT,
    uiMode: UIMODE_DEFAULT,
    uiTheme: UITHEME_DEFAULT,
    avaibleOptions: avaibleOptions
};
const SettingModule = {
    state: Object.assign({}, defaultState),
    mutations: {
        setSettings(state, settings) {
            Object.keys(settings).map((key) => {
                state[key] = settings[key];
            });
        },
        createNode(state, nodeOption) {
            state.avaibleOptions.nodes = [...state.avaibleOptions.nodes, nodeOption];
        }
        // addAvaibleOption(state: SettingsStruct, settings: Partial<SettingsStruct>) {
        // }
    },
    actions: {
        setSettings({ commit }, settings) {
            commit('setSettings', settings);
        },
        setApiUrl({ commit }, apiUrl) {
            commit('setSettings', { apiUrl });
        },
        setLanguage({ commit }, i18nLang) {
            commit('setSettings', { i18nLang });
        },
        setLocking({ commit }, locking) {
            commit('setSettings', { locking });
        },
        setPrefix({ commit }, prefix) {
            commit('setSettings', { prefix });
        },
        setUiTheme({ commit }, uiTheme) {
            commit('setSettings', { uiTheme });
        },
        setUiMode({ commit }, uiMode) {
            commit('setSettings', { uiMode });
        },
        setIcon({ commit }, icon) {
            commit('setSettings', { icon });
        },
        addNode({ commit }, nodeOption) {
            if (nodeOption.value && nodeOption.text) {
                commit('createNode', nodeOption);
            }
        }
    },
    getters: {
        availableNodes(state) {
            return state.avaibleOptions.nodes;
        },
        availableLanguages(state) {
            return state.avaibleOptions.languages;
        },
        availableCryptos(state) {
            return state.avaibleOptions.cryptos;
        },
        availableLocking(state) {
            return state.avaibleOptions.locking;
        },
        availablePrefixes(state) {
            return state.avaibleOptions.prefixes;
        },
        availableUiModes(state) {
            return state.avaibleOptions.uiModes;
        },
        availableUiThemes(state) {
            return state.avaibleOptions.uiThemes;
        },
        availableIcons(state) {
            return state.avaibleOptions.icons;
        },
        getSettings(_a) {
            var { avaibleOptions } = _a, rest = __rest(_a, ["avaibleOptions"]);
            return rest;
        }
    }
};
export default SettingModule;
