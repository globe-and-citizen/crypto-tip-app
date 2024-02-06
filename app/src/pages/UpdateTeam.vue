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
          lazy-rules
          :rules="[(value) => ethers.utils.isAddress(value) || 'You need to add a valid address']"
        >
          <template v-slot:before>
            <q-icon name="add" color="primary" @click="addTeamMember(i + 1)" />
            <q-icon name="remove" color="red" @click="removeTeamMember(i)" v-if="team.members.length > 1" />
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { ethers } from 'ethers'
import { useRouter } from 'vue-router'
import { useFetch } from '@vueuse/core'

const router = useRouter()
if (!router.currentRoute.value.params.ulid) {
  router.push('/404')
}

const $q = useQuasar()
const appStore = useAppStore()

const BACKEND_ADDR = import.meta.env.VITE_BACKEND_ADDR
const id = router.currentRoute.value.params.ulid

const { data: teamData, onFetchResponse } = useFetch(BACKEND_ADDR + '/teams/' + id, {
  beforeFetch({ options, cancel }) {
    if (!appStore.getToken) cancel()
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${appStore.getToken}`,
    }
    return {
      options,
    }
  },
  immediate: true,
}).json()
const { execute: updateTeam, onFetchResponse: onFetchResponseUpdate } = useFetch(
  BACKEND_ADDR + '/teams/' + id,
  {
    method: 'PUT',
  },
  {
    beforeFetch({ options, cancel }) {
      if (!appStore.getToken) cancel()
      options.body = JSON.stringify(team.value)

      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${appStore.getToken}`,
      }
      return {
        options,
      }
    },
    immediate: false,
  }
).json()

const team = ref()
onFetchResponse((response) => {
  if (response.ok) {
    team.value = teamData.value
  }
})

onFetchResponseUpdate((response) => {
  if (response.ok) {
    $q.notify({ type: 'positive', message: 'Team successfully Updated' })
    setTimeout(() => {
      $q.notify({ type: 'positive', message: 'Redirection to Homepage in 2s' })
    }, 1000)

    setTimeout(() => {
      router.push('/showTeam/' + id)
    }, 3000)
  }
})

const addTeamMember = function (index: number) {
  if (team.value) {
    team.value.members.splice(index, 0, '')
  }
}

const removeTeamMember = function (index: number) {
  if (team.value) {
    team.value.members.splice(index, 1)
  }
}
const onSubmit = async function () {
  if (team.value) {
    await updateTeam()
  }
}
</script>
