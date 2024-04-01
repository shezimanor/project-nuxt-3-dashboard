<script lang="ts" setup>
// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  validator: {
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

// 注入依賴
const { updateState } = inject('rootState') as {
  [key: string]: any;
};

// 元件設定
const defaultConfig = ref({
  placeholder: '請輸入...',
  disabled: false
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
  <!-- <UFormGroup
    :label="schema.ui.label"
    :error="
      validator.$dirty &&
      validator.$invalid &&
      validator.$silentErrors[0].$message
    "
  > -->
  <UFormGroup :label="schema.ui.label">
    <UInput
      v-model="modelValue"
      :placeholder="mergedConfig.placeholder"
      :disabled="mergedConfig.disabled"
    />
    <!-- <pre>{{ validator }}</pre> -->
  </UFormGroup>
</template>

<style scoped></style>
