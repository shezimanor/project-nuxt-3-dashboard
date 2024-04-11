<script lang="ts" setup>
const { data } = await useFetch('/api/prototypes');
const { data: prototypeData } = await useLazyAsyncData('prototypeData', () =>
  $fetch('/api/prototypes')
);
console.log('data:', data.value);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productBuild" grow>
      <UDashboardNavbar title="建立產品">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div
          v-if="prototypeData && prototypeData.list.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
        >
          <UPageCard
            v-for="prototypeItem in prototypeData.list"
            :key="prototypeItem.id"
            :title="prototypeItem.title"
            :description="prototypeItem.description"
            icon="i-heroicons-cube-20-solid"
            :to="`/product/edit/create/${prototypeItem.id}`"
          />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
