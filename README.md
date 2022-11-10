# SkyPirl
SkyPirl is a blockchain and a coin with roots in Polkadot and Pirl 2.0

HISTORY
=======

	# Forked from Pirl2.0 on July 23, 2021;
	# Forked from SkyPirl2 on June 20, 2022;
	# Forked from SkyPirl3 on Oct 18, 2022.

BUILD
=====

	curl https://sh.rustup.rs -sSf | sh
	source $HOME/.cargo/env
	rustc --version


	git clone https://github.com/kl3eo/SkyPirl
	cd pirl-0.8.29
	./scripts/init.sh

	cargo build --release
	strip target/release/pirl


START NODE
==========

	./target/release/pirl --bootnodes /ip4/164.68.105.131/tcp/30325/p2p/12D3KooWAPQYbo6TzWUSeB8bXbnKNRfwUfnPExauawmbiGX9cavH --bootnodes /ip4/38.242.141.1/tcp/30338/p2p/12D3KooWDZvsdFshnFeDJKxVrtWxFHpZP4VxTk1xJUxx6a4ZLDWF --name <YOUR_NODE> --telemetry-url 'wss://cube.room-house.com:8441/submit 0'


CHECK YOUR NODE'S TELEMETRY
===========================

	https://skypirl.org
