<template>
  <q-btn-dropdown flat :label="currentLabel">
    <q-list>
      <q-item
        v-for="(name, mode) in config"
        v-bind:key="mode"
        clickable
        v-close-popup
        @click="sortBy(mode)"
        :class="{ 'text-orange': mode === current }"
      >
        <q-item-section>
          <q-item-label>{{ name }}</q-item-label>
        </q-item-section>
        <q-item-section avatar v-if="mode === current">
          <q-icon :name="desc === true ? 'arrow_drop_down' : 'arrow_drop_up'"></q-icon>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  data () {
    return {
      config: {
        'date_added': 'Date Added',
        'taken': 'Date Taken',
        'name': 'Name'
      },
      current: 'date_added',
      currentLabel: 'Date Added',
      desc: true
    }
  },

  created () {
    this.current = this.$store.getters['media/sortMode']
    this.desc = this.$store.getters['media/sortOrder'] === 'desc'
    this.currentLabel = this.config[this.current]
  },

  methods: {
    sortBy (mode) {
      if (mode === this.current) {
        this.desc = !this.desc
      } else {
        this.current = mode
        this.currentLabel = this.config[mode]
        this.desc = true
      }

      this.$store.commit('media/setSortMode', this.current)
      this.$store.commit('media/setSortOrder', this.desc)

      this.$emit('sort')
    }
  }
}
</script>
