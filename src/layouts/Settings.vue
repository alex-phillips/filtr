<template>
  <q-page>
    <q-drawer
      v-model="drawerIsOpen"
      :breakpoint="700"
      elevated
      ref="settingsDrawer"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item
            clickable
            v-ripple
            @click="$router.push('/settings')"
          >
            <q-item-section avatar>
              <q-icon color="primary" name="settings" />
            </q-item-section>

            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push('/settings/account')"
          >
            <q-item-section avatar>
              <q-icon color="primary" name="person" />
            </q-item-section>

            <q-item-section>Account</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-toolbar class="bg-grey-3" v-if="$q.screen.lt.sm">
      <q-btn icon="menu" flat clickable @click="drawerIsOpen = !drawerIsOpen"></q-btn>
    </q-toolbar>

    <div class="settings-pane">
      <router-view :key="$route.path"></router-view>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      drawerIsOpen: true
    }
  }
}
</script>

<style>
.settings-pane h5 {
  margin-bottom: 0;
}
</style>
