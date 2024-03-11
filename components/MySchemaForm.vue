<script lang="ts" setup>
import traverseSchemaToRules from '~/utils/traverseSchemaToRules';
import traverseSchemaToState from '~/utils/traverseSchemaToState';
const props = defineProps({
  schema: {
    type: Object,
    required: true
  }
});

const state = traverseSchemaToState(props.schema);
const rules = traverseSchemaToRules(props.schema);
console.log('state:', state);
console.log('rules:', rules);
</script>

<template>
  <div class="flex">
    <h2>Schema Form</h2>
  </div>
</template>

<style scoped></style>
