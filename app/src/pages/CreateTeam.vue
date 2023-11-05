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
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import { ethers } from 'ethers'
import { useRouter } from 'vue-router'
import { useFetch } from '@vueuse/core'

const BACKEND_ADDR = 'http://localhost:3000'
const appStore = useAppStore()

const $q = useQuasar()
const router = useRouter()

const initialTeamValue = {
  name: '',
  description: '',
  address: '',
  members: ['', ''],
}
const team = ref(initialTeamValue)

const { execute, isFetching, isFinished, error, data } = useFetch(BACKEND_ADDR + '/teams', {
  beforeFetch({ options, cancel }) {
    if (!appStore.getToken) cancel()
    options.body = JSON.stringify(team.value)

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${appStore.getToken}`,
    }
    return {
      options,
    }
  },
  immediate: false,
})
  .post()
  .json()

watchEffect(() => {
  if (isFinished.value && data.value) {
    $q.notify({ type: 'positive', message: 'Team successfully Created' })
    setTimeout(() => {
      $q.notify({ type: 'positive', message: 'Redirection to Homepage in 2s' })
    }, 1000)

    setTimeout(() => {
      router.push('/')
    }, 3000)
  }
})
const addTeamMember = function (index: number) {
  team.value.members.splice(index, 0, '')
}

const removeTeamMember = function (index: number) {
  team.value.members.splice(index, 1)
}
const onSubmit = async function () {
  await execute()
}
const onReset = function () {
  team.value = {
    name: '',
    description: '',
    address: '',
    members: ['', ''],
  }
}

const isAddress = (value: never) => {
  return ethers.utils.isAddress(value)
}
</script>

<style scoped></style>
