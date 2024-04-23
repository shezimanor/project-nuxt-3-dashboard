<script lang="ts" setup>
const $route = useRoute();
const promiseAllArray = getPromiseAllArray($route.params.feature.toString());
// useLazyAsyncData 這裡使用了 multiple $fetch requests
// 來源: https://nuxt.com/docs/getting-started/data-fetching#uselazyasyncdata
const {
  data: currentData,
  pending,
  error
}: any = await useLazyAsyncData('getCurrentProductState', async () => {
  // productData 只有在 'update' 時才會有資料， 'create' 時為 null
  const [prototypeData, productData = null] = await Promise.all(
    promiseAllArray
  );
  return { prototypeData, productData };
});

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
        <!-- 404 -->
        <UAlert
          v-if="error && !pending"
          icon="i-heroicons-x-circle-20-solid"
          color="rose"
          variant="soft"
          title="Oops！找不到表單"
          description="找不到對應的表單，請確認連結是否正確。"
          :actions="[
            {
              variant: 'solid',
              color: 'primary',
              label: '返回列表',
              to: '/product/list'
            }
          ]"
        />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
