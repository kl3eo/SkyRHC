import BN from 'bn.js';
import { BN_ZERO, formatBalance } from '@polkadot/util';
const PERBILL_PERCENT = 10000000;
export function expandInfo({ exposure, validatorPrefs }) {
    let nominators = [];
    let stakeTotal;
    let stakeOther;
    let stakeOwn;
    if (exposure) {
        nominators = exposure.others.map(({ value, who }) => [who.toString(), value.unwrap()]);
        stakeTotal = exposure.total.unwrap();
        stakeOwn = exposure.own.unwrap();
        stakeOther = stakeTotal.sub(stakeOwn);
    }
    let commission = BN_ZERO;
    if (validatorPrefs && validatorPrefs.commission) {
        commission = validatorPrefs.commission.unwrap();
    }
    return {
        commission: commission
            ? `${(commission.toNumber() / PERBILL_PERCENT).toFixed(2)}%`
            : undefined,
        nominators,
        stakeOther,
        stakeOwn,
        stakeTotal
    };
}
export function baseBalance() {
    return new BN('1'.padEnd(formatBalance.getDefaults().decimals + 4, '0'));
}
//# sourceMappingURL=utils.js.map