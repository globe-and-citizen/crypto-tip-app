<template>
  <AppHeader title="Crypto Tips" @toggleRightDrawer="appStore.toggleDrawer()" />
  <q-page style="max-width: 768px; width: 100%" class="q-pa-md">
    <h1 class="text-h3">Dashboard</h1>
    <div v-if="!isConnected">
      <p>Connect Your wallet to access your data</p>
      <q-btn @click="connectWallet" icon="wallet" data-cy="sign_in" class="q-mb-lg">
        <div class="q-px-sm">Connect Your wallet</div>
      </q-btn>
    </div>
    <div class="row" style="gap: 50px">
      <div class="col-12 col-sm column items-center" style="border: solid gray 1px; border-radius: 15px">
        <h1 class="text-h5">Transactions</h1>
        <ul v-if="isConnected && transactions">
          <li>ds</li>
          <li>ds</li>
          <li>ds</li>
          <li>ds</li>
        </ul>
        <q-skeleton class="q-mb-lg" type="rect" width="80%" v-else height="150px" />
      </div>
      <div class="col column" style="gap: 50px">
        <div style="border: solid gray 1px; border-radius: 15px" class="column items-center">
          <h2 class="text-h5">My Balance</h2>
          <p class="text-h5 text-bold" v-if="isConnected && walletBalance">{{ walletBalance }} Ether</p>
          <q-skeleton class="q-mb-lg" type="rect" width="80%" v-else />
        </div>
        <div style="border: solid gray 1px; border-radius: 15px" class="column items-center">
          <h2 class="text-h5">Contract Balance</h2>
          <p class="text-h5 text-bold" v-if="contractBalance && isConnected">{{ contractBalance }} Ether</p>
          <q-skeleton class="q-mb-lg" type="rect" width="80%" v-else />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { useWallet } from 'src/composables/wallet'
import { ref, watchEffect } from 'vue'
import { ethers } from 'ethers'
import abi from 'src/utils/CryptoTip.json'
import { useAuth, useFirestore } from '@vueuse/firebase'
import { collection } from 'firebase/firestore'
import { useFirebase } from 'src/composables/firebase'

const appStore = useAppStore()

const { isConnected, connectWallet } = useWallet()

// Contract Address & ABI
const contractAddress = '0x8dF19235ca744C3F0A68d259c9625cB9CE92eE82'
const contractABI = abi.abi
const web3_network = import.meta.env.WEB3_NETWORK ? import.meta.env.WEB3_NETWORK : 'any'

const walletBalance = ref()
const contractBalance = ref()

const { auth, db } = useFirebase()
const { isAuthenticated, user } = useAuth(auth)

const transactions = useFirestore(collection(db, 'user', user.value ? user.value.uid : '', 'transactions'))
watchEffect(async () => {
  if (isConnected) {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, web3_network)
        const signer = provider.getSigner()
        const cryptoTipsContract = new ethers.Contract(contractAddress, contractABI, signer)
        const balanceTxn = await cryptoTipsContract.getBalance(signer.getAddress())
        contractBalance.value = ethers.utils.formatEther(balanceTxn)
        walletBalance.value = ethers.utils.formatEther(await signer.getBalance())
      }
    } catch (e) {
      console.log(e)
    }
  }
})
</script>
