// Copyright 2017-2022 Parity Technologies (UK) Ltd.
// This file is part of Polkadot.

// Polkadot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Polkadot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Polkadot.  If not, see <http://www.gnu.org/licenses/>.
//! Autogenerated weights for `pallet_nomination_pools`
//!
//! THIS FILE WAS AUTO-GENERATED USING THE SUBSTRATE BENCHMARK CLI VERSION 4.0.0-dev
//! DATE: 2022-10-25, STEPS: `50`, REPEAT: 20, LOW RANGE: `[]`, HIGH RANGE: `[]`
//! HOSTNAME: `bm6`, CPU: `Intel(R) Core(TM) i7-7700K CPU @ 4.20GHz`
//! EXECUTION: Some(Wasm), WASM-EXECUTION: Compiled, CHAIN: Some("polkadot-dev"), DB CACHE: 1024

// Executed Command:
// ./target/production/polkadot
// benchmark
// pallet
// --chain=polkadot-dev
// --steps=50
// --repeat=20
// --pallet=pallet_nomination_pools
// --extrinsic=*
// --execution=wasm
// --wasm-execution=compiled
// --header=./file_header.txt
// --output=./runtime/polkadot/src/weights/

#![cfg_attr(rustfmt, rustfmt_skip)]
#![allow(unused_parens)]
#![allow(unused_imports)]

use frame_support::{traits::Get, weights::Weight};
use sp_std::marker::PhantomData;

