<template>
  <AppHeader title="Crypto Tips" @toggleRightDrawer="appStore.toggleDrawer()" />
  <q-page class="justify-evenly">
    <div v-if="isAuthenticated" class="q-pa-md">
      <TeamComponent v-for="team in teams" :key="team.uid" :team="team"></TeamComponent>
      <div class="row justify-center q-pa-xl">
        <q-btn to="/addTeam"> Add Team </q-btn>
      </div>
    </div>
    <div v-else class="row justify-center q-pa-xl">
      <q-btn @click="signIn" icon="google"> Sign In with Google </q-btn>
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
