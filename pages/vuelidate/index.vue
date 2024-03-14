<script lang="ts" setup></script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productBuild" grow>
      <UDashboardNavbar title="Vuelidate 實驗室">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <!-- <VuelidateDemo1 /> -->
        <VuelidateDemo2 />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
