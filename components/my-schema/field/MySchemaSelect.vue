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
  labelAttribute: 'label',
  isColorMode: false,
  isThumbnailMode: false
});
const mergedConfig: any = computed(() => {
  // target 物件會更新(first params)
  return Object.assign(defaultConfig.value, props.schema.ui.widgetConfig);
});
const modelLabel = computed(() => {
  if (mergedConfig.value && mergedConfig.value.options)
    return mergedConfig.value.options.find(
      (option: any) =>
        option[mergedConfig.value.valueAttribute] === modelValue.value
    )[mergedConfig.value.labelAttribute];
  else return '';
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
      <!-- 選中: 顏色模式 -->
      <template v-if="mergedConfig.isColorMode" #label>
        <span
          :key="modelValue"
          class="h-2 w-2 rounded-full"
          :class="`bg-${modelValue}-500 dark:bg-${modelValue}-400`"
        />
        <span class="truncate">{{ modelLabel }}</span>
      </template>
      <!-- 選中: 縮圖模式 -->
      <template v-else-if="mergedConfig.isThumbnailMode" #label>
        <UAvatar :src="`/images/thumbnail/${modelValue}`" size="2xs" />
        <span class="truncate">{{ modelLabel }}</span>
      </template>
      <!-- 選項: 顏色模式 -->
      <template v-if="mergedConfig.isColorMode" #option="{ option }">
        <span
          :key="option.value"
          class="h-2 w-2 rounded-full"
          :class="`bg-${option.value}-500 dark:bg-${option.value}-400`"
        />
        <span class="truncate">{{ option.label }}</span>
      </template>
      <!-- 選項: 縮圖模式 -->
      <template v-else-if="mergedConfig.isThumbnailMode" #option="{ option }">
        <UAvatar :src="`/images/thumbnail/${option.value}`" size="2xs" />
        <span class="truncate">{{ option.label }}</span>
      </template>
    </USelectMenu>
    <!-- <pre>{{ stateValidator }}</pre> -->
  </UFormGroup>
</template>

<style scoped></style>
