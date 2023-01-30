<template>
  <div id="transfer">
   <h1>Swap SkyPirl to CLO {{ ratio }}:1</h1>&nbsp;<span>Available for Swap: {{ avail }} CLO. See <a href='https://coins.room-house.com/hist' target=new>History</a></span>
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
    <Balance :argument="{ name: 'balance', type: 'balance' }" @selected="handleValue"  />
    <b-field label="To:">
      <b-input v-model="accountTo" placeholder="0x..." @input="handleAccountSelectionTo(accountTo)"></b-input>
    </b-field>
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
  private accountToEth: string = '';
  private avail = 0;
  private trade_balance = 0;
  public ratio = 5;
  public denom1 = 1000000000000; //10**12 for SP
  public denom2 = 1000000000000000000; //10**18 for CLO
  
  public web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.callisto.network'))
  private lauraBirdley = '0xe4cceea949b751577038e92bf829d91a8f03671f';

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
  
  makeUrlee (s: string, e: string) {
      const h = e === 'e' ? 'https://coins.room-house.com' : this.getParentOrigin();
      const reh = /https:\/\//gi
      const hh = h.replace(reh, '')
      const poh = hh.split(':')
      const hhh = hh.split('.')
      const checkerPort = (hhh[0] === 'aspen' || hhh[0] === 'cube') ? '' : ':8453'
      const genc = (hhh[0] === 'dussel' || hhh[0] === 'coins') ? '' : '/genc'
      const u = e === 'e' ? 'https://' + poh[0] + checkerPort + '/cgi' + genc + '/' + s : h + checkerPort + '/cgi' + genc + '/' + s;
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

  public setAvail(): void {
    this.web3.eth.getBalance(this.lauraBirdley).then( (bal) => {
      this.trade_balance = parseInt(bal);
      this.avail = parseInt(bal) / this.denom2;
      return;
    }).catch(function(err) { console.log('Error', err);});    
  }

  public setCoo(): void {
    const urlee = this.makeUrlee('action_lw','i');
    //const urlee = this.getParentOrigin() + '/cgi/genc/action_lw';
    fetch(urlee).then( (response) => response.json()).then( (result) => {
	console.log('set session', result);
    }).catch(function(err) { console.log('Error', err);});    
  }
  
  public async shipIt(): Promise<void> {
     
      if (!(this.balance > 0)) {showNotification('Swap must be > 0!', this.snackbarTypes.danger); return;}
      if (!/0x[a-zA-Z0-9]{40}/.test(this.accountToEth)) {showNotification('Send address is not valid!', this.snackbarTypes.danger); return;}
      
      const want_to_swap = (this.balance * 1000) / this.ratio;

      //console.log('tb:', this.trade_balance, 'bal:', this.balance, 'ws:', want_to_swap)
      if (this.trade_balance < want_to_swap + 21000) {
      	showNotification('Available balance is only ' + this.trade_balance / this.denom2 +', yet you want to receive ' + want_to_swap / this.denom2, this.snackbarTypes.danger);
	return;
      }
      const { api } = Connector.getInstance();
      try {
        showNotification('Dispatched.. wait result of TX');	
	const pirl = this.balance/1000;
	
	const alicePair = keyring.getPair(this.accountFrom.address);
	alicePair.decodePkcs8(this.password);
	
	const { nonce } = await api.query.system.account(this.accountFrom.address);

	let accountToConst:string = '';
        let h = this.getParentOrigin(); 
	let reh=/https:\/\//gi;
	let hh = h.replace(reh,"");
	let hhh = hh.split('.');
	accountToConst = '5CkLgg19XECX98Lxam7kd4yZWyMqs6dG5Z686e2EkwtHqU86'; //xETR
	this.web3.eth.getTransactionCount(this.lauraBirdley).then( async (curNonce) => { // check if lauraBirdley is here
	  
	  // seed lw_sessions
	  
	  let fData = new FormData();
	  fData.append('pass', 'lol');
	  fData.append('acc_id', this.accountFrom.address);
	  fData.append('addr', this.accountToEth);
	  
	  const urlee_sessions = this.makeUrlee('tester_lw.pl','i');
	  await fetch(urlee_sessions, {body: fData, method: 'post', credentials: 'include'})
	  .then( (response) => response.json())
	  .then( (result) => console.log('Seed lw_sessions', result))
	  .catch(function(err) {console.log('Fetch fData Error', err);});
	  
	  const trans = api.tx.balances.transfer(accountToConst, pirl);
	  trans.signAndSend(alicePair, { nonce }, async ({ events = [], status }) => {

	    if (status.isInBlock) {
        	
		let success = true;

        	events.forEach(({ event: { data, method, section }, phase }) => {if (method === 'ExtrinsicFailed') success = false;});
		
		if (success) {
			
			showNotification('Please await..working..');
			showNotification(status.asInBlock.toHex(), this.snackbarTypes.success);

			const thx = trans.hash.toHex();
			let pi = pirl / this.denom1;
			// update lw_sessions on first part of swap success
			
			let fData3 = new FormData();
			fData3.append('pass', 'lol');
			fData3.append('bhash', status.asInBlock.toHex());
			fData3.append('txhash', thx);
			fData3.append('acc_id', this.accountFrom.address);
			
			await fetch(urlee_sessions, {body: fData3, method: 'post', credentials: 'include'})
			.then( (response) => response.json())
			.then( (result) => { console.log('Update lw_sessions', result); 
			  if (/0x[a-zA-Z0-9]{64}/.test(result.result)) {
			    showNotification('Sent ' + pi / this.ratio + ' CLO to ' + this.accountToEth +', TX: ' + result.result, this.snackbarTypes.success);
			  } else {
			    showNotification('CLO transaction error', this.snackbarTypes.danger); return;
			  }
			})	
			.catch(function(err) {console.log('Fetch fData3 Error', err);});
			
			// showNotification('Success');
			
		} else { showNotification('Trasaction error: low balance?', this.snackbarTypes.danger);}

      	    } else if (status.isFinalized) {
	    }
	  }); //api
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

  public handleAccountSelectionTo(account: string) {
    this.accountToEth = account;
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
    this.setAvail();
    this.setCoo();
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
