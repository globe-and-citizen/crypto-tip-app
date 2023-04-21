<template>
  <AppHeader title="Update Team" :back_link="'/showTeam/' + router.currentRoute.value.params.ulid" @toggleRightDrawer="appStore.toggleDrawer()" />
  <q-page style="max-width: 768px" class="full-width">
    <div class="q-pa-md" v-if="team">
      <q-form @submit="onSubmit()" class="q-gutter-md">
        <q-input outlined v-model="team.name" label="Team Name" />
        <q-input outlined v-model="team.description" type="textarea" label="Description" />
        <q-input
          outlined
          v-for="(m, i) in team.members"
          v-model="team.members[i]"
          :key="i"
          label="Member Address"
          :rules="[(value) => ethers.utils.isAddress(value) || 'You need to add a valid address']"
        >
          <template v-slot:before>
            <q-icon name="add" color="primary" @click="addTeamMember(i + 1)" />
            <q-icon name="remove" v-if="i !== team.members.length - 1" />
            <q-icon name="remove" color="red" @click="removeTeamMember(i)" v-if="team.members.length > 1 && i === team.members.length - 1" />
          </template>
        </q-input>

        <div>
          <q-btn label="Update Team" type="submit" color="green" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue'
import { useAppStore } from 'src/stores'
import { computed, Ref } from 'vue'
import { useFirebase } from 'src/composables/firebase'
import { useAuth, useFirestore } from '@vueuse/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useQuasar } from 'quasar'
import { ethers } from 'ethers'
import { useRouter } from 'vue-router'
import { Team } from 'src/model/Team'

const router = useRouter()
if (!router.currentRoute.value.params.ulid) {
  router.push('/404')
}

const $q = useQuasar()
const appStore = useAppStore()
const { auth, db } = useFirebase()
const { isAuthenticated } = useAuth(auth)

const id = router.currentRoute.value.params.ulid
const teamQuery = computed(() => doc(db, 'teams', id as string))
const team = useFirestore(teamQuery, null) as Ref<Team | undefined | null>

if (!isAuthenticated) {
  // TODO redirect to home page
}

const addTeamMember = function (index: number) {
  if (team.value) {
    team.value.members.splice(index, 0, '')
  }
}

const removeTeamMember = function (index: number) {
  if (team.value) {
    if (index != -1 && index !== team.value.members.length - 1) {
      team.value.members.slice(index, 2)
    }
    if (index === team.value.members.length - 1) {
      team.value.members.pop()
    }
  }
}
const onSubmit = async function () {
  if (team.value) {
    await setDoc(doc(db, 'teams', team.value?.uid), team.value).then(function () {
      $q.notify({ type: 'positive', message: 'Team successfully Updated' })
      router.push('/')
    })
  }
}
</script>
