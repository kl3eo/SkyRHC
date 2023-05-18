<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
          SkyRHC Light Wallet
	  </h1><br>
          <h2 class="subtitle">
            <a href="https://twitter.com/RoomHouseOffic1" target="_blank">🏛 Our Twitter</a>
          </h2>
		<a href="https://t.me/skypirl">👋 Reach us on Telegram.</a>
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
