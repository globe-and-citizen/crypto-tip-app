<template>
  <AppHeader
    title="Create New Team"
    back_link="/"
    @toggleRightDrawer="appStore.toggleDrawer()"
  />
  <q-page-container>
    <div class="q-pa-md">
      <div class="q-gutter-md items-right">
        <q-input outlined v-model="team.name" label="Team Name" />
        <q-input
          outlined
          v-model="team.description"
          type="textarea"
          label="Description"
        />
        <q-input
          outlined
          v-for="(m, i) in team.members"
          v-model="team.members[i]"
          :key="m"
          label="Member Address"
          :rules="[
            (value) => isAddress(value) || 'You need to add a valid address',
          ]"
        >
          <template v-slot:before>
            <q-icon name="add" color="primary" @click="addTeamMember(i + 1)" />
            <q-icon name="remove" v-if="i !== team.members.length - 1" />
            <q-icon
              name="remove"
              color="red"
              @click="removeTeamMember(i)"
              v-if="team.members.length > 1 && i === team.members.length - 1"
            />
          </template>
        </q-input>
        <!--        <q-btn round color="primary" icon="add" class="float-right"/>-->
        <q-btn class="float-right" @click="createTeam()"> Add Team</q-btn>
      </div>
    </div>
  </q-page-container>
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
import { timeout } from 'workbox-core/_private'
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
  if (index != -1 && index !== team.value.members.length - 1) {
    team.value.members.slice(index, 2)
  }
  if (index === team.value.members.length - 1) {
    team.value.members.pop()
  }
}
const createTeam = async function () {
  await setDoc(doc(db, 'teams', id), team.value).then(function () {
    team.value = initialTeamValue
    $q.notify({ type: 'positive', message: 'Team successfully Created' })
    router.push('/')
  })
}

const isAddress = (value: never) => {
  return ethers.isAddress(value)
}
</script>

<style scoped></style>
