<template>
  <AppHeader title="Crypto Tips" @toggleRightDrawer="appStore.toggleDrawer()"/>
  <q-page style="max-width: 768px; width: 100%">
    <div v-if="isAuthenticated" class="q-pa-md">
      <TeamComponent v-for="team in teams" :key="team.uid" :team="team"></TeamComponent>
      <div class="row justify-center q-pa-xl">
        <q-btn to="/addTeam" data-cy="add_team"> Add Team</q-btn>
      </div>
    </div>
    <div v-else class="q-pa-xl">
      <q-btn @click="signIn" icon="google" data-cy="sign_in"> Sign In with Google</q-btn>
      <q-btn @click="signInWithEthereum" icon="google" data-cy="sign_in"> Sign In with Ethereum</q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {useFirebase} from 'src/composables/firebase'
import {useFirestore, useAuth} from '@vueuse/firebase'
import {doc, setDoc, collection, where, query} from 'firebase/firestore'
import {GoogleAuthProvider, signInWithPopup, signInAnonymously, getAdditionalUserInfo} from 'firebase/auth'
import {computed} from 'vue'
import AppHeader from 'components/AppHeader.vue'
import {useAppStore} from 'src/stores'
import TeamComponent from 'components/TeamComponent.vue'
import {useQuasar} from 'quasar'
import {useWallet} from '../composables/wallet';
import {ethers} from 'ethers';
import {SiweMessage} from 'siwe';

const appStore = useAppStore()

const {auth, db} = useFirebase()
const {isAuthenticated, user} = useAuth(auth)
const $q = useQuasar()

const {isConnected, connectWallet, userAddress} = useWallet()
const BACKEND_ADDR = 'http://localhost:3000'

const domain = window.location.host;
const origin = window.location.origin;
const provider = new ethers.providers.Web3Provider(window.ethereum);
let address;

async function createSiweMessage(address, statement) {
  const res = await fetch(`${BACKEND_ADDR}/nonce`, {
    credentials: 'include',
  });
  const nonce = await res.text();
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1',
    nonce
  });
  console.log('nonce recived : ', nonce)
  return message.prepareMessage();
}

const signInWithEthereum = async () => {

  const signer = await provider.getSigner();
  address = await signer.getAddress()
  const message = await createSiweMessage(
    address,
    'Sign in with Ethereum to the app.'
  );
  const signature = await signer.signMessage(message);
  console.log('message : \'', message, '\'')
  console.log('signature : \'', signature, '\'')

  const res = await fetch(`${BACKEND_ADDR}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({message, signature}),
    credentials: 'include'
  });

  if (!res.ok) {
    console.error(`Failed in getInformation: ${res.statusText}`);
    return
  }
  const {token} = await res.json();
  const data = await fetch(`${BACKEND_ADDR}/personal_info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  });

  console.log('response', await data.json());
}
const signIn = () => {
  if (import.meta.env.VITE_MODE == 'test') {
    signInAnonymously(auth).then(async (result) => {
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser
      const {uid} = result.user
      if (isNewUser) {
        await setDoc(doc(db, 'users', uid), {email: '', displayName: '', photoURL: ''})
      }
    })
  } else {
    signInWithPopup(auth, new GoogleAuthProvider()).then(async (result) => {
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser
      const {email, displayName, photoURL, uid} = result.user
      if (isNewUser) {
        await setDoc(doc(db, 'users', uid), {email, displayName, photoURL})
        $q.notify({type: 'info', message: 'Welcome to our platform! '})
      } else {
        $q.notify({type: 'info', message: 'Welcome back! It\'s great to see you again.'})
      }
    })
  }
}

const teamsQuery = computed(() => query(collection(db, 'teams'), where('user', '==', user.value ? user.value.uid : '')))

const teams = useFirestore(teamsQuery, undefined, {autoDispose: false})
</script>
