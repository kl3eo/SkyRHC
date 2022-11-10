export function extractNominators(nominations) {
    return nominations.reduce((mapped, [key, optNoms]) => {
        if (optNoms.isSome) {
            const nominatorId = key.args[0].toString();
            const { submittedIn, targets } = optNoms.unwrap();
            targets.forEach((_validatorId, index) => {
                const validatorId = _validatorId.toString();
                const info = [nominatorId, submittedIn, index + 1];
                if (!mapped[validatorId]) {
                    mapped[validatorId] = [info];
                }
                else {
                    mapped[validatorId].push(info);
                }
            });
        }
        return mapped;
    }, {});
}
export default extractNominators;
function filterAccounts(accounts = [], elected, favorites, without) {
    return accounts
        .filter((accountId) => !without.includes(accountId))
        .map((accountId) => [
        accountId,
        elected.includes(accountId),
        favorites.includes(accountId)
    ])
        .sort(([, , isFavA], [, , isFavB]) => isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1));
}
function accountsToString(accounts = []) {
    return accounts.map((accountId) => accountId.toString());
}
export function getFiltered(stakingOverview, favorites = [], next = []) {
    const allElected = accountsToString(stakingOverview.nextElected);
    const validatorIds = accountsToString(stakingOverview.validators);
    const validators = filterAccounts(validatorIds, allElected, favorites, []);
    const elected = filterAccounts(allElected, allElected, favorites, validatorIds);
    const waiting = filterAccounts(next, [], favorites, allElected);
    return {
        elected,
        validators,
        waiting
    };
}
export function getValidators(stakingOverview) {
    return accountsToString(stakingOverview.nextElected).concat(accountsToString(stakingOverview.validators));
}
//# sourceMappingURL=utils.js.map