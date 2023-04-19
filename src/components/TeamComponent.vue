<template>
  <article class="q-pt-md q-px-sm-xs relative-position row" @click="goToUrl()">
    <q-skeleton class="col-4" square style="aspect-ratio: 1; border-radius: 24px" />
    <div class="col-8">
      <div class="q-ml-sm">
        <h2 class="q-mb-none text-body1 text-bold">{{ team.name }}</h2>
        <p class="clamp">{{ team.description }}</p>
        <p class="q-mb-none text-body1 text-bold">30 ETH sent</p>
      </div>
    </div>
    <q-separator class="full-width q-mt-md" />
  </article>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

interface TeamType {
  uid: string
  name: string
  description: string
}

interface Props {
  team: TeamType
}

const props = defineProps<Props>()

const router = useRouter()

function goToUrl() {
  router.push('/showTeam/' + props.team.uid)
}
</script>

<style>
.clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
