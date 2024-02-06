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
        <q-table v-if="transactions" :rows="transactions" :columns="columns" row-key="hash" hide-bottom />
        <q-skeleton class="q-mb-lg" type="rect" width="80%" v-else height="150px" />
      </div>
      <div class="col column" style="gap: 50px">
        <div style="border: solid gray 1px; border-radius: 15px" class="column items-center">
          <h2 class="text-h5">My Balance</h2>
          <p class="text-h5 text-bold" v-if="isConnected && walletBalance">{{ walletBalance.toString().substring(0, 5) }} Ether</p>
          <q-skeleton class="q-mb-lg" type="rect" width="80%" v-else />
        </div>
        <div style="border: solid gray 1px; border-radius: 15px" class="column items-center">
          <h2 class="text-h5">Contract Balance</h2>
          <p class="text-h5 text-bold" v-if="contractBalance && isConnected">{{ contractBalance.toString().substring(0, 5) }} Ether</p>
          <q-skeleton class="q-mb-lg" type="rect" width="80%" v-else />

          <q-btn
            @click="withdraw"
            icon="get_app"
            data-cy="sign_in"
            class="q-mb-lg"
            v-if="contractBalance && isConnected && contractBalance.toString() !== '0.0'"
          >
            <div class="q-px-sm">Withdraw</div>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { useWallet } from 'src/composables/wallet'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ethers } from 'ethers'
import abi from 'src/utils/CryptoTip.json'
import { shortAddress } from 'src/utils/utilitites'
import { useRouter } from 'vue-router'
import { useFetch } from '@vueuse/core'
import { useQuasar } from 'quasar'

const appStore = useAppStore()

const router = useRouter()

const $q = useQuasar()
const { isConnected, connectWallet } = useWallet()

// Contract Address & ABI
const contractAddress = import.meta.env.VITE_WEB3_GOERLI_CONTRACT_ADDRESS
const contractABI = abi.abi
const web3_network = import.meta.env.WEB3_NETWORK ? import.meta.env.WEB3_NETWORK : 'any'

const walletBalance = ref()
const contractBalance = ref()

let intervalId: string | number | NodeJS.Timeout | undefined

const BACKEND_ADDR = import.meta.env.VITE_BACKEND_ADDR
const { error, data: transactions } = useFetch(BACKEND_ADDR + '/transactions', {
  beforeFetch({ options, cancel }) {
    if (!appStore.getToken) cancel()

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${appStore.getToken}`,
    }
    return {
      options,
    }
  },
}).json()
const columns = [
  {
    name: 'hash',
    required: true,
    label: 'Transaction Hash',
    align: 'left',
    field: (row: { hash: string }) => shortAddress(row.hash),
    sortable: true,
  },
  { name: 'value', align: 'center', label: 'Value', field: (row: { value: string }) => row.value + ' ETH', sortable: true },
]
onMounted(async () => {
  // Watcher on balances
  intervalId = setInterval(async () => {
    if (isConnected.value) {
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
  }, 5000)

  setTimeout(() => {
    if (!appStore.getToken) {
      router.push('/')
    }
  }, 5000)
})
onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
const withdraw = async () => {
  try {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, web3_network)
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
</script>
