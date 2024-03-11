<!-- Component Name: MySchemaFormItem -->
<script lang="ts" setup>
import { isValidArraySchema, isValidObjectSchema } from '~/utils/schemaParser';
const MySchemaLayoutObject = resolveComponent('MySchemaLayoutObject');
const MySchemaLayoutArray = resolveComponent('MySchemaLayoutArray');
const MySchemaFieldUnit = resolveComponent('MySchemaFieldUnit');

// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  state: {
    type: Object,
    default: null
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
const MySchemaDynamicFormComponent = computed(() => {
  return isObjectLayout.value
    ? 'MySchemaLayoutObject'
    : isArrayLayout.value
    ? 'MySchemaLayoutArray'
    : 'MySchemaFieldUnit';
});

onMounted(() => {
  console.log('MySchemaFormItem props.schema:', props.schema);
});
</script>

<template>
  <div class="flex flex-col">
    <h3>Form Item</h3>
    <!-- object -->
    <component
      v-if="MySchemaDynamicFormComponent === 'MySchemaLayoutObject'"
      :is="MySchemaLayoutObject"
      :schema="schema"
      :state="state"
    />
    <!-- array -->
    <component
      v-else-if="MySchemaDynamicFormComponent === 'MySchemaLayoutArray'"
      :is="MySchemaLayoutArray"
      :schema="schema"
      :state="state"
    />
    <!-- 基礎型別 -->
    <component v-else :is="MySchemaFieldUnit" :schema="schema" :state="state">
    </component>
  </div>
</template>

<style scoped></style>
