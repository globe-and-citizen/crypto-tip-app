<template>
  <AppHeader
    title="Team : "
    back_link="/"
    @toggleRightDrawer="appStore.toggleDrawer()"
  />
  <q-page-container>
    <div class="q-pa-md">
    </div>
  </q-page-container>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue';
import {useAppStore} from 'src/stores';
import {useFirebase} from 'src/composables/firebase';
import {useAuth} from '@vueuse/firebase';
import {ulid} from 'ulid'
import {useQuasar} from 'quasar';

const appStore = useAppStore()
const {auth, db} = useFirebase()
const {isAuthenticated, user} = useAuth(auth)

const id = ulid()
const $q = useQuasar()

if (!isAuthenticated) {
  // TODO redirect to home page
}
</script>

<style scoped>

</style>
