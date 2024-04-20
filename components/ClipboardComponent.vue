<script setup>
// 使用這個 component 用來複製 JSON schema 給 `product-prototypes.json` 做儲存
import schemaScratch from '~/data/product-schema-scratch.json';
import schemaSimple from '~/data/product-schema-simple.json';
import schemaSwiper from '~/data/product-schema-swiper.json';
// 教學: 這裡因為在 JSON 中作為字串儲存。手動存進JSON時，先把欄位改成 "schema": '', 讓編輯器自己轉換引號
// 會在 api 中作轉換
const schemaSimpleData = ref(JSON.stringify(schemaSimple));
const schemaSwiperData = ref(JSON.stringify(schemaSwiper));
const schemaScratchData = ref(JSON.stringify(schemaScratch));
const { copy, copied, isSupported } = useClipboard({
  legacy: true
});
</script>
<template>
  <div class="border p-4 rounded-xl max-w-screen-md">
    <div v-if="isSupported" class="flex flex-row gap-x-2 mb-2">
      <UButton @click="copy(schemaSimpleData)">
        Simple Data
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </UButton>
      <UButton @click="copy(schemaSwiperData)">
        Swiper Data
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </UButton>
      <UButton @click="copy(schemaScratchData)">
        Scratch Data
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </UButton>
    </div>
    <UTextarea :rows="20" />
  </div>
</template>
