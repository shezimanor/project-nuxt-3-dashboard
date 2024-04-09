<script lang="ts" setup>
import schemaJSON from '~/data/dev/dev-schema-2-layer-array-object.json';
// schema在最上層就將他加入響應式系統
const rawSchema = deepClone(schemaJSON);
const schema = reactive(rawSchema);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productEdit" grow>
      <UDashboardNavbar title="編輯產品">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="pt-0 md:pt-4">
        <MySchemaForm :raw-schema="rawSchema" :schema="schema" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
