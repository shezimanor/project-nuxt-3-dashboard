<!-- Component Name: MySchemaFieldUnit -->
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
  }
});
const modelValue = ref(getTypeDefault(props.schema.type));

onMounted(() => {
  console.log('Unit props.state', props.state);
  // 初始化
  modelValue.value = props.state;
});
</script>

<template>
  <div class="flex flex-col">
    <h3>Form Field Unit</h3>
    <span>Schema Type: {{ schema.type }}</span>
    <UInput v-model="modelValue" />
  </div>
</template>

<style scoped></style>
