<script lang="ts" setup>
const { data } = await useFetch('/api/products');
console.log('data:', data.value);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productList" grow>
      <UDashboardNavbar title="產品列表"></UDashboardNavbar>
      <div v-if="data && data.length > 0">
        {{ data[0] }}
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
