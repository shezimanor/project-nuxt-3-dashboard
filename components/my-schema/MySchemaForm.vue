<script lang="ts" setup>
import { useMySchemaStore } from '~/stores/mySchemaStore';

const mySchemaStore = useMySchemaStore();

// props
const props = defineProps({
  rawSchema: {
    type: Object,
    required: true
  }
});

const {
  state,
  schema,
  stateValidator,
  stateIsInvalid,
  updateState,
  addArrayState,
  removeArrayState,
  moveArrayState,
  clearArrayState,
  validateState
} = useValidator(props.rawSchema);

const testModeProxy = ref(mySchemaStore.state.testMode);

// path 不需要響應式: 讓子元件可以接自己的路徑陣列，方便後續抓值
const paths: any[] = [];

watch(testModeProxy, (newValue) => {
  mySchemaStore.updateTestMode(newValue);
});

// 提供依賴注入 rootState
provide('rootState', {
  rootState: state,
  rootStateValidator: stateValidator,
  updateState,
  addArrayState,
  removeArrayState,
  moveArrayState,
  clearArrayState
});

function onSubmit(event: Event) {
  // 阻止表單的預設提交行為
  event.preventDefault();
  console.log('A:', stateValidator);
  validateState();
}
</script>

<template>
  <div class="flex flex-col gap-y-4 max-w-screen-md">
    <div>
      <UFormGroup label="測試模式">
        <UToggle v-model="testModeProxy" />
      </UFormGroup>
    </div>
    <div v-show="mySchemaStore.state.testMode" class="border p-4 rounded-2xl">
      <pre>state: {{ state }}</pre>
      <pre>stateValidator: {{ stateValidator }}</pre>
    </div>
    <UAlert
      v-if="stateIsInvalid"
      icon="i-heroicons-exclamation-triangle-20-solid"
      color="rose"
      variant="soft"
      title="表單驗證失敗"
      description="請檢查表單內容是否正確"
    />
    <form v-if="schema && !isEmptyObject(schema)" @submit="onSubmit">
      <div
        class="p-4 sticky -top-0 justify-end md:fixed md:top-16 md:right-4 md:justify-start flex flex-row gap-x-2 bg-white dark:bg-gray-900 z-50"
      >
        <UButton type="button" variant="outline">取消</UButton>
        <UButton type="submit">儲存</UButton>
      </div>
      <MySchemaFormItem :schema="schema" :state="state" :paths="paths" />
    </form>
  </div>
</template>

<style scoped></style>
