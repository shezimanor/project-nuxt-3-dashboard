<script lang="ts" setup>
import schemaJSON from '~/data/dev-schema.json';
const schema = JSON.parse(JSON.stringify(schemaJSON));
// 已經拿到 schema
console.log('schema', schema);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productEdit" grow>
      <UDashboardNavbar title="編輯產品"></UDashboardNavbar>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
