<script setup>
// 使用這個 component 用來複製 JSON schema 給 `product-prototypes.json` 做儲存
import schemaObj from '~/data/product-schema-swiper.json';
// 這裡因為在 JSON 中作為字串儲存，所以要先轉換成字串，並且把雙引號換成單引號，才不會有格式衝突
// 會在 api 中作轉換
const schemaData = ref(JSON.stringify(schemaObj).replaceAll('"', "'"));
const { copy, copied, isSupported } = useClipboard({
  source: schemaData,
  legacy: true
});
</script>
<template>
  <div class="border my-4 p-4 rounded-xl max-w-screen-md">
    <h1>JSON Component</h1>
    <div v-if="isSupported">
      <UButton @click="copy(schemaData)">
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </UButton>
    </div>
  </div>
</template>
