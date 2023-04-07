<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title class="text-center">
        Crypto Tips
      </q-toolbar-title>

      <q-btn dense flat round icon="menu" @click="toggleRightDrawer"/>
    </q-toolbar>
  </q-header>

  <q-page class="justify-evenly">
    <div v-if="isAuthenticated" class="q-pa-md">
      <q-btn to="/addTeam">
        Add Team
      </q-btn>
    </div>
    <div v-else>
      <q-btn @click="signIn">
        Sign In with Google
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {useFirebase} from 'src/composables/firebase';
import {useFirestore, useAuth} from '@vueuse/firebase';
import {doc, setDoc, collection, where, query} from 'firebase/firestore'
import {GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo} from 'firebase/auth'
import {computed} from 'vue';


const {auth, db} = useFirebase()
const {isAuthenticated, user} = useAuth(auth)
const signIn = () => signInWithPopup(auth, new GoogleAuthProvider()).then(
  async (result) => {
    const isNewUser = getAdditionalUserInfo(result)?.isNewUser
    const {email, displayName, photoURL, uid} = result.user

    if (isNewUser) {
      await setDoc(doc(db, 'users', uid), {email, displayName, photoURL})
    }
    console.log(user.value)
  }
)

let teamsQuery = computed(() =>
  query(collection(db, 'teams'), where('userId', '==', user.value ? user.value.uid : ''))
)

const teams = useFirestore(teamsQuery)
</script>
