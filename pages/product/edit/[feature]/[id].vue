<script lang="ts" setup>
const $route = useRoute();
// `useLazyAsyncData` 使用這個函數來取得資料，導航不會等待資料回應，會自行跑完導航作業，才不會有閒置頁面產生，`useAsyncData` 反之
const { data: prototypeData, pending } = await useLazyAsyncData(
  'getPrototype',
  () => $fetch(`/api/prototypes/${$route.params.id}`)
);
const currentRawSchema = computed(() => {
  if (prototypeData.value) return JSON.parse(prototypeData.value.schema);
  else return {};
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productEdit" grow>
      <UDashboardNavbar title="編輯產品">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="pt-0 md:pt-4">
        <MySchemaForm
          v-if="prototypeData && !pending"
          :prototype-id="$route.params.id.toString()"
          :feature="$route.params.feature.toString()"
          :raw-schema="currentRawSchema"
        />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
