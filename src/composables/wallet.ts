import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useWallet() {
  const userAddress = ref()
  const isConnected = ref(false)
  let intervalId: string | number | NodeJS.Timeout | undefined
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

  onMounted(async () => {
    intervalId = setInterval(async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          isConnected.value = accounts.length > 0
          userAddress.value = accounts.pop()
        } else {
          isConnected.value = false
        }
      } catch (e) {
        console.log(e)
      }
    }, 1000)
  })
  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
  })
  return { userAddress, isConnected, connectWallet }
}
