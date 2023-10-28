import { SettingsStruct, Option, AvaibleOptions } from './types';
declare const SettingModule: {
    state: {
        apiUrl: string | undefined;
        camera: string;
        i18nLang: string;
        icon: string;
        ledgerConn: string;
        locking: string;
        prefix: number;
        uiMode: string;
        uiTheme: string;
        avaibleOptions: AvaibleOptions;
    };
    mutations: {
        setSettings(state: SettingsStruct, settings: Partial<SettingsStruct>): void;
        createNode(state: SettingsStruct, nodeOption: Option): void;
    };
    actions: {
        setSettings({ commit }: any, settings: Partial<SettingsStruct>): void;
        setApiUrl({ commit }: any, apiUrl: string): void;
        setLanguage({ commit }: any, i18nLang: string): void;
        setLocking({ commit }: any, locking: string): void;
        setPrefix({ commit }: any, prefix: string): void;
        setUiTheme({ commit }: any, uiTheme: string): void;
        setUiMode({ commit }: any, uiMode: string): void;
        setIcon({ commit }: any, icon: string): void;
        addNode({ commit }: any, nodeOption: Option): void;
    };
    getters: {
        availableNodes(state: SettingsStruct): Option[];
        availableLanguages(state: SettingsStruct): Option[];
        availableCryptos(state: SettingsStruct): Option[];
        availableLocking(state: SettingsStruct): Option[];
        availablePrefixes(state: SettingsStruct): Option[];
        availableUiModes(state: SettingsStruct): Option[];
        availableUiThemes(state: SettingsStruct): Option[];
        availableIcons(state: SettingsStruct): Option[];
        getSettings({ avaibleOptions, ...rest }: SettingsStruct): {
            apiUrl: string | undefined;
            camera: string;
            i18nLang: string;
            icon: string;
            ledgerConn: string;
            locking: string;
            prefix: number;
            uiMode: string;
            uiTheme: string;
        };
    };
};
export default SettingModule;
