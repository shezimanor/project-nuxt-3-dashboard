<script lang="ts" setup>
import schemaJSON from '~/data/dev-schema.json';
// schema在最上層就將他加入響應式系統
const schema = reactive(JSON.parse(JSON.stringify(schemaJSON)));
// 已經拿到 schema
console.log('schema', schema);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productEdit" grow>
      <UDashboardNavbar title="編輯產品">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <MySchemaForm :schema="schema" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
