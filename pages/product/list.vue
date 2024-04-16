<script lang="ts" setup>
import { MyConfirmModal } from '#components';

const toast = useToast();
const modal = useModal();

const { data: productList, pending } = await useLazyAsyncData(
  'getProductList',
  () => $fetch('/api/products')
);

const defaultColumns = [
  {
    key: 'title',
    label: '標題'
  },
  {
    key: 'prototype_title',
    label: '產品模型'
  },
  {
    key: 'prototype_version',
    label: '版號'
  },
  {
    key: 'actions'
  }
];
const items = (row: any) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => console.log('Edit', row.id)
    }
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => console.log('Delete', row.id)
    }
  ]
];
// 刪除產品
function onDelete(id: string) {
  modal.open(MyConfirmModal, {
    modalContent: '確定要刪除這個產品嗎？刪除後將無法復原',
    buttonText: '刪除',
    buttonColor: 'red',
    params: {
      id
    },
    onConfirm({ id }) {
      modal.close();
      deleteProduct(id);
    },
    onCancel() {
      modal.close();
    }
  });
}
async function deleteProduct(id: string) {
  const response = await $fetch(`/api/products/${id}`, {
    method: 'delete'
  });
  if (response.result) {
    toast.add({
      id: `product_delete_success`,
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'green',
      title: '刪除產品成功！',
      timeout: 1000
    });
    refreshData();
  } else {
    toast.add({
      id: `product_delete_fail`,
      icon: 'i-heroicons-x-circle-20-solid',
      color: 'red',
      title: '刪除產品失敗！',
      timeout: 1000
    });
  }
}

const refreshData = () => refreshNuxtData('getProductList');
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productList" grow>
      <UDashboardNavbar title="產品列表">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <UTable
          v-if="productList"
          :rows="productList.list"
          :columns="defaultColumns"
          :loading="pending"
          class="w-full"
          :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        >
          <template #actions-data="{ row }">
            <div class="flex flex-row gap-x-2">
              <UButton
                color="green"
                variant="ghost"
                icon="i-heroicons-play-20-solid"
                :to="`/product/showcase/${row.id}`"
              />
              <UButton
                color="sky"
                variant="ghost"
                icon="i-heroicons-pencil-square-20-solid"
                :to="`/product/edit/update/${row.prototype_id}?id=${row.id}`"
              />
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash-20-solid"
                @click="onDelete(row.id)"
              />
            </div>
          </template>
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-6 gap-3">
              <span class="italic text-sm">還沒建立任何商品</span>
              <UButton
                icon="i-heroicons-plus-20-solid"
                label="建立商品"
                to="/product/build"
              />
            </div>
          </template>
        </UTable>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
