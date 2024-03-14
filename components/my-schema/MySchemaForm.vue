<script lang="ts" setup>
import { useMySchemaStore } from '~/stores/mySchemaStore';
import getLastParent from '~/utils/getLastParent';
import isEmptyObject from '~/utils/isEmptyObject';
import traverseSchemaToRules from '~/utils/traverseSchemaToRules';
import traverseSchemaToState from '~/utils/traverseSchemaToState';
// 驗證器
import { useVuelidate } from '@vuelidate/core';

const mySchemaStore = useMySchemaStore();

// props
const props = defineProps({
  schema: {
    type: Object,
    required: true
  },
  rawSchema: {
    type: Object,
    required: true
  }
});

console.log('testMode:', mySchemaStore.state.testMode);

const state = reactive(traverseSchemaToState(props.schema));
const rules = traverseSchemaToRules(props.rawSchema);
const v$ = useVuelidate(rules, state, {
  // autoDirty: true: 讓驗證器追蹤 state 的變化，不需要使用 v$
  $autoDirty: true,
  // $lazy: true: 初始化時不會觸發驗證
  $lazy: true
});

const testModeProxy = ref(mySchemaStore.state.testMode);
// path 不需要響應式: 讓子元件可以接自己的路徑陣列，方便後續抓值
const paths: any[] = [];

// update state
function updateState(paths: any, newValue: any) {
  // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
  // 當遇到陣列包物件的時候 path item會是 "[0]"
  const lastKeyIndex = paths.length - 1;
  const lastParent = getLastParent(state, paths, lastKeyIndex);

  // 更新最後一個鍵的值
  lastParent[paths[lastKeyIndex]] = newValue;
}
// add array state
function addArrayState(paths: any, newValue: any) {
  // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
  // 當遇到陣列包物件的時候 path item會是 "[0]"
  const lastKeyIndex = paths.length - 1;
  const lastParent = getLastParent(state, paths, lastKeyIndex);

  // 法一：使用陣列 push 做新增, "陣列"要整個取代才會觸發檢查
  // const newArray = lastParent[paths[lastKeyIndex]].slice();
  // newArray.push(newValue);
  // lastParent[paths[lastKeyIndex]] = newArray;
  // 法二：直接 push
  lastParent[paths[lastKeyIndex]].push(newValue);
}

// remove array state
function removeArrayState(paths: any, arrayIndex: number) {
  // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
  // 當遇到陣列包物件的時候 path item會是 "[0]"
  const lastKeyIndex = paths.length - 1;
  const lastParent = getLastParent(state, paths, lastKeyIndex);

  // 將項目移除
  const newArray = lastParent[paths[lastKeyIndex]].slice();
  newArray.splice(arrayIndex, 1);
  lastParent[paths[lastKeyIndex]] = newArray;
}

// clear array state
function clearArrayState(paths: any) {
  // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
  // 當遇到陣列包物件的時候 path item會是 "[0]"
  const lastKeyIndex = paths.length - 1;
  const lastParent = getLastParent(state, paths, lastKeyIndex);

  // 使用陣列清空
  lastParent[paths[lastKeyIndex]] = [];
}

watch(testModeProxy, (newValue) => {
  mySchemaStore.updateTestMode(newValue);
});

watch(state, () => {
  console.log('State Watcher Trigger');
});

// 提供依賴注入 rootState
provide('rootState', {
  rootState: state,
  updateState,
  addArrayState,
  removeArrayState,
  clearArrayState
});

console.log('state:', state);
console.log('rules:', rules);
</script>

<template>
  <div class="flex flex-col">
    <h2>Schema Form</h2>
    <div class="py-4">
      <UFormGroup label="測試模式">
        <UToggle v-model="testModeProxy" />
      </UFormGroup>
    </div>
    <div
      v-show="mySchemaStore.state.testMode"
      class="border p-4 rounded-2xl mb-4"
    >
      <pre>{{ state }}</pre>
    </div>
    <form v-if="schema && !isEmptyObject(schema)">
      <MySchemaFormItem :schema="schema" :state="state" :paths="paths" />
    </form>
  </div>
</template>

<style scoped></style>
