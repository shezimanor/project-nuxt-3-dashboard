<script lang="ts" setup>
// 開發原型時，可以直接使用 MyPrototypeXxx 來渲染，不需要透過後端資料
import { MyPrototypeScratch } from '#components';

const prototypeClassName = ref(
  'relative flex-shrink-0 border w-[258px] h-[450px] overflow-hidden sm:w-[344px] sm:h-[600px]'
);
const currentPrototypeData = reactive({
  buttonColor: 'yellow',
  buttonText: '立即領取',
  imageCover: 'a-cover-1.jpg',
  results: [
    {
      title: '獲得紅鞋',
      image: 'red.webp',
      url: 'https://www.example.com/shoes/1'
    },
    {
      title: '獲得海軍藍鞋',
      image: 'navy.webp',
      url: 'https://www.example.com/shoes/2'
    },
    {
      title: '獲得綠鞋',
      image: 'green.webp',
      url: 'https://www.example.com/shoes/3'
    }
  ]
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productEdit" grow>
      <UDashboardNavbar title="原型開發">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="flex items-center justify-center">
        <!-- 依據使用的 Prototype 來渲染對應的 Component -->
        <MyPrototypeScratch
          :class="prototypeClassName"
          :prototype-data="currentPrototypeData"
        />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
