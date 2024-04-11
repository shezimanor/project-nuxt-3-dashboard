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
    <UToggle v-model="modelValue" />
    <!-- <pre>{{ stateValidator }}</pre> -->
  </UFormGroup>
</template>

<style scoped></style>
