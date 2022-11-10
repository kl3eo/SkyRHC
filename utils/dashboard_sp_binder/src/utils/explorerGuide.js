const urlBuilderBlockNumber = (value, chain, provider) => {
    if (provider === 'subscan') {
        return `https://${chain}.${provider}.io/block/${value}`;
    }
    if (provider === 'polkascan') {
        return `https://${provider}.io/pre/${chain}/block/${value}`;
    }
};
const urlBuilderAccount = (value, chain, provider) => {
    if (provider === 'subscan') {
        return `https://${chain}.${provider}.io/account/${value}`;
    }
    if (provider === 'polkascan') {
        return `https://${provider}.io/pre/${chain}/account/${value}`;
    }
};
const urlBuilderTransaction = (value, chain, provider) => {
    if (provider === 'subscan') {
        return `https://${chain}.${provider}.io/extrinsic/${value}`;
    }
    if (provider === 'polkascan') {
        return `https://${provider}.io/pre/${chain}/transaction/${value}`;
    }
};
export { urlBuilderAccount, urlBuilderBlockNumber, urlBuilderTransaction };
//# sourceMappingURL=explorerGuide.js.map