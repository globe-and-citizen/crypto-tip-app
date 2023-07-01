<template>
  <AppHeader title="Crypto Tips" @toggleRightDrawer="appStore.toggleDrawer()" />
  <q-page style="max-width: 768px; width: 100%" class="q-pa-md">
    <h1 class="text-h3">Dashboard</h1>
    <div class="row" style="gap: 50px">
      <div class="col-12 col-sm" style="border: solid gray 1px; border-radius: 15px">
        <h1 class="text-h5 text-center">Transactions</h1>
        <ul>
          <li>ds</li>
          <li>ds</li>
          <li>ds</li>
          <li>ds</li>
        </ul>
      </div>
      <div class="col column" style="gap: 50px">
        <div style="border: solid gray 1px; border-radius: 15px">
          <h1 class="text-h5 text-center">My Balance</h1>
          <p class="text-h5 text-center text-bold">0.50 Ether</p>
        </div>
        <div style="border: solid gray 1px; border-radius: 15px">
          <h1 class="text-h5 text-center">Contract Balance</h1>
          <p class="text-h5 text-center text-bold">2.63 Ether</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useFirebase } from 'src/composables/firebase'
import { useFirestore, useAuth } from '@vueuse/firebase'
import { doc, setDoc, collection, where, query } from 'firebase/firestore'
import { GoogleAuthProvider, signInWithPopup, signInAnonymously, getAdditionalUserInfo } from 'firebase/auth'
import { computed } from 'vue'
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import TeamComponent from 'components/TeamComponent.vue'

const appStore = useAppStore()

const { auth, db } = useFirebase()
const { isAuthenticated, user } = useAuth(auth)
const signIn = () => {
  if (import.meta.env.VITE_MODE == 'test') {
    signInAnonymously(auth).then(async (result) => {
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser
      const { uid } = result.user
      if (isNewUser) {
        await setDoc(doc(db, 'users', uid), { email: '', displayName: '', photoURL: '' })
      }
    })
  } else {
    signInWithPopup(auth, new GoogleAuthProvider()).then(async (result) => {
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser
      const { email, displayName, photoURL, uid } = result.user
      if (isNewUser) {
        await setDoc(doc(db, 'users', uid), { email, displayName, photoURL })
      }
    })
  }
}

const teamsQuery = computed(() => query(collection(db, 'teams'), where('user', '==', user.value ? user.value.uid : '')))

const teams = useFirestore(teamsQuery, undefined, { autoDispose: false })
</script>
