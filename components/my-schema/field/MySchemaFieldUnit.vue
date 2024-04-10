<script lang="ts" setup>
import {
  MySchemaInput,
  MySchemaMultipleSelect,
  MySchemaNumber,
  MySchemaRange,
  MySchemaSelect,
  MySchemaTextarea,
  MySchemaToggle
} from '#components';
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

// 注入依賴: rootState
const { rootState, rootStateValidator } = inject('rootState') as {
  [key: string]: any;
};

// 透過路徑取得目前欄位對應的 rootState 值
const mappingRootState = computed(() => {
  return props.paths.reduce((deepState: any, currentPath: any) => {
    return deepState[currentPath];
  }, rootState);
});

// 需要被渲染的欄位元件：由 schema.type 與 schema.ui.widget 共同決定
const fieldComponent = computed(() => {
  switch (props.schema.ui.widget) {
    case 'range':
      return MySchemaRange;
    case 'number':
      return MySchemaNumber;
    case 'toggle':
      return MySchemaToggle;
    case 'select':
      return MySchemaSelect;
    case 'multiple-select':
      return MySchemaMultipleSelect;
    case 'textarea':
      return MySchemaTextarea;
    case 'input':
    default:
      return MySchemaInput;
  }
});

// 找到當下的驗證器
const stateValidator = computed(() => {
  return getStateValidatorByPaths(
    rootStateValidator,
    props.paths,
    props.paths.length
  );
});
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <!-- mySchemaStore.state.testMode -->
    <UPricingCard
      v-if="false"
      :title="fieldComponent.__name"
      description="From 欄位元件分配器"
      :price="`${schema.ui.widget}`"
      :highlight="true"
      :badge="{ label: '表單單位元件' }"
      orientation="horizontal"
      :features="[
        `Type: ${schema.type}`,
        `Paths: ${paths.join('.')}`,
        `Current Type: ${typeof mappingRootState}`,
        `RootState: ${mappingRootState}`
      ]"
    />
    <UCard v-if="false"> $path: {{ stateValidator.$path }} </UCard>
    <!-- https://tailwindcss.com/docs/max-width -->
    <component
      :is="fieldComponent"
      :schema="schema"
      :state="state"
      :state-validator="stateValidator"
      :paths="paths"
      class="max-w-screen-md"
    />
  </div>
</template>

<style scoped></style>
