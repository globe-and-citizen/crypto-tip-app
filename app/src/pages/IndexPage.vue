<template>
  <AppHeader title="Crypto Tips" @toggleRightDrawer="appStore.toggleDrawer()"/>
  <q-page style="max-width: 768px; width: 100%">
    <div v-if="appStore.getToken" class="q-pa-md">
      <div v-if="!error && isFinished && !isFetching">
        <TeamComponent v-for="team in teams" :key="team.uid" :team="team"></TeamComponent>
      </div>
      <div class="row justify-center q-pa-xl">
        <q-btn to="/addTeam" data-cy="add_team"> Add Team</q-btn>
      </div>
    </div>
    <div v-else class="q-pa-xl">
      <q-btn @click="signInWithEthereum" icon="google" data-cy="sign_in"> Sign In with Ethereum</q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import {useAppStore} from 'src/stores'
import {useQuasar} from 'quasar'
import {ethers} from 'ethers';
import {SiweMessage} from 'siwe';
import {useFetch} from '@vueuse/core'
import {useWallet} from '../composables/wallet';
import TeamComponent from '../components/TeamComponent.vue';
import {onMounted} from 'vue';

const {isConnected, connectWallet} = useWallet()
const appStore = useAppStore()

const $q = useQuasar()

const BACKEND_ADDR = 'http://localhost:3000'

const {execute, isFetching, isFinished, error, data: teams} = useFetch(BACKEND_ADDR + '/teams', {
  beforeFetch({options, cancel}) {
    console.log('before fetch', appStore.getToken)
    if (!appStore.getToken)
      cancel()

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${appStore.getToken}`,
    }
    return {
      options,
    }
  },
  immediate: false
}).json()
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
  return message.prepareMessage();
}

const signInWithEthereum = async () => {
  console.log('is connected', isConnected.value)
  if (!isConnected.value) {
    await connectWallet()
  }
  const signer = await provider.getSigner();
  address = await signer.getAddress()
  const message = await createSiweMessage(address, 'Sign in with Ethereum to the Crypto Tips.');
  const signature = await signer.signMessage(message);
  const res = await fetch(`${BACKEND_ADDR}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({message, signature}),
    credentials: 'include'
  });

  if (res.status == 201) {
    $q.notify({
      message: 'Welcome to our platform! ',
      color: 'positive',
      icon: 'check',
      position: 'top',
      timeout: 2000
    })
  } else if (res.status == 200) {
    $q.notify({
      message: 'Welcome back! It\'s great to see you again.',
      color: 'positive',
      icon: 'check',
      position: 'top',
      timeout: 2000
    })
  }

  if (!res.ok) {
    console.error(`Failed to verify the signature: ${res.statusText}`);
    return
  }
  const {token} = await res.json();
  appStore.setToken(token)

  await execute()
}

onMounted(async () => {
  if (appStore.getToken)
    await execute()
})

</script>
