<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-center" >
          Crypto Tips
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <q-item-label
        header
      >
        Essential Links
      </q-item-label>
      <div v-if="isAuthenticated">
        <div>{{user.email}}</div>
        <button @click="logout">
          Log Out
        </button>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useFirebase} from 'src/composables/firebase';
import {useAuth} from '@vueuse/firebase';
import {signOut} from 'firebase/auth';

const rightDrawerOpen = ref(false)
const {auth} = useFirebase()
const {isAuthenticated, user} = useAuth(auth)
function toggleRightDrawer () {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
const logout = () => signOut(auth)
</script>
