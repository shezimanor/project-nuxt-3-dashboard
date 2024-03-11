<!-- Component Name: MySchemaLayoutArray -->
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
    <!-- <h3>Form Layout Array</h3> -->
    <MySchemaFormItem :schema="schema.items" :state="state" />
  </div>
</template>

<style scoped></style>
