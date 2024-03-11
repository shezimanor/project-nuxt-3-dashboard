<script setup>
const props = defineProps({
  schema: {
    type: Object,
    default: null
  }
});
onMounted(() => {
  console.log('props:', props.schema);
});
</script>
<template>
  <div class="border border-rose-400 p-2">
    <h1>HiComInner</h1>
    <div class="border border-rose-400 p-2">
      HiComInner:JOB:{{ schema.job }}
      <br />
    </div>
  </div>
</template>
