<template>
  <AppHeader :title="`Team :  ${teamData ? teamData.name : ''}`" back_link="/" @toggleRightDrawer="appStore.toggleDrawer()" />
  <q-page-container>
    <div class="q-ml-sm">
      <q-icon name="edit" color="primary" @click="editTeam()" />
      <q-icon name="delete" color="red" @click="deleteTeam()" />
    </div>
    <div class="q-ml-sm" v-if="teamData">
      <p>Team : {{ teamData.name }}</p>
      <p>Description : {{ teamData.description }}</p>
      <p>Members : {{ teamData.members.length }}</p>
      <p>Member list :</p>
      <ul>
        <li v-for="member in teamData.members" :key="member">{{ member }}</li>
      </ul>

      {{ userAddress }}
      <q-btn @click="connectWallet()" v-if="!isConnected">Connect Your wallet </q-btn>
      <q-input outlined v-model="tipsAmount" label="Tips Amount" />
      <q-btn>Send Tips</q-btn>
    </div>
  </q-page-container>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { useFirebase } from 'src/composables/firebase'
import { useWallet } from 'src/composables/wallet'
import { useAuth, useFirestore } from '@vueuse/firebase'
import { useRouter } from 'vue-router'
import { computed, ref, Ref } from 'vue'
import { deleteDoc, doc } from 'firebase/firestore'
import { useQuasar } from 'quasar'
import { timeout } from 'workbox-core/_private'
import { Team } from 'src/model/Team'

const router = useRouter()
if (!router.currentRoute.value.params.ulid) {
  router.push('/404')
}

const $q = useQuasar()
const appStore = useAppStore()
const { auth, db } = useFirebase()
const { isAuthenticated } = useAuth(auth)
const { userAddress, isConnected, connectWallet } = useWallet()

const tipsAmount = ref()

const id = router.currentRoute.value.params.ulid
const teamQuery = computed(() => doc(db, 'teams', id as string))
const teamData = useFirestore(teamQuery, null) as Ref<Team | undefined | null>

const deleteTeam = () => {
  deleteDoc(doc(db, 'teams', teamData.value?.uid as string))

  $q.notify({ type: 'negative', message: 'Team Remove Successfully' })
  timeout(3000)
  router.push('/')
}

const editTeam = () => {
  router.push('/updateTeam/' + id)
}
if (!isAuthenticated) {
  // TODO redirect to home page
}
</script>

<style scoped></style>
