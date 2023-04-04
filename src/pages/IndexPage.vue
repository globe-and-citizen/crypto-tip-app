<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="isAuthenticated">
      <button @click="logout">
        Log Out
      </button>
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
import {GoogleAuthProvider, signInWithPopup, signOut, getAdditionalUserInfo} from 'firebase/auth'
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
console.log(teams.value)
const logout = () => signOut(auth)
</script>
