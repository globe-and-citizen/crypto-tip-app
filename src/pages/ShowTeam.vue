<template>
  <AppHeader :title="`Team :  ${teamData ? teamData.name : ''}`" back_link="/" @toggleRightDrawer="appStore.toggleDrawer()" />
  <q-page style="padding: 10px 0 0; max-width: 768px" class="full-width">
    <div class="q-mx-sm q-px-lg row justify-between items-center">
      <q-btn @click="editTeam()" icon="edit" label="Edit Team" flat color="primary" />
      <q-btn @click="deleteTeam()" icon="delete" label="Delete Team" flat color="red" />
    </div>
    <div class="q-mx-sm" v-if="teamData">
      <div class="q-pa-lg q-pt-sm">
        <h2 class="q-my-none text-h4 text-bold clamp">{{ teamData.name }}</h2>
        <p>Description : {{ teamData.description }}</p>
        <p>Members : {{ teamData.members.length }}</p>
        <p>Member list :</p>
        <ul>
          <li v-for="member in teamData['members']" :key="member">{{ shortAddress(member) }}</li>
        </ul>
        <q-btn @click="connectWallet()" v-if="!isConnected">Connect Your wallet</q-btn>
      </div>

      <q-form @submit="sendTips()" class="q-gutter-md q-pa-lg" ref="tipsForm">
        <q-toggle :label="value ? 'Send Tips' : 'Push Tips'" v-model="value" color="green" keep-color />
        <q-input
          outlined
          v-model="tipsAmount"
          label="Tips Amount"
          :rules="[(val) => (val !== null && val !== '') || 'Please type an Amount', (val) => /^-?\d+(\.\d+)?$/.test(val) || 'Please type a real value']"
        />
        <div>
          <q-btn :label="value ? 'Send Tips' : 'Push Tips'" type="submit" color="primary" />
        </div>
        <q-inner-loading :showing="loading" class="shadow-1">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { useFirebase } from 'src/composables/firebase'
import { useWallet } from 'src/composables/wallet'
import { useAuth, useFirestore } from '@vueuse/firebase'
import { useRouter } from 'vue-router'
import { computed, ref, Ref } from 'vue'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { useQuasar } from 'quasar'
import { timeout } from 'workbox-core/_private'
import { Team } from 'src/model/Team'
import abi from '../utils/CryptoTip.json'
import { ethers } from 'ethers'
import { shortAddress } from 'src/utils/utilitites'

const router = useRouter()
if (!router.currentRoute.value.params.ulid) {
  router.push('/404')
}

const $q = useQuasar()
const appStore = useAppStore()
const { auth, db } = useFirebase()
const { isAuthenticated, user } = useAuth(auth)
const { isConnected, connectWallet } = useWallet()
const value = ref(true)

if (!isAuthenticated) {
  router.push('/')
}
// Contract Address & ABI
const contractAddress = '0x8dF19235ca744C3F0A68d259c9625cB9CE92eE82'
const contractABI = abi.abi

const tipsAmount = ref('')

const id = router.currentRoute.value.params.ulid
const teamQuery = computed(() => doc(db, 'teams', id as string))
const teamData = useFirestore(teamQuery, null) as Ref<Team | undefined | null>
import { QForm } from 'quasar'

const tipsForm = ref<QForm | null>(null)
const loading = ref(false)

const web3_network = import.meta.env.WEB3_NETWORK ? import.meta.env.WEB3_NETWORK : 'any'
const deleteTeam = () => {
  deleteDoc(doc(db, 'teams', teamData.value?.uid as string))

  $q.notify({ type: 'negative', message: 'Team Remove Successfully' })
  timeout(3000)
  router.push('/')
}

const sendTips = async () => {
  loading.value = true
  try {
    const { ethereum } = window

    if (ethereum && teamData.value) {
      const provider = new ethers.providers.Web3Provider(ethereum, web3_network)

      const signer = provider.getSigner()
      const cryptoTipsContract = new ethers.Contract(contractAddress, contractABI, signer)
      if (value.value) {
        console.log('Will send tips')
        const sendTipsTxn = await cryptoTipsContract.sendTips(teamData.value.members, {
          value: ethers.utils.parseEther(tipsAmount.value),
        })

        await sendTipsTxn.wait()
        // Create the transaction in firebase
        const transaction = {
          hash: sendTipsTxn.hash,
          type: 'sendTips',
          senderAddress: await signer.getAddress(),
          members: teamData.value.members,
          value: tipsAmount.value,
        }

        $q.notify({ type: 'positive', message: 'Tips successfully Sent ' + shortAddress(sendTipsTxn.hash) })
        if (user.value)
          await setDoc(doc(db, 'users', user.value.uid, 'transaction', sendTipsTxn.hash), transaction).then(function () {
            $q.notify({ type: 'positive', message: 'Tips successfully Saved' })
          })
        reset()
      } else {
        console.log('Will Push tips')
        const sendTipsTxn = await cryptoTipsContract.pushTips(teamData.value.members, {
          value: ethers.utils.parseEther(tipsAmount.value),
        })

        await sendTipsTxn.wait()

        // Create the transaction in firebase
        const transaction = {
          hash: sendTipsTxn.hash,
          type: 'sendTips',
          senderAddress: await signer.getAddress(),
          members: teamData.value.members,
          value: tipsAmount.value,
        }
        // Create the transaction in firebase
        $q.notify({ type: 'positive', message: 'Tips successfully Pushed ' + shortAddress(sendTipsTxn.hash) })
        if (user.value)
          await setDoc(doc(db, 'users', user.value.uid, 'transaction', sendTipsTxn.hash), transaction).then(function () {
            $q.notify({ type: 'positive', message: 'Tips successfully Saved' })
          })
        reset()
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const editTeam = () => {
  router.push('/updateTeam/' + id)
}

// to reset validations:
function reset() {
  tipsAmount.value = '0'
  tipsForm.value?.resetValidation()
}

if (!isAuthenticated) {
  // TODO redirect to home page
}
</script>

<style scoped>
.clamp {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
