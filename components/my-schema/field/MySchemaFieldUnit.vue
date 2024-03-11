<!-- Component Name: MySchemaFieldUnit -->
<script lang="ts" setup>
// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  state: {
    type: Object,
    default: null
  }
});
</script>

<template>
  <div class="flex flex-col">
    <h3>Form Field Unit</h3>
    <span>Schema Type: {{ schema.type }}</span>
  </div>
</template>

<style scoped></style>
