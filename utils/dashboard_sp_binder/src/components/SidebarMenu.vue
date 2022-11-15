<template>
  <b-sidebar
    :mobile="mobileView"
    position="fixed"
    :reduce="reduce"
    type="is-dark"
    open
    fullheight
    :can-cancel="false"
  >
    <div class="p-1">
      <div class="block"></div>
      <div class="block"></div>
      <b-menu class="is-custom-mobile">
        <b-menu-list icon-pack="fa">
          <b-menu-item
            class="sidebar-menu__item"
            v-for="row in sidebar"
            v-bind:key="row.name"
            @click="currentRow = row"
            :icon="row.icon"
            :label="row.name"
            :tag="row.tag"
            :to="row.to"
          ></b-menu-item>
        </b-menu-list>
      </b-menu>
      <!-- b-button
        class="toggle-button"
        :icon-left="toggleIcon"
        @click="toggleSidebar"
        rounded
      >
      </b-button -->
    </div>
  </b-sidebar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import SettingInfo from '@/components/shared/SettingInfo.vue';
import NetworkVisualCue from '@/components/explorer/NetworkVisualCue.vue';

//import Router from 'vue-router';
//Vue.use(Router);

@Component({
  components: {
    SettingInfo,
    NetworkVisualCue,
  },
})
export default class SidebarMenu extends Vue {
  public reduce = true;
  //public addon = this.$route.query.to ? '?'+this.$route.query.to.toString() : '';
  public sidebar: any = [
    {
      name: 'Accounts',
      icon: 'users',
      to: { name: 'accounts' },
      tag: 'router-link',
    },
    {
      name: 'Binder',
      icon: 'paper-plane',
      //to: { name: 'binder'+this.toAcco },
      to: { name: 'binder' },
      tag: 'router-link',
    },

  ];
  public externalLinks: any = [

  ];
  public currentRow: any = this.sidebar[0];
  public isSidebarClosed = true;
  public showVerbose = false;
  public isActive = true;
  get hasBasicMode() {
    return this.$store.getters.getSettings.uiMode === 'light';
  }

  @Emit('toggle')
  public toggleSidebar() {
    this.reduce = !this.reduce;
    return this.reduce;
  }

  get toggleIcon() {
    return this.reduce ? 'angle-double-right' : 'angle-double-left'
  }

  get mobileView() {
    return this.reduce ? 'reduce' : ''
  }
/*
  get toAcco() {
    return this.$route.query.to ? '/?'+this.$route.query.to.toString() : '';
  }
*/
}
</script>

<style lang="scss">
@import "@/colors";
.sidebar-menu__icon {
  width: 48px;
}

.circle {
  background: #fff;
  border-radius: 70px;
}

button.toggle-button.is-rounded {
  bottom: 1em;
  position: fixed;
}

.menu-list {
  li {
    a {
      span:nth-child(2) {
        vertical-align: super;
        padding-left: 0.3em;
      }
    }
  }
}

.b-sidebar {
  .sidebar-content.is-dark {
    .menu-list {
      li {
        a {
          span {
            color: $less-white;
          }

          &.router-link-active {
            background-color: $primary;
            color: $less-white;
          }

          &:not(.router-link-active):hover {
            background-color: #dbdbdb;

            span.icon {
              color: black;
            }
          }
        }
      }
    }
  }
}

p.menu-label {
  color: $less-white;
}

.p-1 {
  padding: 1em;
  height: 100%;
}
.sidebar-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  .sidebar-layout {
    display: flex;
    flex-direction: row;
    min-height: 100%;
  }
}
@media screen and (max-width: 1023px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini-mobile {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .menu-list {
            li {
              a {
                span:nth-child(2) {
                  display: none;
                }
              }
              ul {
                padding-left: 0;
                li {
                  a {
                    display: inline-block;
                  }
                }
              }
            }
          }
          .menu-label:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1024px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .menu-list {
            li {
              a {
                span:nth-child(2) {
                  display: none;
                }
              }
              ul {
                padding-left: 0;
                li {
                  a {
                    display: inline-block;
                  }
                }
              }
            }
          }
          .menu-label:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
