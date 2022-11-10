import { formatBalance } from '@polkadot/util';
const M_LENGTH = 6 + 1;
const K_LENGTH = 3 + 1;
function format(balance, decimals = 12, withUnit, withSi) {
    return formatBalance(balance, { decimals, withUnit, forceUnit: '-', withSi });
}
// Legacy
// const format = (balance: Compact<any> | BN | string, currency: string, withSi?: boolean): string => {
//   const value = typeof balance === 'object' ? balance.toString() : balance;
//   const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');
//   // console.log(`${prefix}.${`000${postfix || ''}`.slice(-3)} ${currency}`);
//   const isShort = withSi && prefix.length >= K_LENGTH;
//   if (prefix.length > M_LENGTH) {
//     return `${formatBalance(value.substring(0, value.length-12)).replace('Unit','')} ${currency}`;
//   }
//   return `${!isShort && value ? prefix : '0'}.000${''.slice(-3) } ${currency}`
// }
export default format;
//# sourceMappingURL=formatBalance.js.map