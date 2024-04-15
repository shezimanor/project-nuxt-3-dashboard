<script lang="ts" setup>
// TODO: prototype component，會依據不同的 schema id 來使用不同的 prototype component
const { onCTA } = usePreview();

// props
const props = defineProps({
  productState: {
    type: Object,
    required: true
  }
});
</script>
<template>
  <div></div>
</template>
