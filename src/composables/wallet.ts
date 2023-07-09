import { Ref, ref, watchEffect } from 'vue'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider'
import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider'

export function useWallet() {
  const web3_network = import.meta.env.VITE_WEB3_NETWORK ? import.meta.env.VITE_WEB3_NETWORK : 'any'

  const userAddress = ref()
  const isConnected = ref(false)
  const provider: Ref<Web3Provider | undefined> = ref()
  const signer: Ref<JsonRpcSigner | undefined> = ref()
  const balance = ref('0')

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

  watchEffect(async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        isConnected.value = accounts.length > 0
        userAddress.value = accounts.pop()
        provider.value = new ethers.providers.Web3Provider(window.ethereum, web3_network)
        signer.value = provider.value.getSigner()
        if (await signer.value?.getAddress()) {
          // const address = await signer.value?.getAddress()
          // const bal = await provider.value?.getBalance(address)
          // balance.value = ethers.utils.formatEther(bal)
        }
      } else {
        isConnected.value = false
      }
    } catch (e) {
      console.log(e)
    }
  })
  return { userAddress, isConnected, connectWallet, provider, signer, balance }
}
