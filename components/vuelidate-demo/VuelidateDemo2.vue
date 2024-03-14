<script lang="ts" setup>
import schemaJSON from '~/data/dev-schema-vuelidate-demo-2.json';
// schema在最上層就將他加入響應式系統
import { useVuelidate } from '@vuelidate/core';
import traverseSchemaToRules from '~/utils/traverseSchemaToRules';
import traverseSchemaToState from '~/utils/traverseSchemaToState';

const rawSchema = JSON.parse(JSON.stringify(schemaJSON));
const schema = reactive(rawSchema);
const rules = traverseSchemaToRules(rawSchema);
const state = reactive(traverseSchemaToState(schema));

console.log('state', state);
console.log('rules', rules);
const v$ = useVuelidate(rules, state, {
  // Tells Vuelidate to track changes on the state automatically.
  $autoDirty: true,
  // When set to false, tells the validation rules to be called on init, otherwise they are lazy and only called when the field is dirty.
  $lazy: true
});
</script>
<template>
  <div class="border border-primary rounded-md p-2">
    <h1>Vuelidate Demo 2: 測試陣列</h1>
    <UFormGroup label="標題">
      <UInput v-model="state.basicJSON.title" />
    </UFormGroup>
    <h2>state:</h2>
    <pre>{{ state }}</pre>
    <h2>v$:</h2>
    <pre>{{ v$ }}</pre>
  </div>
</template>
