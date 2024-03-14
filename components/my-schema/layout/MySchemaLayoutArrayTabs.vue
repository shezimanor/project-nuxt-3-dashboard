<script lang="ts" setup>
// 有別於物件排版元件，這個「陣列排版元件」就會直接對 rootState 進行操作
import { useMySchemaStore } from '~/stores/mySchemaStore';
import deepClone from '~/utils/deepClone';
import traverseSchemaToState from '~/utils/traverseSchemaToState';
// 使用 uuid 才能確保每次都是新的 key
import { v4 as uuid } from 'uuid';

const mySchemaStore = useMySchemaStore();

// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  state: {
    type: Object,
    required: true
  },
  paths: {
    type: Array,
    default: () => []
  }
});

// tabs model
const selected = ref(0);

// 注入依賴: 更新用 action: updateState
const { addArrayState, removeArrayState, clearArrayState } = inject(
  'rootState'
) as {
  [key: string]: any;
};

// 取得項目空殼(用於新增，每次使用都要用深層拷貝)，不要直接把當下這層 schema 傳進去，一定要傳 `schema.items`
const itemModel = traverseSchemaToState(props.schema.items);

// 新增項目
function addItem() {
  // deepClone(itemModel) 拷貝空殼物件
  addArrayState(props.paths, deepClone(itemModel));
  // highlight tab
  if (props.state.length === 1) selected.value = 0;
}
// 刪除項目
function removeItem(index: number) {
  removeArrayState(props.paths, index);
  if (props.state.length === 0) selected.value = 0;
  else selected.value = index - 1;
}
// 刪除所有項目
function removeAllItems() {
  clearArrayState(props.paths);
}
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-lime-500 font-bold text-xl mb-1">
      {{ schema.ui.label ? schema.ui.label : 'Layout Arrayt(No Label)' }}
    </h3>
    <UPageCard
      v-show="mySchemaStore.state.testMode"
      title="Form Layout Array Tabs"
      description="陣列排版元件(Tabs)：底下渲染各個 items"
      icon="i-heroicons-rectangle-stack-20-solid"
      :ui="{ icon: { wrapper: '', base: 'text-lime-500' } }"
    />
    <UCard v-show="mySchemaStore.state.testMode" :ui="{ base: 'my-2' }">
      <ul class="w-full flex items-stretch gap-x-4">
        <li class="flex flex-col gap-y-2 grow">
          <h4 class="text-lime-600 font-bold">itemModel:</h4>
          <hr />
          <pre>{{ itemModel }}</pre>
        </li>
        <li class="flex flex-col gap-y-2 grow">
          <h4 class="text-lime-600 font-bold">state:</h4>
          <hr />
          <pre>{{ state }}</pre>
        </li>
        <li class="flex flex-col gap-y-2 grow">
          <h4 class="text-lime-600 font-bold">paths:</h4>
          <hr />
          <pre>{{ paths }}</pre>
        </li>
      </ul>
    </UCard>
    <!-- 工具列 -->
    <UButtonGroup
      size="sm"
      orientation="horizontal"
      :ui="{ wrapper: { horizontal: 'mb-2 self-start' } }"
    >
      <UButton label="新增項目" color="lime" @click="addItem" />
      <UButton
        v-if="state.length > 0"
        label="刪除全部"
        color="rose"
        @click="removeAllItems"
      />
    </UButtonGroup>
    <UTabs
      v-if="state.length > 0"
      :items="state"
      :ui="{
        list: { base: 'max-w-fit' }
      }"
      v-model="selected"
    >
      <template #default="{ item, index, selected }">
        <div
          class="w-32 flex items-center justify-center gap-2 relative truncate"
        >
          <span class="truncate">Item {{ index + 1 }}</span>
        </div>
      </template>
      <template #item="{ item, index }">
        <UBadge
          v-show="mySchemaStore.state.testMode"
          color="amber"
          variant="outline"
          :ui="{ base: 'self-start' }"
          >Index: {{ index }}</UBadge
        >
        <UButtonGroup
          size="sm"
          orientation="horizontal"
          :ui="{ wrapper: { horizontal: 'mb-2 self-start' } }"
        >
          <UButton
            v-if="state.length > 0"
            label="刪除項目"
            color="rose"
            @click="removeItem(Number(index))"
          />
        </UButtonGroup>
        <MySchemaFormItem
          :schema="schema.items"
          :state="item"
          :paths="paths.concat(`${index}`)"
        />
      </template>
    </UTabs>
  </div>
</template>

<style scoped></style>