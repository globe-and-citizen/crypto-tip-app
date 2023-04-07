<template>
  <AppHeader
    title="Create Team"
    back_link="/"
    @toggleRightDrawer="toggleAction()"
  ></AppHeader>
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
import AppHeader from 'components/AppHeader.vue';

const toggleAction = function () {
  const i = 0;
  console.log(i)
}
</script>

<style scoped>

</style>
