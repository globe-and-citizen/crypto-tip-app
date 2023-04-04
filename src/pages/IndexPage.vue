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
import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'
const {auth} = useFirebase()
const {isAuthenticated, user} = useAuth(auth)
const signIn = () => signInWithPopup(auth, new GoogleAuthProvider())
const logout = () => signOut(auth)
</script>
