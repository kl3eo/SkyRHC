export declare type Option = {
    disabled?: boolean;
    info: string;
    text: string;
    value: string | number;
};
export interface SettingsStruct {
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
}
export interface AvaibleOptions {
    nodes: Option[];
    cryptos: Option[];
    languages: Option[];
    locking: Option[];
    prefixes: Option[];
    uiModes: Option[];
    uiThemes: Option[];
    icons: Option[];
    ledgers: Option[];
    cameras: Option[];
}
