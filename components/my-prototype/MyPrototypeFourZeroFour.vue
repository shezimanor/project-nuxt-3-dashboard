<script lang="ts" setup>
const router = useRouter();
const props = defineProps({
  backRoute: {
    type: String,
    default: '/product/list'
  }
});

function onBack() {
  router.push(props.backRoute);
}
</script>
<template>
  <!-- 尺寸寫在父層: 256+2 x 448+2 / 342+2 x 598+2 (圖片尺寸: 1024 x 1792) -->
  <div>
    <div class="w-full h-full flex flex-col items-center justify-center">
      <h3 class="font-semibold text-8xl">404</h3>
      <p class="my-4">找不到此產品</p>
      <UButton @click="onBack" size="lg">返回列表</UButton>
    </div>
  </div>
</template>
<style scoped>
/* @import '~/assets/css/prototype/xxx.css'; */
</style>
