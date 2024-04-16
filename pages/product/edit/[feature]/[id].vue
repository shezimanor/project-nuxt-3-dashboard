<script lang="ts" setup>
const $route = useRoute();
const promiseAllArray = getPromiseAllArray($route.params.feature.toString());
// useLazyAsyncData 這裡使用了 multiple $fetch requests
// 來源: https://nuxt.com/docs/getting-started/data-fetching#uselazyasyncdata
const { data: currentData, pending }: any = await useLazyAsyncData(
  'getCurrentProductState',
  async () => {
    // productData 只有在 'update' 時才會有資料， 'create' 時為 null
    const [prototypeData, productData = null] = await Promise.all(
      promiseAllArray
    );
    return { prototypeData, productData };
  }
);

const currentRawSchema = computed(() => {
  if (currentData.value.prototypeData)
    return JSON.parse(currentData.value.prototypeData.schema);
  else return {};
});

const prototypeId = computed(() => {
  if (currentData.value.prototypeData)
    return currentData.value.prototypeData.id;
  else return '';
});

const currentRawState = computed(() => {
  if (currentData.value.productData)
    return JSON.parse(currentData.value.productData.product_data);
  else return null;
});

const productId = computed(() => {
  if (currentData.value.productData) return currentData.value.productData.id;
  else return '';
});

function getPromiseAllArray(feature: string) {
  switch (feature) {
    case 'create':
      return [$fetch(`/api/prototypes/${$route.params.id}`)];
    case 'update':
      return [
        $fetch(`/api/prototypes/${$route.params.id}`),
        $fetch(`/api/products/${$route.query.id}`)
      ];
    default:
      return [];
  }
}
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
          v-if="currentData && !pending"
          :feature="$route.params.feature.toString()"
          :prototype-id="prototypeId"
          :product-id="productId"
          :raw-schema="currentRawSchema"
          :raw-state="currentRawState"
        />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
