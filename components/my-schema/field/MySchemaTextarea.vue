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
  rows: 5,
  placeholder: '請輸入...',
  disabled: false,
  autoresize: true,
  maxrows: 12,
  resize: false
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
    <UTextarea
      v-model="modelValue"
      :rows="mergedConfig.rows"
      :placeholder="mergedConfig.placeholder"
      :disabled="mergedConfig.disabled"
      :autoresize="mergedConfig.autoresize"
      :maxrows="mergedConfig.maxrows"
      :resize="mergedConfig.resize"
    />
    <!-- <pre>{{ stateValidator }}</pre> -->
  </UFormGroup>
</template>

<style scoped></style>
