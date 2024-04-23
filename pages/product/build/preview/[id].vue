<script lang="ts" setup>
import {
  MyPrototypeFourZeroFour,
  MyPrototypeScratch,
  MyPrototypeSimple,
  MyPrototypeSwiper
} from '#components';
import type { Product } from '~/types';

const $route = useRoute();
const router = useRouter();

// `useLazyAsyncData` 使用這個函數來取得資料，導航不會等待資料回應，會自行跑完導航作業，才不會有閒置頁面產生，`useAsyncData` 反之
const {
  data: productData,
  pending,
  error
} = await useLazyAsyncData('getProduct', () =>
  $fetch(`/api/products/${$route.params.id}`)
);
const prototypeClassName = ref(
  'relative flex-shrink-0 border-none w-[256px] h-[448px] overflow-hidden sm:w-[342px] sm:h-[598px]'
);
const ProductComponent = computed(() => {
  if (!productData) return MyPrototypeFourZeroFour;
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
      return MyPrototypeFourZeroFour;
  }
});
const currentPrototypeData = computed(() => {
  if (!productData) return null;
  else
    return JSON.parse((productData.value as Product).product_data)
      .prototypeData;
});

function onClosePreviewModal() {
  router.push('/product/build');
}
</script>

<template>
  <!-- 依據使用的 Prototype 來渲染對應的 Component -->
  <div class="relative z-50">
    <div
      class="fixed inset-0 transition-opacity bg-gray-200/75 dark:bg-gray-800/75"
    ></div>
    <div class="fixed inset-0 overflow-y-auto">
      <div
        class="flex min-h-full items-center justify-center text-center p-4 sm:p-0"
      >
        <div
          class="relative text-left rtl:text-right flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-hidden w-[256px] sm:w-[342px] sm:my-8"
          v-if="productData && !pending && currentPrototypeData"
        >
          <div class="flex items-center justify-between px-3 py-2">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ productData.prototype_title }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="onClosePreviewModal"
            />
          </div>
          <ProductComponent
            :class="prototypeClassName"
            :prototype-data="currentPrototypeData"
          />
        </div>
        <div
          class="relative text-left rtl:text-right flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-hidden w-[256px] sm:w-[342px] sm:my-8"
          v-else-if="error && !pending"
        >
          <div class="flex items-center justify-between px-3 py-2">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Oops!
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="onClosePreviewModal"
            />
          </div>
          <!-- 404 -->
          <MyPrototypeFourZeroFour
            :class="prototypeClassName"
            back-route="/product/build"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
