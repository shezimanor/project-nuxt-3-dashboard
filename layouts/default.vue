<script lang="ts" setup>
const links = [
  {
    id: 'home',
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
    tooltip: {
      text: 'Home',
      shortcuts: ['G', 'H']
    }
  }
];
</script>

<template>
  <!-- UDashboardLayout: https://ui.nuxt.com/pro/components/dashboard-layout -->
  <UDashboardLayout>
    <!-- UDashboardPanel: 可以滑動左側欄寬度 -->
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar />

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="links" />
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />
  </UDashboardLayout>
</template>

<style scoped></style>
