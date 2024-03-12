<script lang="ts" setup>
// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  state: {
    type: Object,
    required: true
  },
  paths: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <!-- <h3>Form Layout Array</h3> -->
    <MySchemaFormItem :schema="schema.items" :state="state" />
  </div>
</template>

<style scoped></style>
