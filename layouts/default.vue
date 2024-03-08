<script lang="ts" setup>
// When using with Nuxt 3, this function will NOT be auto imported in favor of Nitro's built-in useStorage(). Use explicit import if you want to use the function from VueUse.
import { useStorage } from '@vueuse/core';
// 用 useStorage 可以讓瀏覽器記憶個別使用者的偏好設定
interface DashboardConfig {
  leftPanelWidth: number;
}
const dashboardConfig: DashboardConfig = {
  leftPanelWidth: 250
};
const dashboardConfigState = useStorage('dashboard-config', dashboardConfig);

const links = [
  {
    id: 'home',
    label: '首頁',
    icon: 'i-heroicons-home-solid',
    to: '/'
  },
  {
    id: 'product-list',
    label: '產品列表',
    icon: 'i-heroicons-table-cells-16-solid',
    to: '/product/list'
  },
  {
    id: 'product-build',
    label: '建立產品',
    icon: 'i-heroicons-plus-circle-20-solid',
    to: '/product/build'
  },
  {
    id: 'product-edit',
    label: '編輯產品(test)',
    icon: 'i-heroicons-cube-transparent-20-solid',
    to: '/product/edit'
  }
];
</script>

<template>
  <!-- UDashboardLayout: https://ui.nuxt.com/pro/components/dashboard-layout -->
  <UDashboardLayout>
    <!-- UDashboardPanel: 可以滑動左側欄寬度 -->
    <UDashboardPanel
      :width="dashboardConfigState.leftPanelWidth"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <LogoNav />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="links" />
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />
  </UDashboardLayout>
</template>

<style scoped></style>
