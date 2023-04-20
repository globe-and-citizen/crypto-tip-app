<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer show-if-above :model-value="appStore.getRightDrawerOpen" side="right" bordered @update:modelValue="appStore.toggleDrawer()">
      <!-- drawer content -->
      <q-item-label header> Essential Links</q-item-label>

      <q-item v-if="isAuthenticated" clickable tag="a" @click="logout">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Log Out</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable tag="a">
        <q-item-section avatar>
          <q-icon name="wallet" />
        </q-item-section>

        <q-item-section>
          <q-item-label v-if="!userAddress" @click="connectWallet">Connect Your Wallet</q-item-label>
          <q-item-label v-else @click="onCopy(userAddress)">{{ shortAddress(userAddress) }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable tag="a">
        <q-item-section avatar>
          <q-icon name="wallet" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ balance }} ETH</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable tag="a" @click="withdraw()">
        <q-item-section avatar>
          <q-icon name="get_app" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Withdraw</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useFirebase } from 'src/composables/firebase'
import { useAuth } from '@vueuse/firebase'
import { signOut } from 'firebase/auth'
import { useAppStore } from 'src/stores'
import { useWallet } from 'src/composables/wallet'
import { shortAddress } from 'src/utils/utilitites'
import { copyToClipboard, useQuasar } from 'quasar'
import { ethers } from 'ethers'
import abi from 'src/utils/CryptoTip.json'
import { onMounted, ref } from 'vue'

const $q = useQuasar()
const appStore = useAppStore()
const { auth } = useFirebase()
const { isAuthenticated } = useAuth(auth)
const { userAddress, connectWallet } = useWallet()
const balance = ref('0')

// Contract Address & ABI
const contractAddress = '0x8dF19235ca744C3F0A68d259c9625cB9CE92eE82'
const contractABI = abi.abi

onMounted(async () => {
  try {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, 'any')
      const signer = provider.getSigner()
      const cryptoTipsContract = new ethers.Contract(contractAddress, contractABI, signer)
      const balanceTxn = await cryptoTipsContract.getBalance(signer.getAddress())
      balance.value = ethers.utils.formatEther(balanceTxn)
    }
  } catch (e) {
    console.log(e)
  }
})

const withdraw = async () => {
  try {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, 'any')
      const signer = provider.getSigner()
      const cryptoTipsContract = new ethers.Contract(contractAddress, contractABI, signer)
      const withdrawTxn = await cryptoTipsContract.withdraw()
      await withdrawTxn.wait()
      $q.notify({ type: 'positive', message: 'Tips successfully withdraw ' + shortAddress(withdrawTxn.hash) })
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Unable to withdraw ' })
    console.log(e)
  }
}
const logout = () => signOut(auth)

const onCopy = (value: string) => {
  copyToClipboard(value)
    .then(() => {
      // success!
    })
    .catch(() => {
      // fail
    })
}
</script>
