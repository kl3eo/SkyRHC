<template>
  <div id="transfer">
    <DisabledInput v-if="conn.chainName" 
      label="Chain" :value="conn.chainName" />
		<b-field v-else>
			<!-- p class="has-text-danger">You are not connected. 
				<router-link :to="{ name: 'settings' }">
				Go to settings and pick node</router-link>
			</p -->
			<p>Connecting .. please wait.</p>
		</b-field>
    <Dropdown mode='accounts' :externalAddress="transfer.from"
			@selected="handleAccountSelectionFrom" />
    <b-field label="password" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal>
      </b-input>
    </b-field>
      <div class="transaction buttons">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!accountFrom || already == 1 || already == -1 || !getPrice()"
        @click="shipIt">
				{{ already ? 'Waiting ...' : 'Transfer ' + getPrice() + ' RHC' }}
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
export default class Binder extends Vue {

  public rhc1 = 1000000000000; //1RHC
  public rhc5 = 5000000000000; //5RHC
  public rhc50 = 50000000000000; //50RHC
	
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
  private already = 0;
  private rhc = 0;
  private sess: string = '';
  private accountFrom: any = null;
  private accountTo: any = null;
  private badRpcCall = 0;
  public transfer_to: string = '';
  public transfer_a: string = '';
  
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

  getMessage(message: string) {
    return message;
  }

  inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }
  
  makeUrlee (s: string) {
      const h = this.getParentOrigin()
      // console.log('parent', h)
      const reh = /https:\/\//gi
      const hh = h.replace(reh, '')
      const poh = hh.split(':')
      const hhh = hh.split('.')
      const boo = hhh[0] === 'room-house' || ((hhh[0] === 'www' || hhh[0] === 'slotmachine' || hhh[0] === 'slotjs') && hhh[1] === 'room-house');
      const checkerPort = boo ? '' : ''
      const genc = boo ? '' : '/genc'
      const u = 'https://' + poh[0] + checkerPort + '/cgi' + genc + '/' + s
      return u
  }
    
  getParentOrigin() {
    const locationAreDistinct = (window.location !== window.parent.location);
    const parentOrigin = ((locationAreDistinct ? document.referrer : document.location) || "").toString();
// console.log('Here parent origin is', parentOrigin, 'ref is', document.referrer, 'loc is', document.location)
    if (parentOrigin) {
      let h = new URL(parentOrigin).origin
// console.log('returning', h)
      return h;
    }

    const currentLocation = document.location;

    if (currentLocation.ancestorOrigins && currentLocation.ancestorOrigins.length) {
// console.log('returning anc', currentLocation.ancestorOrigins[0])
      return currentLocation.ancestorOrigins[0];
    }

    let refo = this.getRefo();

    if (refo.length) {
// console.log('returning refo', refo)
    return 'https://' + refo;
    }
    return "";
  }

  getSession() {
    let sess = '';
// console.log('getSession, wlh is', window.location.href);
    let uri0 = window.location.href.split('&');
    let uri = uri0[0].split('?');

    if(uri.length == 2) {
	let vars = uri[1].split('#');
	vars.forEach(function(v) {
	let tmp = v.split('=');
	if(tmp.length == 2)
		sess = tmp[1];
	});
    }

// console.log('getSession, sess is', sess, 'saved sess is', this.$store.state.callOptions.session );

    if (sess.length == 0 && this.$store.state.callOptions.session) sess = this.$store.state.callOptions.session.length ? this.$store.state.callOptions.session : '';
    return sess;
  }

  getRefo() {

    let refo = '';
    let refee = window.location.href.split('&');

    if(refee.length == 2) {
	let vars = refee[1].split('#');
	vars.forEach(function(v) {
	let tmp = v.split('=');
	if(tmp.length == 2)
		refo = tmp[1];
	});
    }
console.log('getRefo, refo is', refo);
    return refo;
  }
  
  getPrice() {
    let price = 0;
    // let sess = this.getSession();
    // price = sess.length === 16 ? 5 : sess.length === 24 ? 50 : price;
    if (this.transfer_a != '') price = parseFloat(this.transfer_a);
    return price;
  }
      
  public async shipIt(): Promise<void> {
      const { api } = Connector.getInstance();
      try {
        this.already = 1;
	showNotification('Dispatched.. wait result of TX');
	
	const alicePair = keyring.getPair(this.accountFrom.address);
	alicePair.decodePkcs8(this.password);
	
	const { nonce } = await api.query.system.account(this.accountFrom.address);

	let sess = this.getSession();
	let accountToConst:string = '';
        let h = this.getParentOrigin(); 
	let reh=/https:\/\//gi; let hh = h.replace(reh,"");
	let hhh = hh.split('.');
	switch(hhh[0]) { 	
		case 'club' : accountToConst = '5ENzTTUL3zvnMP8usRo3ZcGmMhkaHsvFUP6PMedLV9EWtLFx'; //sorba
			break; 
		case 'milan' : accountToConst = '5Dz8Ew8bsrd9BHCygQSBdqnBwiKGUMk86HVmrQhpXpUSDXKT'; //milan
			break; 	
		case 'www' : accountToConst = '5CkLgg19XECX98Lxam7kd4yZWyMqs6dG5Z686e2EkwtHqU86';
			break; 
		case 'room-house' : accountToConst = '5CkLgg19XECX98Lxam7kd4yZWyMqs6dG5Z686e2EkwtHqU86';
			break;
		case 'slotmachine' : accountToConst = '5CkLgg19XECX98Lxam7kd4yZWyMqs6dG5Z686e2EkwtHqU86';
			break;
		case 'slotjs' : accountToConst = '5GmdHWhPr6nBJDvFXpMcHm7QBLQcgnAjU3YzupbxzLs9z4xa'; //elbrus
			break;
		default: accountToConst = '5CkLgg19XECX98Lxam7kd4yZWyMqs6dG5Z686e2EkwtHqU86'; //xetr
	}

	// this.rhc = this.transfer.amount ? this.transfer.amount : sess.length === 16 ? this.rhc5 : this.rhc50;
	this.rhc = this.transfer.amount ? this.transfer.amount : 0;
	accountToConst = this.transfer_to == '' ? accountToConst : this.transfer_to;
	
	const urlee = this.makeUrlee('tester.pl');
	// console.log('urlee', urlee);
	let fData = new FormData();
	fData.append('sess', sess);
	fData.append('pass', 'lol');
	fData.append('acc_id', this.accountFrom.address);
	
	await fetch(urlee, {body: fData, method: 'post', mode: 'no-cors'})
	.then((response) => {})
	.catch((err) => {console.log('Fetch Error', err); this.badRpcCall = 1;});
	
	if (this.badRpcCall === 1) {showNotification('RPC error', this.snackbarTypes.danger); this.already = 0; return;}
	
	const trans = api.tx.balances.transfer(accountToConst, this.rhc);
	trans.signAndSend(alicePair, { nonce }, async ({ events = [], status }) => {

	    if (status.isInBlock) {
        	
		let success = true;

        	events.forEach(({ event: { data, method, section }, phase }) => {if (method === 'ExtrinsicFailed') success = false;});
		
		if (success) {

			const thx = trans.hash.toHex();
			
			let formData = new FormData();
			formData.append('sess', sess);
			formData.append('pass', 'lol');
			formData.append('bhash', status.asInBlock.toHex());
			formData.append('txhash', thx);
			formData.append('acc_id', this.accountFrom.address);
			
			await fetch(urlee, {body: formData, method: 'post', mode: 'no-cors'})
			.then((response) => {})
			.catch((err) => {console.log('Fetch Error', err); this.badRpcCall = 1;});

			if (this.badRpcCall === 1) {showNotification('Some error', this.snackbarTypes.danger); this.already = 0; return;}
			
			let boo = hhh[0] === 'room-house' || ((hhh[0] === 'www' || hhh[0] === 'slotmachine' || hhh[0] === 'slotjs') && hhh[1] === 'room-house')
			if (!boo) this.sender1(this.accountFrom, accountToConst, this.rhc?.toString());
			if (boo) this.sender2();
						
			showNotification(status.asInBlock.toHex(), this.snackbarTypes.success); this.already = -1;
		} else { showNotification('Trasaction error: low balance?', this.snackbarTypes.danger); this.already = 0;}

      	    } else if (status.isFinalized) {
	    }
	}); //api
	
      } catch (e) {
       showNotification(e.message, this.snackbarTypes.danger); this.already = 0;
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
    this.sender3();
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

  public sender1(accountFrom: KeyringPair, accountToConst: string, a: string) {
	const mess = { action: 'Bound', from: accountFrom.address, to: accountToConst, sum: a, payload: 'function doSwitchOneMode(el){if(!playSomeMusic&&!shareSomeScreen){fullscreen=true; chat_shown=1;$("logger").click();let re=/video-/gi;let a=el.id.replace(re,"");let v=$("video-"+a);if(!v.fullscreenElement && !check_iOS()){v.requestFullscreen()}(function(){$("room-header").style.display="none";$("room-backer").style.display="block";if (!small_device) {$("room").style.minWidth = "480px";$("room").style.marginLeft = "0px";}if(Object.keys(participants).length){for(var key in participants){if(participants[key].name!=a){participants[key].dispose();delete participants[key]}}}let c=$("one-"+a);if (c) c.fade(0);}).delay(500)}else{if(playSomeMusic){flashText("PLAYING VIDEO! STOP?")}else{flashText("SHARING SCREEN! STOP?")}}}' };
	window.parent.postMessage(JSON.stringify(mess), '*');   
  }

  public sender2() {
	const mess = { action: 'Bound' };
	window.parent.postMessage(JSON.stringify(mess), '*');   
  }

  public sender3() {
        const mess = { action: 'Rehash' };
        window.parent.postMessage(JSON.stringify(mess), '*');
  }
  
  public externalURI() {
    if (this.$route.params.from) {
      this.transfer.from = this.$route.params.from;
    }
    if (this.$route.params.to) {
      let a = this.$route.params.to.split(':'); 
      this.transfer_to = a[1];
      this.transfer.to = this.transfer_to;
    } else {
      this.transfer_to = this.$store.state.callOptions.to && this.$store.state.callOptions.to.length ? this.$store.state.callOptions.to : '';
      this.transfer.to = this.transfer_to;
    }
    
    if (this.$route.params.amount) {
      let b = this.$route.params.amount.split(':'); 
      this.transfer_a = b[1];
      this.transfer.amount = this.transfer_a.length ? BigInt(parseFloat(this.transfer_a) * 1000000000000): 0;
    } else {
      this.transfer_a = this.$store.state.callOptions.amount && this.$store.state.callOptions.amount.length ? this.$store.state.callOptions.amount : '';
      this.transfer.amount = this.transfer_a.length ? BigInt(parseFloat(this.transfer_a) * 1000000000000) : 0;
    }
    
    if (this.$route.params.to && this.$route.params.amount) {
      this.$store.commit('setCallOptions',{amount: this.transfer_a, to: this.transfer_to, session: this.getSession()})
    } else {
      this.$store.commit('setCallOptions',{amount: '', to: '', session: this.getSession()})
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
