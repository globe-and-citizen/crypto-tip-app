<template>
  <AppHeader
    :title="`Team :  ${!isLoading && docs ? docs.name : ''}`"
    back_link="/"
    @toggleRightDrawer="appStore.toggleDrawer()"
  />
  <q-page-container>
    <div class="q-pa-md">ds</div>
    {{ teamData }}
  </q-page-container>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { useFirebase } from 'src/composables/firebase'
import { useAuth, useFirestore } from '@vueuse/firebase'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { doc } from 'firebase/firestore'

const isLoading = ref(true)
const router = useRouter()
if (!router.currentRoute.value.params.ulid) {
  router.push('/404')
}

const id = router.currentRoute.value.params.ulid
const appStore = useAppStore()
const { auth, db } = useFirebase()
const { isAuthenticated } = useAuth(auth)
const docs = ref()
isLoading.value = false
const teamQuery = computed(() => doc(db, 'teams', id as string))
const teamData = useFirestore(teamQuery, null)
if (!isAuthenticated) {
  // TODO redirect to home page
}
</script>

<style scoped></style>
