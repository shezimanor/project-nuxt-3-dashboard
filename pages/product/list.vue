<script lang="ts" setup>
import { MyConfirmModal } from '#components';
import type { Product } from '~/types';

const toast = useToast();
const modal = useModal();
const $router = useRouter();

const { data: productList, pending } = await useLazyAsyncData(
  'getProductList',
  () => $fetch('/api/products')
);

const defaultColumns = [
  {
    key: 'title',
    label: '產品標題'
  },
  {
    key: 'prototype_title',
    label: '產品模型'
  },
  {
    key: 'prototype_version',
    label: '模型版號'
  },
  {
    key: 'updated_at',
    label: '最後更新時間'
  },
  {
    key: 'actions'
  }
];
const items = (row: any) => [
  [
    {
      label: '預覽',
      icon: 'i-heroicons-play-20-solid',
      click() {
        $router.push(`/product/showcase/${row.id}`);
      }
    }
  ],
  [
    {
      label: '編輯',
      icon: 'i-heroicons-pencil-square-20-solid',
      click() {
        $router.push(`/product/edit/update/${row.prototype_id}?id=${row.id}`);
      }
    },
    {
      label: '複製',
      icon: 'i-heroicons-document-duplicate-20-solid',
      disabled: true,
      click() {
        //TODO: copyProduct(row.id);
      }
    }
  ],
  [
    {
      label: '刪除',
      icon: 'i-heroicons-trash-20-solid',
      click() {
        onDelete(row.id);
      }
    }
  ]
];
const activeList = computed(() => {
  if (
    !productList ||
    !Object.prototype.hasOwnProperty.call(productList.value, 'list')
  )
    return [];
  return productList.value.list.filter((item: Product) => item.status === 1);
});

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
          :rows="activeList"
          :columns="defaultColumns"
          :loading="pending"
          class="w-full"
          :ui="{ th: { base: 'last:text-right' } }"
        >
          <template #actions-header>
            <UButton
              v-if="activeList.length > 0"
              icon="i-heroicons-plus-20-solid"
              label="建立產品"
              class="hidden md:inline-flex"
              to="/product/build"
            />
            <UButton
              v-if="activeList.length > 0"
              icon="i-heroicons-plus-20-solid"
              class="md:hidden"
              to="/product/build"
            />
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="items(row)">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal-20-solid"
              />
            </UDropdown>
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
