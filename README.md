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

	runtime only: 
	cargo +nightly-2020-10-06-x86_64-unknown-linux-gnu  build -p pirl-runtime --release

START NODE
==========

	./target/release/pirl --bootnodes /ip4/164.68.105.131/tcp/30325/p2p/12D3KooWAPQYbo6TzWUSeB8bXbnKNRfwUfnPExauawmbiGX9cavH --bootnodes /ip4/38.242.141.1/tcp/30338/p2p/12D3KooWDZvsdFshnFeDJKxVrtWxFHpZP4VxTk1xJUxx6a4ZLDWF --name <YOUR_NODE> --telemetry-url 'wss://cube.room-house.com:8441/submit 0'


USE BINARY DISTRO
=================

Download "export.tar.gz", untar it and follow the README. This is a self-contained archive with the binary and libs supposed to run on any reasonable Linux: Centos, Ubuntu, Debian, etc.
The binary is built on Centos 8, with its glibc 2.28 included in the "export" folder.


CHECK YOUR NODE'S TELEMETRY
===========================

https://telemetry.polkadot.io/#list/0xfacdcefab28407f5b0e56899e1eefe27a5a7fda2a1c25f4e9a5a181eb108ee9e
or just	https://skypirl.org
