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
		<Dropdown :externalAddress="transfer.to" v-if="!transfer.to"
			@selected="handleAccountSelectionTo" />
		<DisabledInput v-if="transfer.to" label="To" :value="transfer_to" />
    <Balance v-if="!transfer.amount" :argument="{ name: 'balance', type: 'balance' }" @selected="handleValue"  />
    <b-field label="password" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal>
      </b-input>
    </b-field>
      <div class="transaction buttons">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!accountFrom || already == 1 || already == -1"
        @click="shipIt">
				{{ already > 0 ? 'Waiting ...' : transfer_a != '' ? 'Transfer '+transfer_a+' RHC' : 'Make Transfer' }}
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
  private already = 0;
  private accountFrom: any = null;
  private accountTo: any = null;
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


  public async shipIt(): Promise<void> {
    this.already = 1;
    const { api } = Connector.getInstance();
      try {
        showNotification('Dispatched');
        console.log([this.transfer_to, this.balance])
	const pirl = this.transfer.amount ? this.transfer.amount : this.balance/1000;
	
 	const tx = await exec(this.accountFrom.address, this.password, api.tx.balances.transfer, [this.transfer_to, pirl?.toString()]);
        showNotification(tx, this.snackbarTypes.success); this.already = -1;
      } catch (e) {
        console.error('[ERR: TRANSFER SUBMIT]', e)
        showNotification(e.message, this.snackbarTypes.danger);this.already = 0;
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
    this.transfer_to = this.accountTo.address;
  }

  public handleValue(value: any) {
    Object.keys(value).map((item) => {
      (this as any)[item] = value[item];
    });
  }

  public externalURI() {
    if (this.$route.params.from) {
      this.transfer.from = this.$route.params.from;
    }
    if (this.$route.params.to) {
      let a = this.$route.params.to.split(':'); 
      this.transfer_to = a[1];
      this.transfer.to = this.transfer_to;
    }
    if (this.$route.params.amount) {
// console.log('amount', this.$route.params.amount)
      let b = this.$route.params.amount.split(':'); 
      this.transfer_a = b[1];
      this.transfer.amount = BigInt(parseFloat(this.transfer_a) * 1000000000000);
// console.log('amount',this.transfer.amount, 'transfer_a', this.transfer_a);
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
