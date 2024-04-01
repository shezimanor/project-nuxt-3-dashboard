<script lang="ts" setup>
// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  state: {
    type: [Object, Array, String, Number, Boolean],
    default: null
  },
  paths: {
    type: Array,
    default: () => []
  }
});

/**
 * 判定他是否為陣列型排版
 */
const isArrayLayout = computed(() => {
  return isValidArraySchema(props.schema);
});

/**
 * 判定他是否為物件型排版
 */
const isObjectLayout = computed(() => {
  return isValidObjectSchema(props.schema);
});

/**
 * 用來判斷要使用哪個動態表單元件(排版型、輸入型)
 */
const mySchemaDynamicFormComponent = computed(() => {
  return isObjectLayout.value
    ? 'MySchemaLayoutObject'
    : isArrayLayout.value
    ? props.schema.ui.widget === 'array-tabs'
      ? 'MySchemaLayoutArrayTabs'
      : 'MySchemaLayoutArray'
    : 'MySchemaFieldUnit';
});
</script>

<template>
  <div>
    <!-- object -->
    <MySchemaLayoutObject
      v-if="mySchemaDynamicFormComponent === 'MySchemaLayoutObject'"
      :schema="schema"
      :state="state as Record<string, any>"
      :paths="paths"
    />
    <!-- array: array basic -->
    <MySchemaLayoutArray
      v-else-if="mySchemaDynamicFormComponent === 'MySchemaLayoutArray'"
      :schema="schema"
      :state="state as unknown[]"
      :paths="paths"
    />
    <!-- array: array tabs -->
    <MySchemaLayoutArrayTabs
      v-else-if="mySchemaDynamicFormComponent === 'MySchemaLayoutArrayTabs'"
      :schema="schema"
      :state="state as unknown[]"
      :paths="paths"
    />
    <!-- 基礎型別 -->
    <MySchemaFieldUnit
      v-else
      :schema="schema"
      :state="state as string | number | boolean | unknown[] | undefined"
      :paths="paths"
    />
  </div>
</template>

<style scoped></style>
