<template>
  <q-input filled v-model="text" input-class="text-right" @keyup.enter="$router.push(`/search?query=${text}`)">
    <template v-slot:append>
      <q-icon v-if="text === ''" name="search" />
      <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
    </template>
  </q-input>
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  }
}
</script>
