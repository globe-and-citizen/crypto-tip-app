<template>

  <article class="q-pt-md q-px-md relative-position row">
    <q-skeleton class="col-4" square style="aspect-ratio: 1; border-radius: 24px"/>
    <div class="col-8">
      <div class="q-ml-sm">

        <h2 class="q-mb-none text-body1 text-bold">
          Team Name
        </h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
        <p class="q-mb-none text-body1 text-bold">
          30 ETH sent
        </p>
      </div>
    </div>
    <q-separator class="full-width q-mt-md"/>
  </article>
</template>

<script lang="ts" setup>

interface Props {
  team: object
}

defineProps<Props>()
</script>

<style scoped>

</style>
