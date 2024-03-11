<!-- Component Name: MySchemaFieldUnit -->
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

// 注入依賴 rootState
const { rootState, updateState } = inject('rootState') as {
  [key: string]: any;
};

const mappingRootState = computed(() => {
  return props.paths.reduce((deepState: any, currentPath: any) => {
    return deepState[currentPath];
  }, rootState);
});

watch(modelValue, (newValue) => {
  updateState(props.paths, newValue);
});

onMounted(() => {
  // console.log('Unit props.state', props.state);
  // 初始化
  modelValue.value = props.state;
});
</script>

<template>
  <div class="flex flex-col">
    <h3>Form Field Unit</h3>
    <span>Schema Type: {{ schema.type }}</span>
    <span>Schema paths: {{ paths.join(',') }}</span>
    <span>Schema mappingRootState: {{ mappingRootState }}</span>
    <UInput v-model="modelValue" />
  </div>
</template>

<style scoped></style>
