<!-- Component Name: MySchemaFieldUnit -->
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

// 透過路徑取得目前欄位對應的 rootState 值
const mappingRootState = computed(() => {
  return props.paths.reduce((deepState: any, currentPath: any) => {
    return deepState[currentPath];
  }, rootState);
});

// modelValue 更新後，
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
  <div class="flex flex-col gap-y-4">
    <UPricingCard
      v-if="mySchemaStore.state.testMode"
      title="Form Field Unit"
      description="欄位元件分配器"
      :price="`${mappingRootState}`"
      cycle="/ rootState"
      discount=""
      :highlight="true"
      :badge="{ label: '表單單位元件' }"
      orientation="horizontal"
      :features="[
        `Type: ${schema.type}`,
        `widget: ${schema.ui.widget}`,
        `Schema paths: ${paths.join('.')}`
      ]"
    />
    <UInput v-model="modelValue" />
  </div>
</template>

<style scoped></style>
