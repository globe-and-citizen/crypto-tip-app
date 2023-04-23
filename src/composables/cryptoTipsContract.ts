// Contract Address & ABI
import abi from 'src/utils/CryptoTip.json'
import { useWallet } from 'src/composables/wallet'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ethers } from 'ethers'

export function useCryptoTips() {
  const contractAddress = import.meta.env.VITE_WEB3_GOERLI_CONTRACT_ADDRESS
  const contractABI = abi.abi
  const { provider, signer } = useWallet()
  const cryptoTipsContract = ref()
  const balance = ref('0')
  const error = ref()

  let intervalId: ReturnType<typeof setInterval> | null = null

  /**
   * Function that return the balance off the provided address
   * @param address
   */
  const getBalance = async (address?: string) => {
    let balance = '0'
    let error
    if (provider.value && cryptoTipsContract.value) {
      if (address && ethers.utils.isAddress(address)) {
        try {
          const balanceTxn = await cryptoTipsContract.value.getBalance(signer.value.getAddress())
          balance = ethers.utils.formatEther(balanceTxn)
        } catch (e) {
          error = e
        }
      }
    }
    return { balance, error }
  }
  /**
   * Function load current singer balance and define balance.value
   */
  const loadBalance = async () => {
    if (signer.value) {
      const { balance: loadedBalance, error } = await getBalance()
      if (!error) {
        balance.value = loadedBalance
      }
    }
  }

  /**
   * Withdraw function helper signer to withdraw his balance
   */
  const withdraw = async () => {
    const status = ref(false)
    const error = ref()
    const transaction = ref()
    if (cryptoTipsContract.value) {
      try {
        const withdrawTxn = await cryptoTipsContract.value.withdraw()
        await withdrawTxn.wait()
        transaction.value = withdrawTxn

        await loadBalance()
      } catch (e) {
        error.value = e
      }
    }
    return { status, error, transaction }
  }

  onMounted(async () => {
    if (!contractAddress) {
      error.value = new Error('You nee a valid contract address')
    } else {
      intervalId = setInterval(async () => {
        if (provider.value && signer.value && contractAddress) {
          if (!cryptoTipsContract.value) {
            try {
              cryptoTipsContract.value = new ethers.Contract(contractAddress, contractABI, signer.value)
              await loadBalance()
            } catch (e) {
              error.value = e
            }
          }
        } else {
          cryptoTipsContract.value = null
        }
      }, 3000)
    }
    // Find a way to reload balance only after withdraw
  })
  onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { cryptoTipsContract, balance, withdraw, getBalance, error }
}