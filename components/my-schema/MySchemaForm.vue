<!-- Component Name: MySchemaForm -->
<script lang="ts" setup>
import isEmptyObject from '~/utils/isEmptyObject';
import traverseSchemaToRules from '~/utils/traverseSchemaToRules';
import traverseSchemaToState from '~/utils/traverseSchemaToState';
const props = defineProps({
  schema: {
    type: Object,
    required: true
  }
});

const state = reactive(traverseSchemaToState(props.schema));
const rules = reactive(traverseSchemaToRules(props.schema));
// path 不需要響應式: 讓子元件可以接自己的路徑陣列，方便後續抓值
const paths: any[] = [];

// update state
function updateState(paths: any, newValue: any) {
  // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
  const lastKeyIndex = paths.length - 1;
  const lastParent = paths
    .slice(0, lastKeyIndex)
    .reduce(
      (parentState: any, currentKey: any) => parentState[currentKey],
      state
    );

  // 更新最後一個鍵的值
  lastParent[paths[lastKeyIndex]] = newValue;
}

// 提供依賴注入 rootState
provide('rootState', { rootState: state, updateState });

console.log('state:', state);
console.log('rules:', rules);
</script>

<template>
  <div class="flex flex-col">
    <h2>Schema Form</h2>
    <pre>
      {{ state }}
    </pre>
    <form v-if="schema && !isEmptyObject(schema)">
      <MySchemaFormItem :schema="schema" :state="state" :paths="paths" />
    </form>
  </div>
</template>

<style scoped></style>
