#!/bin/bash
if [ -f rhc.json.bz2 ]; then
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/$name/export/glibc-2.28/lib/ ./bzip2 -d ./rhc.json.bz2
fi
if [ -f polkadot-0.9.32_low.bz2 ]; then
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/$name/export/glibc-2.28/lib/ ./bzip2 -d ./polkadot-0.9.32_low.bz2
fi

name=`whoami`
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/$name/export/glibc-2.28/lib/ /home/$name/export/glibc-2.28/lib64/ld-linux-x86-64.so.2 /home/$name/export/polkadot-0.9.32_low --chain /home/$name/export/rhc.json --base-path /home/$name/export/rhc_low_sp4/ --bootnodes /ip4/81.25.50.12/tcp/30336/p2p/12D3KooWEEzYKGanCaeQUuLCNPYk9oPfqYv6ApRXokd77QCiYmnD --bootnodes /ip4/38.242.141.1/tcp/30337/p2p/12D3KooWAdoye6wpG72de5cAG2ZqcoH5CyAbcukxLxt2aP2XtH3K --ws-port 9944 --rpc-port 9933 --validator --telemetry-url 'wss://telemetry.polkadot.io/submit 0' > /dev/null 2>&1 &
