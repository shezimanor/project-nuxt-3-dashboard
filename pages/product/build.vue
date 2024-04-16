<script lang="ts" setup>
const { data: prototypeList, pending } = await useLazyAsyncData(
  'getPrototypeList',
  () => $fetch('/api/prototypes')
);
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
          v-if="prototypeList && prototypeList.list.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
        >
          <UPageCard
            v-for="prototypeItem in prototypeList.list"
            :key="prototypeItem.id"
            :to="`/product/edit/create/${prototypeItem.id}`"
            :ui="{
              base: 'flex flex-col',
              footer: {
                base: '',
                background: '',
                padding: 'px-4 py-2 sm:px-6'
              }
            }"
          >
            <template #title>
              {{ prototypeItem.title }}
            </template>
            <template #description>
              <div class="flex flex-row gap-x-2 mb-1">
                <UBadge color="green" variant="subtle">{{
                  prototypeItem.version
                }}</UBadge>
                <UBadge
                  v-for="(feature, index) in prototypeItem.features"
                  :key="index"
                  color="primary"
                  variant="soft"
                  >{{ feature }}</UBadge
                >
              </div>
              {{ prototypeItem.description }}
            </template>
            <template #footer>
              <div
                class="flex flex-row justify-end text-xs text-gray-400 dark:text-gray-300"
              >
                更新時間: {{ prototypeItem.updated_at }}
              </div>
            </template>
          </UPageCard>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
