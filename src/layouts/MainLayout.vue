<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      show-if-above
      :model-value="appStore.getRightDrawerOpen"
      side="right"
      bordered
      @update:modelValue="appStore.toggleDrawer()"
    >
      <!-- drawer content -->
      <q-item-label header> Essential Links </q-item-label>

      <q-item v-if="isAuthenticated" clickable tag="a" @click="logout">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Log Out</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="isAuthenticated" clickable tag="a" @click="logout">
        <q-item-section avatar>
          <q-icon name="wallet" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Connect Your Wallet</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useFirebase } from 'src/composables/firebase'
import { useAuth } from '@vueuse/firebase'
import { signOut } from 'firebase/auth'
import { useAppStore } from 'src/stores'

const appStore = useAppStore()
const { auth } = useFirebase()
const { isAuthenticated } = useAuth(auth)

const logout = () => signOut(auth)
</script>
