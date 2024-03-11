<script setup>
const obj = reactive({
  name: 'Ryan',
  age: 36,
  job: 'student'
});
</script>
<template>
  <div class="border border-blue-400 p-2">
    <h1>HiCom</h1>
    <div class="border border-blue-400 p-2">
      <HiComponentChild :schema="obj" />
    </div>
    <UButton @click="obj.job = 'teacher'">Click</UButton>
  </div>
</template>
