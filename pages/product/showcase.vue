<script lang="ts" setup>
const productState = ref([]);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productEdit" grow>
      <UDashboardNavbar title="產品展示">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="flex items-center justify-center">
        <MyPrototypeSwiper :product-state="productState" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
