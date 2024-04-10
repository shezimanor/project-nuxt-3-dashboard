<script lang="ts" setup>
// 有別於物件排版元件，這個「陣列排版元件」就會直接對 rootState 進行操作
import { useMySchemaStore } from '~/stores/mySchemaStore';
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

// tabs model
const selected = ref(0);

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

// 注入依賴: 負責捲動到指定位置
const { scorllFormContainer } = inject('rootForm') as {
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

// 主元素
const targetElement = ref(null);
const { top } = useElementBounding(targetElement);

// 新增項目
async function addItem() {
  // deepClone(itemModel) 拷貝空殼物件
  addArrayState(props.paths, deepClone(itemModel));
  // highlight tab
  await nextTick();
  if (props.state.length === 1) selected.value = 0;
  else selected.value = props.state.length - 1;
  // 同步id陣列
  uuidList.value.push(uuid());
  // 元素捲動(向上對齊)
  scorllFormContainer(top.value, false);
}
// 刪除項目
async function removeItem(index: number) {
  removeArrayState(props.paths, index);
  await nextTick();
  if (props.state.length === 0) selected.value = 0;
  else if (props.state.length === index) selected.value = index - 1;
  else selected.value = index;
  // 同步id陣列
  uuidList.value.splice(index, 1);
}
// 移動項目
async function moveItem(fromIndex: number, direction: 'prev' | 'next') {
  const toIndex = direction === 'prev' ? fromIndex - 1 : fromIndex + 1;
  if (toIndex < 0 || toIndex >= props.state.length) return;
  moveArrayState(props.paths, fromIndex, toIndex);
  await nextTick();
  selected.value = toIndex;
  // 同步id陣列
  uuidList.value.splice(toIndex, 0, uuidList.value.splice(fromIndex, 1)[0]);
}
// 刪除所有項目
async function removeAllItems() {
  clearArrayState(props.paths);
  await nextTick();
  selected.value = 0;
  // 同步id陣列
  uuidList.value = [];
}
</script>

<template>
  <div class="flex flex-col" ref="targetElement">
    <h3 class="text-lime-500 font-bold text-xl mb-1">
      {{ schema.ui.label ? schema.ui.label : 'Layout Array(No Label)' }}
    </h3>
    <UAlert
      v-show="
        stateValidator.$dirty &&
        stateValidator.$invalid &&
        stateValidator.$message
      "
      icon="i-heroicons-exclamation-triangle-20-solid"
      color="rose"
      variant="soft"
      :title="stateValidator.$message"
      class="mb-2"
    />
    <UCard v-if="false">
      $model:
      <pre>{{ stateValidator.$model }}</pre>
    </UCard>
    <!-- 工具列 -->
    <UButtonGroup
      size="sm"
      orientation="horizontal"
      :ui="{ wrapper: { horizontal: 'self-start' } }"
    >
      <UButton
        label="新增項目"
        icon="i-heroicons-plus-20-solid"
        color="lime"
        @click="addItem"
      />
      <UButton
        v-if="state.length > 0"
        label="刪除全部"
        icon="i-heroicons-trash-20-solid"
        color="rose"
        @click="removeAllItems"
      />
    </UButtonGroup>
    <UTabs
      v-if="state.length > 0"
      :items="state"
      :ui="{
        list: {
          base: 'mt-2 max-w-fit',
          marker: { background: 'bg-zinc-600 dark:bg-zinc-300' },
          tab: { active: 'text-white dark:text-black' }
        }
      }"
      v-model="selected"
    >
      <template #default="{ item, index, selected }">
        <div class="w-32 flex items-center justify-center gap-2 relative">
          <span v-if="state.length < 10">項目 {{ index + 1 }}</span>
          <span v-else class="truncate"> {{ index + 1 }}</span>
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
        <div class="flex justify-between mb-2">
          <div class="flex gap-2 self-start">
            <UTooltip
              v-show="index > 0"
              text="往前移動"
              :popper="{ placement: 'top' }"
              :ui="{
                background: 'bg-white dark:bg-blue-700',
                color: 'text-blue-700 dark:text-white'
              }"
            >
              <UButton
                color="gray"
                icon="i-heroicons-arrow-left-20-solid"
                size="sm"
                @click="moveItem(Number(index), 'prev')"
              />
            </UTooltip>
            <UTooltip
              v-show="index < state.length - 1 && state.length > 1"
              text="往後移動"
              :popper="{ placement: 'top' }"
              :ui="{
                background: 'bg-white dark:bg-blue-700',
                color: 'text-blue-700 dark:text-white'
              }"
            >
              <UButton
                color="gray"
                icon="i-heroicons-arrow-right-20-solid"
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
          :key="uuidList[index]"
          :schema="schema.items"
          :state="item"
          :paths="paths.concat(`${index}`)"
        />
      </template>
    </UTabs>
  </div>
</template>

<style scoped></style>
