<!-- Component Name: MySchemaLayoutObject -->
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

const filteredProperties = computed(() => {
  // 過濾掉 ui.hidden 為 true 的 properties
  const { properties } = props.schema;
  return Object.keys(properties).reduce((result: any, currentKey: string) => {
    const currentValue = properties[currentKey];
    if (!currentValue.ui.hidden) {
      result[currentKey] = currentValue;
    }
    return result;
  }, {});
});
</script>

<template>
  <div class="flex flex-col">
    <h3>Form Layout Object</h3>
    <div v-for="(property, key) in filteredProperties" :key="key">
      <!-- {{ property }} -->
      <MySchemaFormItem :schema="property" :state="state" />
    </div>
  </div>
</template>

<style scoped></style>
