<script lang="ts" setup>
import {
  MyPrototypeSimple,
  MyPrototypeSwiper,
  MyPrototypeUnknown
} from '#components';
import type { Product } from '~/types';

const $route = useRoute();
// `useLazyAsyncData` 使用這個函數來取得資料，導航不會等待資料回應，會自行跑完導航作業，才不會有閒置頁面產生，`useAsyncData` 反之
const { data: productData, pending } = await useLazyAsyncData(
  'getProduct',
  () => $fetch(`/api/products/${$route.params.id}`)
);
const prototypeClassName = ref(
  'relative border w-[258px] h-[450px] overflow-hidden sm:w-[344px] sm:h-[600px]'
);
const ProductComponent = computed(() => {
  if (!productData) return MyPrototypeUnknown;
  const targetData = productData.value as Product;
  // 依據 prototype_id 來決定要渲染的 Component
  switch (targetData.prototype_id) {
    case 'e415c8bd-a256-447f-a33a-9fbd7c3c06be':
      return MyPrototypeSimple;
    case '4dc207f2-2229-451a-aa9d-e29bb44acf84':
      return MyPrototypeSwiper;
    default:
      return MyPrototypeUnknown;
  }
});
const currentPrototypeData = computed(() => {
  if (!productData) return null;
  else
    return JSON.parse((productData.value as Product).product_data)
      .prototypeData;
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productEdit" grow>
      <UDashboardNavbar title="產品展示">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="flex items-center justify-center">
        <!-- 依據使用的 Prototype 來渲染對應的 Component -->
        <ProductComponent
          v-if="productData && !pending && currentPrototypeData"
          :class="prototypeClassName"
          :prototype-data="currentPrototypeData"
        />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
