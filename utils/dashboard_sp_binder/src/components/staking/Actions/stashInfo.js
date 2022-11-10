import Connector from '@vue-polkadot/vue-api';
import keyring from '@polkadot/ui-keyring';
import BN from 'bn.js';
import { BN_ZERO, u8aConcat, u8aToHex } from '@polkadot/util';
export function getStashIds() {
    const { api } = Connector.getInstance();
    return api.derive.staking
        .stashes()
        .then((stashes) => stashes.map(accountId => accountId.toString()));
}
export function getAccounts() {
    const allAddresses = keyring.getAccounts().map(account => account.address);
    const hasAddresses = allAddresses.length !== 0;
    const isAddress = (address) => allAddresses.includes(address.toString());
    return { allAccounts: allAddresses, hasAccounts: hasAddresses, isAddress };
}
export async function getOwnStashes() {
    const { allAccounts, hasAccounts } = getAccounts();
    const { api } = Connector.getInstance();
    const ownBonded = await api.query.staking.bonded.multi(allAccounts);
    const ownLedger = await api.query.staking.ledger.multi(allAccounts);
    return getStashes(allAccounts, ownBonded, ownLedger);
}
export function getOwnStashIds() {
    return getOwnStashes().then(ownStashes => {
        return ownStashes
            ? ownStashes.map(([stashId]) => stashId) : [];
    });
}
function getStashes(allAccounts, ownBonded, ownLedger) {
    const result = [];
    ownBonded.forEach(({ isSome }, index) => {
        if (isSome) {
            result.push([allAccounts[index], true]);
        }
    });
    ownLedger.forEach((ledger) => {
        if (ledger.isSome) {
            const stashId = ledger.unwrap().stash.toString();
            if (!result.some(([accountId]) => accountId === stashId)) {
                result.push([stashId, false]);
            }
        }
    });
    return result;
}
export async function getAvailableSlashes() {
    const { api } = Connector.getInstance();
    const indexes = await api.derive.session.indexes();
    const earliestSlash = await api.query.staking.earliestUnappliedSlash();
    if (earliestSlash && earliestSlash.isSome) {
        const from = earliestSlash.unwrap();
        const range = [];
        let start = new BN(from);
        while (start.lt(indexes.activeEra)) {
            range.push(start);
            start = start.addn(1);
        }
        if (range.length) {
            const values = await api.query.staking.unappliedSlashes.multi(range);
            return values
                .map((value, index) => [from.addn(index), value])
                .filter(([, slashes]) => slashes.length !== 0);
        }
    }
    return [];
}
export function extractState(ownStashes) {
    if (!ownStashes) {
        return {};
    }
    return {
        bondedTotal: ownStashes.reduce((total, { stakingLedger }) => stakingLedger ? total.add(stakingLedger.total.unwrap()) : total, BN_ZERO),
        foundStashes: ownStashes
    };
}
function toIdString(id) {
    return id ? id.toString() : null;
}
export function getStakerState(stashId, allAccounts, allStashes, [isOwnStash, { controllerId: _controllerId, exposure, nextSessionIds, nominators, rewardDestination, sessionIds, stakingLedger, validatorPrefs }, validateInfo]) {
    const isStashNominating = !!(nominators && nominators.length);
    const isStashValidating = !(Array.isArray(validateInfo)
        ? validateInfo[1].isEmpty
        : validateInfo.isEmpty) || !!(allStashes && allStashes.includes(stashId));
    const nextConcat = u8aConcat(...nextSessionIds.map((id) => id.toU8a()));
    const currConcat = u8aConcat(...sessionIds.map((id) => id.toU8a()));
    const controllerId = toIdString(_controllerId);
    return {
        controllerId,
        destination: (rewardDestination && rewardDestination.toString().toLowerCase()) || '',
        destinationId: (rewardDestination && rewardDestination.toNumber()) || 0,
        exposure,
        hexSessionIdNext: u8aToHex(nextConcat, 48),
        hexSessionIdQueue: u8aToHex(currConcat.length ? currConcat : nextConcat, 48),
        isLoading: false,
        isOwnController: allAccounts.includes(controllerId || ''),
        isOwnStash,
        isStashNominating,
        isStashValidating,
        // we assume that all ids are non-null
        nominating: (nominators && nominators.map(toIdString)) || [],
        sessionIds: (nextSessionIds.length ? nextSessionIds : sessionIds).map(toIdString),
        stakingLedger,
        stashId,
        validatorPrefs
    };
}
//# sourceMappingURL=stashInfo.js.map