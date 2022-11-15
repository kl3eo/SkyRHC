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
        :disabled="!accountFrom"
        @click="shipIt2">
				Transfer 1 Pirl
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
  
  public async shipIt2(): Promise<void> {
      const { api } = Connector.getInstance();
      try {
        showNotification('Dispatched');	
	const pirl = 1000000000000; //1Pirl
	
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
	let reh=/https:\/\//gi;let hh = h.replace(reh,"");
	let hhh = hh.split('.');
	switch(hhh[0]) { 	
		case 'club' : accountToConst = '5ENzTTUL3zvnMP8usRo3ZcGmMhkaHsvFUP6PMedLV9EWtLFx';
			break; 
		case 'milan' : accountToConst = '5Dz8Ew8bsrd9BHCygQSBdqnBwiKGUMk86HVmrQhpXpUSDXKT';
			break; 	
		default: console.error('Unrecognized room name', hhh[0]);
	}
	
	api.tx.balances
	.transfer(accountToConst, pirl)
	.signAndSend(alicePair, { nonce }, ({ events = [], status }) => {
	  console.log('Transaction status:', status.type);
	  console.log('Status', status);

	  if (status.isInBlock) {
        	console.log('Included at block hash', status.asInBlock.toHex());
        	
		let success = true;
		
		//console.log('Events:');
        	events.forEach(({ event: { data, method, section }, phase }) => {
          		//console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
			if (method === 'ExtrinsicFailed') success = false;
        	});
		
		if (success) {
			this.sender(this.accountFrom, accountToConst, pirl?.toString());
// update db
			let checker_port = '8453';
			let formData = new FormData();
			formData.append('sess', getVars);
			formData.append('pass', 'lol');
			formData.append('acc_id', this.accountFrom.address);
			fetch(h + ':' + checker_port + '/cgi/genc/tester.pl', {body: formData, method: 'post', mode: 'no-cors'}).then(
                	function(response) {
				//console.log(response);		
			}).catch(function(err) {console.log('Fetch Error', err);});
			showNotification(status.asInBlock.toHex(), this.snackbarTypes.success);
		} else { showNotification('Trasaction error: low balance?', this.snackbarTypes.danger);}
//
      	  } else if (status.isFinalized) {
        	console.log('Finalized block hash', status.asFinalized.toHex());
        	process.exit(0);
	  }
	});
	
      } catch (e) {
        console.error('[ERR: TRANSFER SUBMIT]', e)
        showNotification(e.message, this.snackbarTypes.danger);
      }
  }

  public async shipIt(): Promise<void> {
    const { api } = Connector.getInstance();
      try {
        showNotification('Dispatched');
	const pirl = 1000000000000; //1Pirl

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
	let reh=/https:\/\//gi;let hh = h.replace(reh,"");
	let hhh = hh.split('.');
	switch(hhh[0]) { 	
		case 'club' : accountToConst = '5ENzTTUL3zvnMP8usRo3ZcGmMhkaHsvFUP6PMedLV9EWtLFx';
			break; 
		case 'milan' : accountToConst = '5Dz8Ew8bsrd9BHCygQSBdqnBwiKGUMk86HVmrQhpXpUSDXKT';
			break; 	
		default: console.error('Unrecognized room name', hhh[0]);
	}
	const tx = await exec(this.accountFrom.address, this.password, api.tx.balances.transfer, [accountToConst, pirl?.toString()]);
console.log('tx:', tx);
        this.sender(this.accountFrom, accountToConst, pirl?.toString());
// update db
	let checker_port = '8453';
        let formData = new FormData();
        formData.append('sess', getVars);
        formData.append('pass', 'lol');
        formData.append('acc_id', this.accountFrom.address);
        fetch(h + ':' + checker_port + '/cgi/genc/tester.pl', {body: formData, method: 'post', mode: 'no-cors'}).then(
                function(response) {
	/*
			if (response.status !== 200) {
                                console.log('Looks like there was a problem. Status Code: ' + response.status);
                                return;
                        }
                                console.log(response);		
        */

	}).catch(function(err) {console.log('Fetch Error', err);});
//
	showNotification(tx, this.snackbarTypes.success);
      } catch (e) {
        console.error('[ERR: TRANSFER SUBMIT]', e)
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

  public sender(accountFrom: KeyringPair, accountToConst: string, a: string) {
	const mess = { action: 'Bound', from: accountFrom.address, to: accountToConst, sum: a, payload: 'function doSwitchOneMode(el){if(!playSomeMusic&&!shareSomeScreen){fullscreen=true; chat_shown=1;$("logger").click();let re=/video-/gi;let a=el.id.replace(re,"");let v=$("video-"+a);if(!v.fullscreenElement && !check_iOS()){v.requestFullscreen()}(function(){$("room-header").style.display="none";$("room-backer").style.display="block";if (!small_device) {$("room").style.minWidth = "480px";$("room").style.marginLeft = "0px";}if(Object.keys(participants).length){for(var key in participants){if(participants[key].name!=a){participants[key].dispose();delete participants[key]}}}let c=$("one-"+a);if (c) c.fade(0);}).delay(500)}else{if(playSomeMusic){flashText("PLAYING VIDEO! STOP?")}else{flashText("SHARING SCREEN! STOP?")}}}' };
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
