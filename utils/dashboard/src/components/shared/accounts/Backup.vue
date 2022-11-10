<template>
  <div id="Backup">
    <b-field grouped multiline>
      <Identicon
        :value="address.toString()"
        :size="size"
      />
      {{shortAddress(address)}}
      <b-button
      size="is-small" 
      icon-left="copy" 
      v-clipboard:copy="address"
      @click="toast('Address copied to clipboard')">
      </b-button>
    </b-field>
    <b-field label="password" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="password" type="password"
        @input="validatePassword(password)"
        password-reveal></b-input>
    </b-field>
    <router-link :to="{name: 'accounts'}">
      <b-button icon-left="cloud-download-alt" type="is-dark" 
        @click="makeBackup(address, password);" outlined>
        Backup
      </b-button>
    </router-link>
    <router-link :to="{name: 'accounts'}">
      <b-button icon-left="times" type="is-warning" outlined>
        Cancel
      </b-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identicon from '@polkadot/vue-identicon';
import keyring from '@polkadot/ui-keyring';
import FileSaver from 'file-saver';
//import BasicComponent from '../../BasicComponent.vue'

//import { notificationTypes,  showNotification } from '@/utils/notification';

@Component({
  components: {
    Identicon,
  },
})
export default class Backup extends Vue {
  @Prop(String) public address!: string;
  @Prop(String) public theme!: string;
  @Prop({ default: 64 }) public size!: number;


  public password: string = '';
  public isPassValid: boolean = false;

/*
  private snackbarTypes = {
    success: {
      type: 'is-success',
      actionText: 'View',
      onAction: () => window.open('/', '_blank'),
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
*/
  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password);
  }

  public shortAddress(address: string): string {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return '';
  }

  public makeBackup(address: string, password: string): void {
    if (!address) {
      return;
    }

    try {
      const addressKeyring = address && keyring.getPair(address);
      const json = addressKeyring && keyring.backupAccount(addressKeyring, password);

      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });
      FileSaver.saveAs(blob, `${address}.json`);

	this.showNotification(JSON.stringify(json));
//      this.showNotification(JSON.stringify(json), this.snackbarTypes.success);
//      showNotification(JSON.stringify(json),notificationTypes.success);
//	alert(JSON.stringify(json));
//      const file = new File([JSON.stringify(json)], `${address}.json`, {type: 'application/json;charset=utf-8'});
//      FileSaver.saveAs(file);
    } catch (error) {
      console.error(error);
      return;
    }
  }
/*
  private showNotification(message: string | null, params = this.snackbarTypes.info) {
    this.$buefy.snackbar.open({
      duration: 25000,
      message: `${message}`,
      type: 'is-success',
      position: 'is-bottom',
      actionText: 'OK',
      queue: false,
      ...params,
    });
  }
*/
/*
private showNotification(message: string | null) {
this.$notify({
  group: 'foo',
  title: 'Important message',
  text: message
});
}
*/
private showNotification(message: string | undefined) {
this.$swal(message);
}
}
</script>
