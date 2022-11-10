<template>
  <div style="max-height:480px;">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title" style="margin-top:-39px;">
          <span>SkyPirl Account</span>
	  </h1>
	  <p class="small_text">To switch to Cinema mode, send 0.01 Pirl to Room-House in "Transfer" menu.
	 </p><br>
	<p>To restore account from JSON file or create a new account, use "Accounts" menu.</p><br>

        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Landing extends Vue {

  public async mounted() {
    this.$store.commit('setExplorer',{provider: 'subscan', chain: 'kusama'})
  }
}
</script>

<style scoped>
.subtitle {
  text-decoration: underline;
}
</style>
