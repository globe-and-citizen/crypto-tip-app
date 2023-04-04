<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="isAuthenticated">
      user
      <div>
        <button @click="logout">
          Log Out
        </button>
      </div>
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
import {useAuth} from '@vueuse/firebase/useAuth';
import {GoogleAuthProvider, signInWithPopup, signOut, getAdditionalUserInfo} from 'firebase/auth'

import { doc, setDoc} from 'firebase/firestore'

const {auth, db} = useFirebase()
const {isAuthenticated} = useAuth(auth)
const signIn = () => signInWithPopup(auth, new GoogleAuthProvider()).then(
  async (result) => {
    const isNewUser = getAdditionalUserInfo(result)?.isNewUser
    console.log(result.user)
    const {email, displayName, photoURL, uid} = result.user

    if (isNewUser) {
      await setDoc(doc(db, 'users', uid), {email, displayName, photoURL})
    }
  }
)
const logout = () => signOut(auth)
</script>
