<script lang="ts" setup>
import { useMySchemaStore } from '~/stores/mySchemaStore';

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

const state = reactive(traverseSchemaToState(props.schema));

const {
  stateValidator,
  updateState,
  addArrayState,
  removeArrayState,
  moveArrayState,
  clearArrayState
} = useValidator(state, props.rawSchema, props.schema);

const testModeProxy = ref(mySchemaStore.state.testMode);
// path 不需要響應式: 讓子元件可以接自己的路徑陣列，方便後續抓值
const paths: any[] = [];

watch(testModeProxy, (newValue) => {
  mySchemaStore.updateTestMode(newValue);
});

// 提供依賴注入 rootState
provide('rootState', {
  rootState: state,
  rootValidator: stateValidator,
  updateState,
  addArrayState,
  removeArrayState,
  moveArrayState,
  clearArrayState
});
</script>

<template>
  <div class="flex flex-col max-w-screen-md">
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
      <pre>state: {{ state }}</pre>
      <pre>stateValidator: {{ stateValidator }}</pre>
    </div>
    <form v-if="schema && !isEmptyObject(schema)">
      <MySchemaFormItem :schema="schema" :state="state" :paths="paths" />
    </form>
  </div>
</template>

<style scoped></style>
