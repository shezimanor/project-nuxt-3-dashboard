<script lang="ts" setup>
// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  state: {
    type: [Array, String, Number, Boolean],
    default: undefined
  },
  stateValidator: {
    type: Object,
    default: null
  },
  paths: {
    type: Array,
    default: () => []
  }
});
// 輸入值
const modelValue = ref(getTypeDefault(props.schema.type));
modelValue.value = props.state;

// 注入依賴
const { updateState } = inject('rootState') as {
  [key: string]: any;
};

// 元件設定
const defaultConfig = ref({
  options: [],
  placeholder: 'Select...',
  disabled: false,
  searchable: true,
  searchablePlaceholder: 'Search...',
  valueAttribute: 'value',
  labelAttribute: 'label'
});
const mergedConfig = computed(() => {
  // target 物件會更新(first params)
  return Object.assign(defaultConfig.value, props.schema.ui.widgetConfig);
});

// modelValue 更新後，
watch(modelValue, (newValue) => {
  updateState(props.paths, newValue);
});
</script>

<template>
  <UFormGroup
    :label="schema.ui.label"
    :description="schema.ui.description"
    :error="
      stateValidator.$dirty &&
      stateValidator.$invalid &&
      stateValidator.$message
    "
  >
    <USelectMenu
      v-model="modelValue"
      :options="mergedConfig.options"
      :placeholder="mergedConfig.placeholder"
      :searchable="mergedConfig.searchable"
      :searchable-placeholder="mergedConfig.searchablePlaceholder"
      :value-attribute="mergedConfig.valueAttribute"
      :option-attribute="mergedConfig.labelAttribute"
      :search-attributes="[
        mergedConfig.valueAttribute,
        mergedConfig.labelAttribute
      ]"
      :disabled="mergedConfig.disabled"
      class="max-w-full md:max-w-xs"
    >
      <template #empty>沒有選項</template>
    </USelectMenu>
    <!-- <pre>{{ stateValidator }}</pre> -->
  </UFormGroup>
</template>

<style scoped></style>
