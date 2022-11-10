import BN from 'bn.js';
import Connector from '@vue-polkadot/vue-api';
const defaultState = {
    allAye: [],
    allNay: [],
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new BN(0),
    votedNay: new BN(0),
    votedTotal: new BN(0)
};
function isCurrentStatus(status) {
    return !!status.tally;
}
function calcStateOld(votesFor) {
    return votesFor.reduce((state, derived) => {
        const { balance, vote } = derived;
        const isDefault = vote.conviction.index === 0;
        const counted = balance
            .muln(isDefault ? 1 : vote.conviction.index)
            .divn(isDefault ? 10 : 1);
        if (vote.isAye) {
            state.allAye.push(derived);
            state.voteCountAye++;
            state.votedAye = state.votedAye.add(counted);
        }
        else {
            state.allNay.push(derived);
            state.voteCountNay++;
            state.votedNay = state.votedNay.add(counted);
        }
        state.voteCount++;
        state.votedTotal = state.votedTotal.add(counted);
        return state;
    }, {
        allAye: [],
        allNay: [],
        voteCount: 0,
        voteCountAye: 0,
        voteCountNay: 0,
        votedAye: new BN(0),
        votedNay: new BN(0),
        votedTotal: new BN(0)
    });
}
function calcState(tally, votes = []) {
    const allAye = [];
    const allNay = [];
    votes.forEach((derived) => {
        if (derived.vote.isAye) {
            allAye.push(derived);
        }
        else {
            allNay.push(derived);
        }
    });
    return {
        allAye,
        allNay,
        voteCount: allAye.length + allNay.length,
        voteCountAye: allAye.length,
        voteCountNay: allNay.length,
        votedAye: tally.ayes,
        votedNay: tally.nays,
        votedTotal: tally.turnout
    };
}
const referendumState = async (referendum) => {
    if (Connector.getInstance()) {
        const votes = await Connector.getInstance().api.derive.democracy._referendumVotes(referendum.index);
        if (isCurrentStatus(referendum.status)) {
            return calcState(referendum.status.tally, votes);
        }
        else if (votes) {
            return calcStateOld(votes);
        }
    }
    return defaultState;
};
export default referendumState;
//# sourceMappingURL=referendumState.js.map