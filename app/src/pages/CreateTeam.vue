<template>
  <AppHeader title="Create New Team" back_link="/" @toggleRightDrawer="appStore.toggleDrawer()" />
  <q-page style="max-width: 768px" class="full-width">
    <div class="q-pa-md">
      <q-form @submit="onSubmit()" @reset="onReset" class="q-gutter-md">
        <q-input outlined v-model="team.name" label="Team Name" />
        <q-input outlined v-model="team.description" type="textarea" label="Description" />
        <q-input
          outlined
          v-for="(m, i) in team.members"
          v-model="team.members[i]"
          :key="i"
          label="Member Address"
          lazy-rules
          :rules="[(value) => isAddress(value) || 'You need to add a valid address']"
        >
          <template v-slot:before>
            <q-icon name="add" color="primary" @click="addTeamMember(i + 1)" />
            <q-icon name="remove" color="red" @click="removeTeamMember(i)" v-if="team.members.length > 1" />
          </template>
        </q-input>

        <div>
          <q-btn label="Add Team" type="submit  " color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { ref } from 'vue'
import { useFirebase } from 'src/composables/firebase'
import { useAuth } from '@vueuse/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { ulid } from 'ulid'
import { useQuasar } from 'quasar'
import { ethers } from 'ethers'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const { auth, db } = useFirebase()
const { isAuthenticated, user } = useAuth(auth)

const id = ulid()
const $q = useQuasar()
const router = useRouter()

if (!isAuthenticated) {
  // TODO redirect to home page
}
const initialTeamValue = {
  uid: id,
  name: '',
  description: '',
  address: '',
  members: ['', ''],
  user: user.value?.uid,
}
const team = ref(initialTeamValue)

const addTeamMember = function (index: number) {
  team.value.members.splice(index, 0, '')
}

const removeTeamMember = function (index: number) {
  team.value.members.splice(index, 1)
}
const onSubmit = async function () {
  console.log('Submit')
  await setDoc(doc(db, 'teams', id), team.value).then(function () {
    team.value = initialTeamValue
    $q.notify({ type: 'positive', message: 'Team successfully Created' })
    router.push('/')
  })
}
const onReset = async function () {
  team.value = {
    uid: id,
    name: '',
    description: '',
    address: '',
    members: ['', ''],
    user: user.value?.uid,
  }
}

const isAddress = (value: never) => {
  return ethers.utils.isAddress(value)
}
</script>

<style scoped></style>