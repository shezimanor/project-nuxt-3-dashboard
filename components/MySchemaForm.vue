<script lang="ts" setup>
import traverseSchemaToState from '~/utils/traverseSchemaToState';
const props = defineProps({
  schema: {
    type: Object,
    required: true
  }
});

const state = traverseSchemaToState(props.schema);
console.log('state:', state);
</script>

<template>
  <div class="flex">
    <h2>Schema Form</h2>
  </div>
</template>

<style scoped></style>
