<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const { data: prototypeList, pending } = await useLazyAsyncData(
  'getPrototypeList',
  () => $fetch('/api/prototypes')
);

// 控制子路由的顯示
const isPreviewOpen = computed(() => {
  return route.name === 'product-build-preview-id';
});

// 設定快捷鍵 `ESC` 關閉預覽視窗
defineShortcuts({
  escape: {
    usingInput: true,
    handler: () => {
      router.push('/product/build');
    }
  }
});
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
            :icon="prototypeItem.icon"
            :ui="{
              base: 'flex flex-col hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
              title: 'mb-2',
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
              <div class="flex flex-row flex-wrap gap-x-2 gap-y-1 mb-1">
                <UBadge color="green" variant="soft" class="flex-shrink-0"
                  >版本: {{ prototypeItem.version }}</UBadge
                >
                <UBadge
                  v-for="(feature, index) in prototypeItem.features"
                  :key="index"
                  color="primary"
                  variant="soft"
                  class="flex-shrink-0"
                  >{{ feature }}</UBadge
                >
              </div>
              {{ prototypeItem.description }}
            </template>
            <template #footer>
              <div
                class="flex flex-row flex-nowrap justify-stretch gap-x-1 mb-2"
              >
                <UTooltip text="產品預覽" :popper="{ placement: 'top' }">
                  <UButton
                    color="yellow"
                    class="flex-grow-0 flex-shrink-0"
                    icon="i-heroicons-play-20-solid"
                    :to="`/product/build/preview/${prototypeItem.preview_id}`"
                  ></UButton>
                </UTooltip>
                <UButton
                  class="flex-grow justify-center"
                  :to="`/product/edit/create/${prototypeItem.id}`"
                  >建立產品</UButton
                >
              </div>
              <div
                class="flex flex-row justify-end text-xs text-gray-400 dark:text-gray-500"
              >
                更新時間: {{ prototypeItem.updated_at }}
              </div>
            </template>
          </UPageCard>
        </div>
        <!-- Child Route: Preview -->
        <template v-if="isPreviewOpen">
          <NuxtPage :page-key="(route) => route.fullPath" />
        </template>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
