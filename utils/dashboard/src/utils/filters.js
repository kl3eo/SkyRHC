import BN from 'bn.js';
import { isNumber } from '@polkadot/util';
const EMPTY = '0.00 %';
export const toNumber = (value) => BN.isBN(value) ? Number(value.toString()) : value || 0;
export const toString = (value) => (value && value.toString()) || '';
export const toPercent = (value) => {
    if (!value) {
        return EMPTY;
    }
    if (isNumber(value)) {
        return Number.isInteger(value) ? `${value}.00 %` : `${value} %`;
    }
    if (BN.isBN(value)) {
        return `${value.toString()} %`;
    }
    return EMPTY;
};
//# sourceMappingURL=filters.js.map