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
  <div class="flex flex-col">
    <h3 class="text-primary font-bold text-xl mb-1">
      {{ schema.ui ? schema.ui.label : 'Layout Object(No Label)' }}
    </h3>
    <UPageCard
      v-show="mySchemaStore.state.testMode"
      title="Form Layout Object"
      description="物件排版元件：底下渲染各個 properties"
      icon="i-heroicons-square-3-stack-3d-20-solid"
    />
    <div
      v-for="(property, key) in filteredProperties"
      :key="key"
      class="flex flex-col p-4 pr-0 pb-4"
      :class="{ 'gap-y-4': mySchemaStore.state.testMode }"
    >
      <UBadge
        v-show="mySchemaStore.state.testMode"
        color="amber"
        variant="outline"
        :ui="{ base: 'self-start' }"
        >KeyName: {{ key }}</UBadge
      >
      <MySchemaFormItem
        :schema="property"
        :state="state[key]"
        :paths="paths.concat(key)"
      />
    </div>
  </div>
</template>

<style scoped></style>
