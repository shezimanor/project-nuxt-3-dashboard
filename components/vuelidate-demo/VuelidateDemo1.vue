<script lang="ts" setup>
import schemaJSON from '~/data/dev-schema-vuelidate-simple.json';
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
    <h1>Vuelidate Demo 1</h1>
    <UFormGroup label="標題">
      <UInput v-model="state.basicJSON.title" />
      <span class="text-rose-500" v-if="v$.basicJSON.title.required.$invalid">{{
        v$.basicJSON.title.required.$message
      }}</span>
      <span
        class="text-rose-500"
        v-else-if="v$.basicJSON.title.minLength.$invalid"
        >{{ v$.basicJSON.title.minLength.$message }}</span
      >
      <span
        class="text-rose-500"
        v-else-if="v$.basicJSON.title.sameAs.$invalid"
        >{{ v$.basicJSON.title.sameAs.$message }}</span
      >
    </UFormGroup>
    <UFormGroup label="描述">
      <UInput v-model="state.basicJSON.description" />
      <span
        class="text-rose-500"
        v-if="v$.basicJSON.description.required.$invalid"
        >{{ v$.basicJSON.description.required.$message }}</span
      >
      <span
        class="text-rose-500"
        v-else-if="v$.basicJSON.description.sameAs.$invalid"
        >{{ v$.basicJSON.description.sameAs.$message }}</span
      >
    </UFormGroup>
    <UFormGroup label="數量">
      <UInput v-model="state.prototypeJSON.productQuantity" />
      <span
        class="text-rose-500"
        v-if="v$.prototypeJSON.productQuantity.required.$invalid"
        >{{ v$.prototypeJSON.productQuantity.required.$message }}</span
      >
      <span
        class="text-rose-500"
        v-else-if="v$.prototypeJSON.productQuantity.integer.$invalid"
        >{{ v$.prototypeJSON.productQuantity.integer.$message }}</span
      >
      <span
        class="text-rose-500"
        v-else-if="v$.prototypeJSON.productQuantity.between.$invalid"
        >{{ v$.prototypeJSON.productQuantity.between.$message }}</span
      >
    </UFormGroup>
    <h2>state:</h2>
    <pre>{{ state }}</pre>
    <h2>v$:</h2>
    <pre>{{ v$ }}</pre>
  </div>
</template>
