<script lang="ts" setup>
// 有別於物件排版元件，這個「陣列排版元件」就會直接對 rootState 進行操作
import { useMySchemaStore } from '~/stores/mySchemaStore';
import traverseSchemaToState from '~/utils/traverseSchemaToState';
// 使用 uuid 才能確保每次都是新的 key
import { v4 as uuid } from 'uuid';
import getUuids from '~/utils/getUuids';

const mySchemaStore = useMySchemaStore();

// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  state: {
    type: Array,
    required: true
  },
  paths: {
    type: Array,
    default: () => []
  }
});

// 注入依賴: 處理陣列 action
const {
  rootStateValidator,
  addArrayState,
  removeArrayState,
  moveArrayState,
  clearArrayState
} = inject('rootState') as {
  [key: string]: any;
};

// 取得項目空殼(用於新增，每次使用都要用深層拷貝)，不要直接把當下這層 schema 傳進去，一定要傳 `schema.items`
const itemModel = traverseSchemaToState(props.schema.items);

// key id
const uuidList = ref(getUuids(props.state.length));

// 找到當下的驗證器
const stateValidator = computed(() => {
  return getStateValidatorByPaths(
    rootStateValidator,
    props.paths,
    props.paths.length
  );
});

// 新增項目
async function addItem() {
  // deepClone(itemModel) 拷貝空殼物件
  addArrayState(props.paths, deepClone(itemModel));
  await nextTick();
  // 同步id陣列
  uuidList.value.push(uuid());
}
// 刪除項目
async function removeItem(index: number) {
  removeArrayState(props.paths, index);
  await nextTick();
  // 同步id陣列
  uuidList.value.splice(index, 1);
}
// 移動項目
async function moveItem(fromIndex: number, direction: 'prev' | 'next') {
  const toIndex = direction === 'prev' ? fromIndex - 1 : fromIndex + 1;
  if (toIndex < 0 || toIndex >= props.state.length) return;
  moveArrayState(props.paths, fromIndex, toIndex);
  await nextTick();
  // 同步id陣列
  uuidList.value.splice(toIndex, 0, uuidList.value.splice(fromIndex, 1)[0]);
}
// 刪除所有項目
async function removeAllItems() {
  clearArrayState(props.paths);
  await nextTick();
  // 同步id陣列
  uuidList.value = [];
}
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-lime-500 font-bold text-xl mb-1">
      {{ schema.ui.label ? schema.ui.label : 'Layout Array(No Label)' }}
    </h3>
    <span
      v-show="
        stateValidator.$dirty &&
        stateValidator.$invalid &&
        stateValidator.$message
      "
      class="mb-1 text-red-500 dark:text-red-400"
      >{{ stateValidator.$message }}</span
    >
    <UCard>
      $model:
      <pre>{{ stateValidator.$model }}</pre>
    </UCard>
    <!-- 工具列 -->
    <UButtonGroup
      size="sm"
      orientation="horizontal"
      :ui="{ wrapper: { horizontal: 'self-start' } }"
    >
      <UButton label="新增項目" color="lime" @click="addItem" />
      <UButton
        v-if="state.length > 0"
        label="刪除全部"
        color="rose"
        @click="removeAllItems"
      />
    </UButtonGroup>
    <div
      v-for="(item, index) in state"
      class="flex flex-col mt-2 pb-4"
      :class="{ 'gap-y-4': mySchemaStore.state.testMode }"
      :key="uuidList[index]"
    >
      <UBadge
        v-show="mySchemaStore.state.testMode"
        color="amber"
        variant="outline"
        :ui="{ base: 'self-start' }"
        >Index: {{ index }}</UBadge
      >
      <div class="flex justify-between mb-2">
        <div class="flex gap-2 self-start">
          <UTooltip
            v-show="index > 0"
            text="往上移動"
            :popper="{ placement: 'top' }"
            :ui="{
              background: 'bg-white dark:bg-blue-700',
              color: 'text-blue-700 dark:text-white'
            }"
          >
            <UButton
              color="gray"
              icon="i-heroicons-arrow-up-20-solid"
              size="sm"
              @click="moveItem(Number(index), 'prev')"
            />
          </UTooltip>
          <UTooltip
            v-show="index < state.length - 1 && state.length > 1"
            text="往下移動"
            :popper="{ placement: 'top' }"
            :ui="{
              background: 'bg-white dark:bg-blue-700',
              color: 'text-blue-700 dark:text-white'
            }"
          >
            <UButton
              color="gray"
              icon="i-heroicons-arrow-down-20-solid"
              size="sm"
              @click="moveItem(Number(index), 'next')"
            />
          </UTooltip>
        </div>
        <div>
          <UTooltip
            text="刪除項目"
            :popper="{ placement: 'top' }"
            :ui="{
              background: 'bg-white dark:bg-rose-700',
              color: 'text-rose-700 dark:text-white'
            }"
          >
            <UButton
              color="gray"
              icon="i-heroicons-x-mark-20-solid"
              size="sm"
              @click="removeItem(Number(index))"
            />
          </UTooltip>
        </div>
      </div>
      <MySchemaFormItem
        :schema="schema.items"
        :state="state[index] as string | number | boolean | undefined | Record<string, any>"
        :paths="paths.concat(`${index}`)"
      />
    </div>
  </div>
</template>

<style scoped></style>
