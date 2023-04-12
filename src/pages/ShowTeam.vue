<template>
  <AppHeader
    :title="`Team :  ${teamData ? teamData.name : ''}`"
    back_link="/"
    @toggleRightDrawer="appStore.toggleDrawer()"
  />
  <q-page-container>
    <div class="q-ml-sm" v-if="teamData">
      <p>Team : {{ teamData.name }}</p>
      <p>Description : {{ teamData.description }}</p>
      <p>Members : {{ teamData.members.length }}</p>
      <p>Member list :</p>
      <ul>
        <li v-for="member in teamData.members" :key="member">{{ member }}</li>
      </ul>

      <q-btn>Connect Your wallet</q-btn>
      <q-input outlined v-model="tipsAmount" label="Tips Amount" />
      <q-btn>Send Tips</q-btn>
    </div>
  </q-page-container>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { useFirebase } from 'src/composables/firebase'
import { useAuth, useFirestore } from '@vueuse/firebase'
import { useRouter } from 'vue-router'
import { computed, ref, Ref } from 'vue'
import { doc } from 'firebase/firestore'

interface TeamType {
  uid: string
  name: string
  description: string
  members: Array<string>
}

const router = useRouter()
if (!router.currentRoute.value.params.ulid) {
  router.push('/404')
}

const appStore = useAppStore()
const { auth, db } = useFirebase()
const { isAuthenticated } = useAuth(auth)

const tipsAmount = ref()

const id = router.currentRoute.value.params.ulid
const teamQuery = computed(() => doc(db, 'teams', id as string))
const teamData = useFirestore(teamQuery, null) as Ref<
  TeamType | undefined | null
>

if (!isAuthenticated) {
  // TODO redirect to home page
}
</script>

<style scoped></style>
