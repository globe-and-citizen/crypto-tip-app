<template>
  <AppHeader
    :title="`Team :  ${!isLoading && docs ? docs.name : ''}`"
    back_link="/"
    @toggleRightDrawer="appStore.toggleDrawer()"
  />
  <q-page-container>
    <div class="q-pa-md">ds</div>
    {{ docs }}
  </q-page-container>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { useFirebase } from 'src/composables/firebase'
import { useAuth, useFirestore } from '@vueuse/firebase'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { collection, doc, query, where, getDoc } from 'firebase/firestore'

const isLoading = ref(true)
const router = useRouter()
if (!router.currentRoute.value.params.ulid) {
  router.push('/404')
}

const appStore = useAppStore()
const { auth, db } = useFirebase()
const { isAuthenticated, user } = useAuth(auth)
const docs = ref()
isLoading.value = false
onMounted(async () => {
  await getDoc(doc(db, 'teams', '01GXGVV0DC07KHDK768WJJY1VG')).then((doc) => {
    docs.value = doc.data()
  })
})
if (!isAuthenticated) {
  // TODO redirect to home page
}
</script>

<style scoped></style>
