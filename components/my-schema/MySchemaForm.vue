<script lang="ts" setup>
import { MyUnsaveConfirmModal } from '#components';
import { useMySchemaStore } from '~/stores/mySchemaStore';

const mySchemaStore = useMySchemaStore();
const $router = useRouter();
const modal = useModal();

// 取得父元件的元素(有捲軸的容器元素)
const formContainerElement = useParentElement();

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
  stateIsValid,
  updateState,
  addArrayState,
  removeArrayState,
  moveArrayState,
  clearArrayState,
  validateState
} = useValidator(props.rawSchema);

const testModeProxy = ref(mySchemaStore.state.testMode);

// 主元素
const targetElement = ref(null);
const { top } = useElementBounding(targetElement);

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
// 提供依賴注入 rootForm: 負責 state 以外的狀態和行為
provide('rootForm', {
  // UI行為
  scorllFormContainer
});

// 捲動到指定的位置
function scorllFormContainer(y: number, isAlignBottom: boolean = false) {
  const originalTop = formContainerElement.value?.scrollTop || 0;
  if (!isAlignBottom) {
    formContainerElement.value?.scroll({
      top: originalTop + (y - 81),
      behavior: 'smooth'
    });
  } else {
    formContainerElement.value?.scroll({
      top: originalTop + (y - formContainerElement.value?.clientHeight + 81),
      behavior: 'smooth'
    });
  }
}

// 表單提交
function onSubmit(event: Event) {
  // 阻止表單的預設提交行為
  event.preventDefault();
  const result = validateState();
  if (result === false) scrollToTop();
  else {
    // 這裡可以做表單提交的事情
    console.log('state', state);
  }
}

// 捲動到頂部
function scrollToTop() {
  formContainerElement.value?.scroll({
    top: 0,
    behavior: 'smooth'
  });
}

// 回上頁
function onCancel() {
  $router.back();
}

// 開啟確認視窗
function onOpenConfirmModal(next: Function) {
  modal.open(MyUnsaveConfirmModal, {
    onConfirm() {
      modal.close();
      next();
    },
    onCancel() {
      modal.close();
    }
  });
}

// 監控路由變化，如果表單有變更，則彈出確認視窗
onBeforeRouteLeave((to, from, next) => {
  if (stateValidator.$dirty) {
    onOpenConfirmModal(next);
  } else {
    next();
  }
});
</script>

<template>
  <div class="flex flex-col gap-y-4 max-w-screen-md" ref="targetElement">
    <div>
      <UFormGroup label="測試模式">
        <UToggle v-model="testModeProxy" />
      </UFormGroup>
    </div>
    <div v-show="testModeProxy" class="border p-4 rounded-2xl">
      <pre>state: {{ state }}</pre>
      <pre>stateValidator: {{ stateValidator }}</pre>
    </div>
    <UAlert
      v-if="!stateIsValid"
      icon="i-heroicons-exclamation-triangle-20-solid"
      color="rose"
      variant="soft"
      title="表單驗證失敗"
      description="請檢查表單內容是否正確"
    />
    <form v-if="schema && !isEmptyObject(schema)" @submit="onSubmit">
      <!-- 表單按鈕區域 -->
      <div
        class="p-4 sticky -top-0 justify-end md:fixed md:top-16 md:right-4 md:justify-start flex flex-row gap-x-2 bg-white dark:bg-gray-900 z-50"
      >
        <UButton type="button" variant="outline" @click="onCancel"
          >取消</UButton
        >
        <UButton type="submit">儲存</UButton>
      </div>
      <!-- 表單內容區域 -->
      <MySchemaFormItem :schema="schema" :state="state" :paths="paths" />
    </form>
    <!-- toTopButton -->
    <UButton
      class="fixed right-8 bottom-4 z-50"
      v-show="top < 80"
      color="primary"
      variant="soft"
      icon="i-heroicons-arrow-small-up-solid"
      :ui="{ rounded: 'rounded-full' }"
      @click="scrollToTop"
    ></UButton>
  </div>
</template>

<style scoped></style>
