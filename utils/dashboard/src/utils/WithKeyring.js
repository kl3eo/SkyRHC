import { __decorate } from "tslib";
import { Component, Vue } from 'vue-property-decorator';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
let WithKeyring = class WithKeyring extends Vue {
    constructor() {
        super(...arguments);
        this.keyringLoaded = false;
        this.keyringAccounts = [];
        this.keys = '';
    }
    async mountWasmCrypto() {
        await cryptoWaitReady();
        // console.log('wasmCrypto loadedX');
        this.loadKeyring();
        // console.log('keyring initX');
    }
    loadKeyring() {
        this.keyringLoaded = true;
        this.keys = keyring;
        this.mapAccounts();
    }
    mapAccounts() {
        this.keyringAccounts = keyring.getPairs();
    }
    mounted() {
        this.mountWasmCrypto();
    }
    getPair(address) {
        return keyring.getPair(address);
    }
    vueU8aToHex(publicKey) {
        return u8aToHex(publicKey);
    }
};
WithKeyring = __decorate([
    Component
], WithKeyring);
export default WithKeyring;
//# sourceMappingURL=WithKeyring.js.map