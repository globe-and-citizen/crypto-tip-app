<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <q-item-label
        header
      >
        Essential Links
      </q-item-label>

      <q-item v-if="isAuthenticated"
              clickable
              tag="a"
              @click="logout"
      >
        <q-item-section
          avatar
        >
          <q-icon name="logout"/>
        </q-item-section>

        <q-item-section>
          <q-item-label>Log Out</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>
    <q-page-container>
      <router-view/>
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
const {isAuthenticated} = useAuth(auth)

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

const logout = () => signOut(auth)
</script>
