<script lang="ts" setup>
const todoList = ref([
  { label: '表單驗證器', help: '專案核心功能', done: true },
  { label: '建立產品完整流程', help: '主要功能', done: true },
  { label: '編輯產品流程', help: '主要功能-新增', done: true },
  { label: '編輯產品流程', help: '主要功能-更新', done: true },
  { label: '產品列表流程', help: '主要功能-列表', done: true },
  { label: '產品列表流程', help: '主要功能-按鈕', done: true },
  { label: '產品展示完整流程', help: '主要功能', done: true },
  { label: '第一個產產品原型產品展示元件', help: '旋轉立方', done: true },
  { label: '第一個產產品原型Schema', help: '旋轉立方', done: true },
  { label: '第二個產品原型產品展示元件', help: '靜態展示', done: true },
  { label: '第二個產品原型Schema', help: '靜態展示', done: true },
  { label: '第三個產品原型產品展示元件', help: '刮刮樂', done: true },
  { label: '第三個產品原型Schema', help: '刮刮樂', done: true },
  { label: '建立縮圖檔案', help: 'PS', done: true },
  { label: '建立產品的預覽功能', help: '用 Modal 來做', done: true },
  { label: '內建其他產品的預設產品清單', help: '1~4個', done: false },
  { label: '首頁功能', help: '預計用來展示教學和功能', done: false },
  { label: '專案教學和演示', help: '包含報告與圖解', done: false },
  { label: '開發者文件', help: 'schema規範文件', done: false },
  { label: '全站樣式與細節的優化和修改', help: '持續進行', done: false }
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
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h2 class="mb-2">專案待執行事項:</h2>
            <UCheckbox
              v-for="(item, index) in todoList"
              :key="index"
              color="lime"
              :label="item.label"
              :help="item.help"
              :model-value="item.done"
            />
          </div>
          <div>
            <h2 class="mb-2">複製新的Schema字串</h2>
            <ClipboardComponent />
          </div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
