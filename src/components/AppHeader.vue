<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn v-if="back_link" dense flat round icon="arrow_back" :to="back_link"/>
      <q-toolbar-title class="text-center">
        {{ title }}
      </q-toolbar-title>
      <q-btn dense flat round icon="menu" @click="$emit('toggleRightDrawer')"/>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  back_link?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Crypto Tips'
})
</script>

<style scoped>

</style>
