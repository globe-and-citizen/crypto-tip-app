<template>

  <q-header elevated>
    <q-toolbar>

      <q-btn dense flat round icon="arrow_back" to="/"/>
      <q-toolbar-title class="text-center">
        Crypto Tip vs
      </q-toolbar-title>

      <q-btn dense flat round icon="menu" @click="toggleRightDrawer"/>
    </q-toolbar>
  </q-header>
  <q-page-container>
    <div class="q-pa-md">
      <div class="q-gutter-md items-right">
        <q-input
          outlined
          label="Team Name"/>
        <q-input
          outlined
          type="textarea"
          label="Description"/>
        <q-input
          outlined
          label="Member Address"/>
        <!--        <q-btn round color="primary" icon="add" class="float-right"/>-->
        <q-btn class="float-right" style="display: block">
          Add Team
        </q-btn>
      </div>

    </div>
  </q-page-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
