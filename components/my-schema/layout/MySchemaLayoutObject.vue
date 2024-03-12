<!-- Component Name: MySchemaLayoutObject -->
<script lang="ts" setup>
import { useMySchemaStore } from '~/stores/mySchemaStore';
const mySchemaStore = useMySchemaStore();

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
  <div class="flex flex-col gap-y-4">
    <!-- <h3>Form Layout Object</h3> -->
    <div
      class="flex flex-col gap-y-4"
      v-for="(property, key) in filteredProperties"
      :key="key"
    >
      <!-- {{ property }} -->
      <UPageCard
        v-if="mySchemaStore.state.testMode"
        title="Form Layout Object"
        :description="`Schema KeyName(AttrName): ${key}`"
        icon="i-heroicons-square-3-stack-3d-20-solid"
      />
      <div class="p-4 pr-0 pb-4">
        <MySchemaFormItem
          :schema="property"
          :state="state[key]"
          :paths="paths.concat(key)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
