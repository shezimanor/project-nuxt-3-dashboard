<script lang="ts" setup>
const todoList = ref([
  { label: '表單驗證器', help: '專案核心功能', done: true },
  { label: '第一個產品原型', help: '旋轉立方', done: true },
  { label: '建立產品完整流程', help: '主要功能', done: true },
  { label: '編輯產品流程', help: '主要功能-新增', done: true },
  { label: '編輯產品流程', help: '主要功能-更新', done: false },
  { label: '產品列表流程', help: '主要功能-列表', done: true },
  { label: '產品列表流程', help: '主要功能-按鈕', done: false },
  { label: '產品展示完整流程', help: '主要功能', done: true },
  { label: '建立產品樣式與細節', help: '優化', done: false },
  { label: '編輯產品樣式與細節', help: '優化', done: false },
  { label: '產品列表樣式與細節', help: '優化', done: true },
  { label: '產品展示樣式與細節', help: '優化', done: false },
  { label: '第二個產品原型預覽元件', help: '', done: true },
  { label: '第二個產品原型Schema', help: '', done: true },
  { label: '第三個產品原型預覽元件', help: '', done: false },
  { label: '第三個產品原型Schema', help: '', done: false },
  { label: '開發者文件', help: 'schema規範文件', done: false },
  { label: '首頁功能', help: '頁面功能', done: false },
  { label: '專案教學和演示', help: '包含報告與圖解', done: false }
]);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productBuild" grow>
      <UDashboardNavbar title="首頁">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div class="flex flex-col gap-y-2">
          <h2>專案待執行事項:</h2>
          <UCheckbox
            v-for="(item, index) in todoList"
            :key="index"
            color="lime"
            :label="item.label"
            :help="item.help"
            :model-value="item.done"
          />
          <hr />
          <h2>複製新的Schema字串</h2>
          <ClipboardComponent />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
