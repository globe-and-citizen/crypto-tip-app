import { onBeforeUnmount, onMounted, Ref, ref, watchEffect } from 'vue'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider'
import { Signer } from '@ethersproject/abstract-signer'

export function useWallet() {
  const web3_network = import.meta.env.VITE_WEB3_NETWORK ? import.meta.env.VITE_WEB3_NETWORK : 'any'

  const userAddress = ref()
  const isConnected = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null
  const provider: Ref<Web3Provider | undefined> = ref()
  const signer: Ref<Signer | undefined> = ref()
  const balance = ref('ds')

  async function connectWallet() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!')
      }
      const { ethereum } = window

      if (!ethereum) {
        alert('Please install MetaMask to use this feature')
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      userAddress.value = accounts.pop()
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  onMounted(() => {
    intervalId = setInterval(async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        isConnected.value = accounts.length > 0
        userAddress.value = accounts.pop()
        provider.value = new ethers.providers.Web3Provider(window.ethereum, web3_network)
        signer.value = provider.value.getSigner()

        // const bal = await signer.value.getBalance()
        // balance.value = ethers.utils.formatEther()
      } else {
        isConnected.value = false
      }
    }, 1000)
  })
  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { userAddress, isConnected, connectWallet, provider, signer, balance }
}
