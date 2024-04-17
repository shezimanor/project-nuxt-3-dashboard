<script lang="ts" setup>
// TODO: prototype component，會依據不同的 schema id 來使用不同的 prototype component
const { onCTA } = usePreview();

// props
const props = defineProps({
  prototypeData: {
    type: Object,
    required: true
  }
});
</script>
<template>
  <!-- 尺寸寫在父層: 256+2 x 448+2 / 342+2 x 598+2 (圖片尺寸: 1024 x 1792) -->
  <div>
    <div id="myUnknownContainer" class="unknown-container"></div>
  </div>
</template>
<style scoped>
/* @import '~/assets/css/prototype/xxx.css'; */
</style>