/// Weight functions for `pallet_nomination_pools`.
pub struct WeightInfo<T>(PhantomData<T>);
impl<T: frame_system::Config> pallet_nomination_pools::WeightInfo for WeightInfo<T> {
	// Storage: NominationPools MinJoinBond (r:1 w:0)
	// Storage: NominationPools PoolMembers (r:1 w:1)
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: Staking Ledger (r:1 w:1)
	// Storage: NominationPools RewardPools (r:1 w:1)
	// Storage: System Account (r:2 w:1)
	// Storage: NominationPools MaxPoolMembersPerPool (r:1 w:0)
	// Storage: NominationPools MaxPoolMembers (r:1 w:0)
	// Storage: NominationPools CounterForPoolMembers (r:1 w:1)
	// Storage: Staking Bonded (r:1 w:0)
	// Storage: Balances Locks (r:1 w:1)
	// Storage: VoterList ListNodes (r:3 w:3)
	// Storage: VoterList ListBags (r:2 w:2)
	fn join() -> Weight {
		// Minimum execution time: 137_659 nanoseconds.
		Weight::from_ref_time(141_867_000 as u64)
			.saturating_add(T::DbWeight::get().reads(17 as u64))
			.saturating_add(T::DbWeight::get().writes(12 as u64))
	}
	// Storage: NominationPools PoolMembers (r:1 w:1)
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: NominationPools RewardPools (r:1 w:1)
	// Storage: System Account (r:3 w:2)
	// Storage: Staking Ledger (r:1 w:1)
	// Storage: Staking Bonded (r:1 w:0)
	// Storage: Balances Locks (r:1 w:1)
	// Storage: VoterList ListNodes (r:3 w:3)
	// Storage: VoterList ListBags (r:2 w:2)
	fn bond_extra_transfer() -> Weight {
		// Minimum execution time: 135_584 nanoseconds.
		Weight::from_ref_time(138_267_000 as u64)
			.saturating_add(T::DbWeight::get().reads(14 as u64))
			.saturating_add(T::DbWeight::get().writes(12 as u64))
	}
	// Storage: NominationPools PoolMembers (r:1 w:1)
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: NominationPools RewardPools (r:1 w:1)
	// Storage: System Account (r:3 w:3)
	// Storage: Staking Ledger (r:1 w:1)
	// Storage: Staking Bonded (r:1 w:0)
	// Storage: Balances Locks (r:1 w:1)
	// Storage: VoterList ListNodes (r:2 w:2)
	// Storage: VoterList ListBags (r:2 w:2)
	fn bond_extra_reward() -> Weight {
		// Minimum execution time: 139_022 nanoseconds.
		Weight::from_ref_time(141_990_000 as u64)
			.saturating_add(T::DbWeight::get().reads(13 as u64))
			.saturating_add(T::DbWeight::get().writes(12 as u64))
	}
	// Storage: NominationPools PoolMembers (r:1 w:1)
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: NominationPools RewardPools (r:1 w:1)
	// Storage: System Account (r:1 w:1)
	fn claim_payout() -> Weight {
		// Minimum execution time: 55_953 nanoseconds.
		Weight::from_ref_time(56_404_000 as u64)
			.saturating_add(T::DbWeight::get().reads(4 as u64))
			.saturating_add(T::DbWeight::get().writes(4 as u64))
	}
	// Storage: NominationPools PoolMembers (r:1 w:1)
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: NominationPools RewardPools (r:1 w:1)
	// Storage: Staking Ledger (r:1 w:1)
	// Storage: System Account (r:2 w:1)
	// Storage: Staking CurrentEra (r:1 w:0)
	// Storage: Staking Nominators (r:1 w:0)
	// Storage: Staking MinNominatorBond (r:1 w:0)
	// Storage: Balances Locks (r:1 w:1)
	// Storage: VoterList ListNodes (r:3 w:3)
	// Storage: Staking Bonded (r:1 w:0)
	// Storage: VoterList ListBags (r:2 w:2)
	// Storage: NominationPools SubPoolsStorage (r:1 w:1)
	// Storage: NominationPools CounterForSubPoolsStorage (r:1 w:1)
	fn unbond() -> Weight {
		// Minimum execution time: 137_634 nanoseconds.
		Weight::from_ref_time(138_697_000 as u64)
			.saturating_add(T::DbWeight::get().reads(18 as u64))
			.saturating_add(T::DbWeight::get().writes(13 as u64))
	}
	// Storage: NominationPools BondedPools (r:1 w:0)
	// Storage: Staking Ledger (r:1 w:1)
	// Storage: Staking CurrentEra (r:1 w:0)
	// Storage: Balances Locks (r:1 w:1)
	/// The range of component `s` is `[0, 100]`.
	fn pool_withdraw_unbonded(s: u32, ) -> Weight {
		// Minimum execution time: 50_029 nanoseconds.
		Weight::from_ref_time(51_873_509 as u64)
			// Standard Error: 1_109
			.saturating_add(Weight::from_ref_time(8_889 as u64).saturating_mul(s as u64))
			.saturating_add(T::DbWeight::get().reads(4 as u64))
			.saturating_add(T::DbWeight::get().writes(2 as u64))
	}
	// Storage: NominationPools PoolMembers (r:1 w:1)
	// Storage: Staking CurrentEra (r:1 w:0)
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: NominationPools SubPoolsStorage (r:1 w:1)
	// Storage: Staking Ledger (r:1 w:1)
	// Storage: Balances Locks (r:1 w:1)
	// Storage: System Account (r:1 w:1)
	// Storage: NominationPools CounterForPoolMembers (r:1 w:1)
	/// The range of component `s` is `[0, 100]`.
	fn withdraw_unbonded_update(s: u32, ) -> Weight {
		// Minimum execution time: 89_911 nanoseconds.
		Weight::from_ref_time(92_313_754 as u64)
			// Standard Error: 1_344
			.saturating_add(Weight::from_ref_time(21_018 as u64).saturating_mul(s as u64))
			.saturating_add(T::DbWeight::get().reads(8 as u64))
			.saturating_add(T::DbWeight::get().writes(7 as u64))
	}
	// Storage: NominationPools PoolMembers (r:1 w:1)
	// Storage: Staking CurrentEra (r:1 w:0)
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: NominationPools SubPoolsStorage (r:1 w:1)
	// Storage: Staking Ledger (r:1 w:1)
	// Storage: Staking Bonded (r:1 w:1)
	// Storage: Staking SlashingSpans (r:1 w:0)
	// Storage: Staking Validators (r:1 w:0)
	// Storage: Staking Nominators (r:1 w:0)
	// Storage: System Account (r:2 w:2)
	// Storage: Balances Locks (r:1 w:1)
	// Storage: NominationPools CounterForPoolMembers (r:1 w:1)
	// Storage: NominationPools ReversePoolIdLookup (r:1 w:1)
	// Storage: NominationPools CounterForReversePoolIdLookup (r:1 w:1)
	// Storage: NominationPools RewardPools (r:1 w:1)
	// Storage: NominationPools CounterForRewardPools (r:1 w:1)
	// Storage: NominationPools CounterForSubPoolsStorage (r:1 w:1)
	// Storage: NominationPools Metadata (r:1 w:1)
	// Storage: NominationPools CounterForBondedPools (r:1 w:1)
	// Storage: Staking Payee (r:0 w:1)
	/// The range of component `s` is `[0, 100]`.
	fn withdraw_unbonded_kill(_s: u32, ) -> Weight {
		// Minimum execution time: 142_501 nanoseconds.
		Weight::from_ref_time(145_720_383 as u64)
			.saturating_add(T::DbWeight::get().reads(20 as u64))
			.saturating_add(T::DbWeight::get().writes(17 as u64))
	}
	// Storage: Staking MinNominatorBond (r:1 w:0)
	// Storage: NominationPools MinCreateBond (r:1 w:0)
	// Storage: NominationPools MinJoinBond (r:1 w:0)
	// Storage: NominationPools MaxPools (r:1 w:0)
	// Storage: NominationPools CounterForBondedPools (r:1 w:1)
	// Storage: NominationPools PoolMembers (r:1 w:1)
	// Storage: NominationPools LastPoolId (r:1 w:1)
	// Storage: NominationPools MaxPoolMembersPerPool (r:1 w:0)
	// Storage: NominationPools MaxPoolMembers (r:1 w:0)
	// Storage: NominationPools CounterForPoolMembers (r:1 w:1)
	// Storage: System Account (r:2 w:2)
	// Storage: Staking Ledger (r:1 w:1)
	// Storage: Staking Bonded (r:1 w:1)
	// Storage: Staking CurrentEra (r:1 w:0)
	// Storage: Balances Locks (r:1 w:1)
	// Storage: NominationPools RewardPools (r:1 w:1)
	// Storage: NominationPools CounterForRewardPools (r:1 w:1)
	// Storage: NominationPools ReversePoolIdLookup (r:1 w:1)
	// Storage: NominationPools CounterForReversePoolIdLookup (r:1 w:1)
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: Staking Payee (r:0 w:1)
	fn create() -> Weight {
		// Minimum execution time: 129_279 nanoseconds.
		Weight::from_ref_time(130_518_000 as u64)
			.saturating_add(T::DbWeight::get().reads(21 as u64))
			.saturating_add(T::DbWeight::get().writes(15 as u64))
	}
	// Storage: NominationPools BondedPools (r:1 w:0)
	// Storage: Staking Ledger (r:1 w:0)
	// Storage: Staking MinNominatorBond (r:1 w:0)
	// Storage: Staking Nominators (r:1 w:1)
	// Storage: Staking MaxNominatorsCount (r:1 w:0)
	// Storage: Staking Validators (r:2 w:0)
	// Storage: Staking CurrentEra (r:1 w:0)
	// Storage: Staking Bonded (r:1 w:0)
	// Storage: VoterList ListNodes (r:1 w:1)
	// Storage: VoterList ListBags (r:1 w:1)
	// Storage: VoterList CounterForListNodes (r:1 w:1)
	// Storage: Staking CounterForNominators (r:1 w:1)
	/// The range of component `n` is `[1, 16]`.
	fn nominate(n: u32, ) -> Weight {
		// Minimum execution time: 60_954 nanoseconds.
		Weight::from_ref_time(61_463_684 as u64)
			// Standard Error: 4_901
			.saturating_add(Weight::from_ref_time(1_149_069 as u64).saturating_mul(n as u64))
			.saturating_add(T::DbWeight::get().reads(12 as u64))
			.saturating_add(T::DbWeight::get().reads((1 as u64).saturating_mul(n as u64)))
			.saturating_add(T::DbWeight::get().writes(5 as u64))
	}
	// Storage: NominationPools BondedPools (r:1 w:1)
	// Storage: Staking Ledger (r:1 w:0)
	fn set_state() -> Weight {
		// Minimum execution time: 34_554 nanoseconds.
		Weight::from_ref_time(35_453_000 as u64)
			.saturating_add(T::DbWeight::get().reads(2 as u64))
			.saturating_add(T::DbWeight::get().writes(1 as u64))
	}
	// Storage: NominationPools BondedPools (r:1 w:0)
	// Storage: NominationPools Metadata (r:1 w:1)
	// Storage: NominationPools CounterForMetadata (r:1 w:1)
	/// The range of component `n` is `[1, 256]`.
	fn set_metadata(n: u32, ) -> Weight {
		// Minimum execution time: 16_327 nanoseconds.
		Weight::from_ref_time(17_114_673 as u64)
			// Standard Error: 135
			.saturating_add(Weight::from_ref_time(176 as u64).saturating_mul(n as u64))
			.saturating_add(T::DbWeight::get().reads(3 as u64))
			.saturating_add(T::DbWeight::get().writes(2 as u64))
	}
	// Storage: NominationPools MinJoinBond (r:0 w:1)
	// Storage: NominationPools MaxPoolMembers (r:0 w:1)
	// Storage: NominationPools MaxPoolMembersPerPool (r:0 w:1)
	// Storage: NominationPools MinCreateBond (r:0 w:1)
	// Storage: NominationPools MaxPools (r:0 w:1)
	fn set_configs() -> Weight {
		// Minimum execution time: 7_390 nanoseconds.
		Weight::from_ref_time(7_595_000 as u64)
			.saturating_add(T::DbWeight::get().writes(5 as u64))
	}
	// Storage: NominationPools BondedPools (r:1 w:1)
	fn update_roles() -> Weight {
		// Minimum execution time: 25_740 nanoseconds.
		Weight::from_ref_time(26_148_000 as u64)
			.saturating_add(T::DbWeight::get().reads(1 as u64))
			.saturating_add(T::DbWeight::get().writes(1 as u64))
	}
	// Storage: NominationPools BondedPools (r:1 w:0)
	// Storage: Staking Ledger (r:1 w:0)
	// Storage: Staking Validators (r:1 w:0)
	// Storage: Staking Nominators (r:1 w:1)
	// Storage: Staking CounterForNominators (r:1 w:1)
	// Storage: VoterList ListNodes (r:1 w:1)
	// Storage: VoterList ListBags (r:1 w:1)
	// Storage: VoterList CounterForListNodes (r:1 w:1)
	fn chill() -> Weight {
		// Minimum execution time: 59_514 nanoseconds.
		Weight::from_ref_time(60_304_000 as u64)
			.saturating_add(T::DbWeight::get().reads(8 as u64))
			.saturating_add(T::DbWeight::get().writes(5 as u64))
	}
}
