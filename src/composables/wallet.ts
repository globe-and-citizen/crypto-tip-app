import { onMounted, ref } from 'vue'

export function useWallet() {
  const userAddress = ref()
  const isConnected = ref(false)

  async function update() {
    try {
      const { ethereum } = window

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length > 0) {
        const account = accounts[0]
        console.log('Wallet is connected! ' + account)
        userAddress.value = accounts.pop()
        isConnected.value = true
      } else {
        isConnected.value = false
        console.log('Make sure MetaMask is connected')
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  async function connectWallet() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!')
      }
      const { ethereum } = window

      if (!ethereum) {
        console.log('Please install MetaMask')
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      userAddress.value = accounts.pop()
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  onMounted(() => update())
  return { userAddress, isConnected, connectWallet }
}
