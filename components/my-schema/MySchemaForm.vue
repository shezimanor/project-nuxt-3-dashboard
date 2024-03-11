<!-- Component Name: MySchemaForm -->
<script lang="ts" setup>
import isEmptyObject from '~/utils/isEmptyObject';
import traverseSchemaToRules from '~/utils/traverseSchemaToRules';
import traverseSchemaToState from '~/utils/traverseSchemaToState';
const props = defineProps({
  schema: {
    type: Object,
    required: true
  }
});

const state = reactive(traverseSchemaToState(props.schema));
const rules = reactive(traverseSchemaToRules(props.schema));
console.log('state:', state);
console.log('rules:', rules);
</script>

<template>
  <div class="flex flex-col">
    <h2>Schema Form</h2>
    <form v-if="schema && !isEmptyObject(schema)">
      <MySchemaFormItem :schema="schema" :state="state" />
    </form>
  </div>
</template>

<style scoped></style>
