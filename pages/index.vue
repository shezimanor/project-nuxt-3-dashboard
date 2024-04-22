<script lang="ts" setup></script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productBuild" grow>
      <UDashboardNavbar title="首頁">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <ULandingHero
          title="結構化表單系統"
          description="模擬結構化表單系統的應用，提供使用者透過填寫結構化表單生成產品，並對產品進行管理。"
          :links="[
            {
              label: '建立產品',
              icon: 'i-heroicons-plus-20-solid',
              size: 'md',
              to: '/product/build'
            },
            {
              label: '了解專案',
              trailingIcon: 'i-heroicons-arrow-small-right',
              color: 'gray',
              size: 'md'
            }
          ]"
          :ui="{ wrapper: 'py-20 sm:py-24 md:py-28 relative' }"
        />
        <div class="grid grid-cols-1 sm:px-8 md:grid-cols-3 gap-6">
          <img
            class="index-images"
            src="/images/index/index-1.png"
            alt="專案應用截圖1"
          />
          <img
            class="index-images"
            src="/images/index/index-2.png"
            alt="專案應用截圖2"
          />
          <img
            class="index-images"
            src="/images/index/index-3.png"
            alt="專案應用截圖3"
          />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
