import keyring from '@polkadot/ui-keyring';
const exec = async (account, password, callback, params) => {
    try {
        const transfer = await callback(...params);
        const alicePair = keyring.getPair(typeof account === 'string' ? account : account.address);
        if (password) {
            alicePair.decodePkcs8(password);
        }
        const hash = await transfer.signAndSend(alicePair);
        return hash.toHex();
    }
    catch (err) {
        throw err;
    }
};
export default exec;
//# sourceMappingURL=transactionExecutor.js.map