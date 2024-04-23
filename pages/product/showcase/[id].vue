<script lang="ts" setup>
import {
  MyPrototypeScratch,
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
  'relative flex-shrink-0 border w-[258px] h-[450px] overflow-hidden sm:w-[344px] sm:h-[600px]'
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
    case 'cddd2a94-cda9-496b-9ce7-848af5971f31':
      return MyPrototypeScratch;
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
      <UDashboardPanelContent class="flex items-center gap-y-4">
        <!-- 依據使用的 Prototype 來渲染對應的 Component -->
        <ProductComponent
          v-if="productData && !pending && currentPrototypeData"
          :class="prototypeClassName"
          :prototype-data="currentPrototypeData"
        />
        <div class="w-full" v-if="productData && !pending">
          <h3 class="text-primary font-bold text-xl mb-1">產品資訊</h3>
          <dl class="product-info-list">
            <dt>產品模型：</dt>
            <dd>{{ productData.prototype_title }}</dd>
            <dt>產品標題：</dt>
            <dd>{{ productData.title }}</dd>
            <dt>產品描述：</dt>
            <dd>{{ productData.description }}</dd>
          </dl>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
