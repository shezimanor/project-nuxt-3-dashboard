<script lang="ts" setup>
const { data: productData, pending } = await useFetch('/api/products');

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
    key: 'size',
    label: '尺寸'
  },
  {
    key: 'status',
    label: '狀態'
  }
];

const updateItem = async () => {
  const reponse = await $fetch(
    '/api/products/b09f8877-be64-450b-8844-9da462be82af',
    {
      method: 'put',
      body: {
        title: '綿羊造型立方CDD',
        description: 'CCC',
        size: '320x360',
        preview_link: 'link-new'
      }
    }
  );
  console.log('reponse:', reponse);
};
const addItem = async () => {
  const reponse = await $fetch('/api/products', {
    method: 'post',
    body: {
      title: '野狼造型立方GTO',
      description: '999',
      size: '720x300',
      preview_link: 'link-new-2',
      owner_id: 1,
      status: 0,
      prototype_id: '4dc207f2-2229-451a-aa9d-e29bb44acf84',
      prototype_title: '魔幻立方',
      prototype_version: '1.0.0'
    }
  });
  console.log('reponse:', reponse);
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productList" grow>
      <UDashboardNavbar title="產品列表"></UDashboardNavbar>
      <UTable
        v-if="productData"
        :rows="productData.list"
        :columns="defaultColumns"
        :loading="pending"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      ></UTable>
      <div>
        <UButton @click="updateItem">修改</UButton>
        <UButton @click="addItem">新增</UButton>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
