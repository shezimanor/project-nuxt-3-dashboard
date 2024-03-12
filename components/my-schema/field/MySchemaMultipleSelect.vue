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
  paths: {
    type: Array,
    default: () => []
  }
});
// 輸入值
const modelValue = ref(getTypeDefault(props.schema.type));
modelValue.value = props.state;

// 注入依賴 rootState(這裡沒用到) 和更新用 action: updateState
const { rootState, updateState } = inject('rootState') as {
  [key: string]: any;
};

// 元件設定
const defaultConfig = ref({
  options: [],
  placeholder: 'Select...',
  disabled: false,
  searchable: true,
  searchablePlaceholder: 'Search...'
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
  <UFormGroup :label="schema.ui.label">
    <USelectMenu
      v-model="modelValue"
      :options="mergedConfig.options"
      :placeholder="mergedConfig.placeholder"
      :searchable-placeholder="mergedConfig.searchablePlaceholder"
      :disabled="mergedConfig.disabled"
      multiple
    >
      <template #empty>沒有選項</template>
    </USelectMenu>
  </UFormGroup>
</template>

<style scoped></style>
