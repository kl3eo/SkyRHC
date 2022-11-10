import registry from './registry';
import BN from 'bn.js';
import { BN_ONE, BN_ZERO } from '@polkadot/util';
import { baseBalance } from '../utils';
const PERBILL = new BN(1000000000);
export function extractInfo(allAccounts, amount = baseBalance(), electedDerive, waitingDerive, favorites, lastReward = BN_ONE) {
    const perValidatorReward = lastReward.divn(electedDerive.info && electedDerive.info.length || 0);
    const [elected, nominators, totalStaked] = extractSingle(allAccounts, amount, electedDerive, favorites, perValidatorReward, true);
    const [waiting] = extractSingle(allAccounts, amount, waitingDerive, favorites, perValidatorReward, false);
    const validators = sortValidators(elected.concat(waiting));
    const validatorIds = validators.map(({ accountId }) => accountId.toString());
    return { nominators, totalStaked, validatorIds, validators };
}
function mapIndex(mapBy) {
    return (info, index) => {
        info[mapBy] = index + 1;
        return info;
    };
}
function sortValidators(list) {
    return list
        .filter((a) => a.bondTotal.gtn(0))
        .sort((a, b) => b.commissionPer - a.commissionPer)
        .map(mapIndex('rankComm'))
        .sort((a, b) => b.bondOther.cmp(a.bondOther))
        .map(mapIndex('rankBondOther'))
        .sort((a, b) => b.bondOwn.cmp(a.bondOwn))
        .map(mapIndex('rankBondOwn'))
        .sort((a, b) => b.bondTotal.cmp(a.bondTotal))
        .map(mapIndex('rankBondTotal'))
        .sort((a, b) => b.validatorPayment.cmp(a.validatorPayment))
        .map(mapIndex('rankPayment'))
        .sort((a, b) => a.rewardSplit.cmp(b.rewardSplit))
        .map(mapIndex('rankReward'))
        .sort((a, b) => b.numNominators - a.numNominators)
        .map(mapIndex('rankNumNominators'))
        .sort((a, b) => {
        const cmp = b.rewardPayout.cmp(a.rewardPayout);
        return cmp !== 0
            ? cmp
            : a.rankReward === b.rankReward
                ? a.rankPayment === b.rankPayment
                    ? b.rankBondTotal - a.rankBondTotal
                    : b.rankPayment - a.rankPayment
                : b.rankReward - a.rankReward;
    })
        .map(mapIndex('rankOverall'))
        .sort((a, b) => a.isFavorite === b.isFavorite
        ? 0
        : (a.isFavorite ? -1 : 1));
}
function extractSingle(allAccounts, amount = baseBalance(), { info }, favorites, perValidatorReward, isElected) {
    const nominators = [];
    let totalStaked = BN_ZERO;
    const list = info.map(({ accountId, exposure: _exposure, stakingLedger, validatorPrefs }) => {
        const exposure = _exposure || {
            others: registry.createType('Vec<IndividualExposure>'),
            own: registry.createType('Compact<Balance>'),
            total: registry.createType('Compact<Balance>')
        };
        const prefs = validatorPrefs || {
            commission: registry.createType('Compact<Perbill>')
        };
        let bondOwn = exposure.own.unwrap();
        let bondTotal = exposure.total.unwrap();
        const skipRewards = bondTotal.isZero();
        if (bondTotal.isZero() && stakingLedger) {
            bondTotal = bondOwn = stakingLedger.total.unwrap();
        }
        const validatorPayment = prefs.validatorPayment
            ? prefs.validatorPayment.unwrap()
            : prefs.commission.unwrap().mul(perValidatorReward).div(PERBILL);
        const key = accountId.toString();
        const rewardSplit = perValidatorReward.sub(validatorPayment);
        const rewardPayout = amount.isZero() || rewardSplit.isZero()
            ? BN_ZERO
            : amount.mul(rewardSplit).div(amount.add(bondTotal));
        const isNominating = exposure.others.reduce((nominating, indv) => {
            const nominator = indv.who.toString();
            if (!nominators.includes(nominator)) {
                nominators.push(nominator);
            }
            return nominating || allAccounts.includes(nominator);
        }, allAccounts.includes(key));
        totalStaked = totalStaked.add(bondTotal);
        return {
            accountId,
            bondOther: bondTotal.sub(bondOwn),
            bondOwn,
            bondShare: 0,
            bondTotal,
            commissionPer: ((commission(prefs) && commission(prefs).unwrap() || BN_ZERO).toNumber() / 10000000),
            hasIdentity: false,
            isCommission: !!commission(prefs),
            isElected,
            isFavorite: favorites.includes(key),
            isNominating,
            key,
            numNominators: exposure.others.length,
            rankBondOther: 0,
            rankBondOwn: 0,
            rankBondTotal: 0,
            rankComm: 0,
            rankNumNominators: 0,
            rankOverall: 0,
            rankPayment: 0,
            rankReward: 0,
            rewardPayout: skipRewards ? BN_ZERO : rewardPayout,
            rewardSplit,
            validatorPayment
        };
    });
    return [list, nominators, totalStaked];
}
function commission(prefs) {
    return prefs.commission;
}
//# sourceMappingURL=utills.js.map