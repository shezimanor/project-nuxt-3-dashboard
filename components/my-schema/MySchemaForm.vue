<script lang="ts" setup>
import { MyConfirmModal } from '#components';
import { useMySchemaStore } from '~/stores/mySchemaStore';

const mySchemaStore = useMySchemaStore();
const toast = useToast();
const $router = useRouter();
const modal = useModal();

// 取得父元件的元素(有捲軸的容器元素)
const formContainerElement = useParentElement();

// props
const props = defineProps({
  feature: {
    type: String,
    required: true,
    validator: (value: string) => {
      return ['create', 'update'].includes(value);
    }
  },
  prototypeId: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    default: ''
  },
  rawSchema: {
    type: Object,
    required: true
  },
  rawState: {
    type: Object,
    default: null
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
  validateState,
  onUndirtyState
} = useValidator(props.rawSchema, props.rawState);

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
  if (result === false) onScrollToTop();
  else {
    // 這裡可以做表單提交的事情
    // 取消dirty狀態(方便頁面直接跳轉不用再次確認)
    onUndirtyState();
    // 儲存產品表單
    if (props.feature === 'create') createProduct();
    else if (props.feature === 'update') updateProduct();
  }
}

// 捲動到頂部
function onScrollToTop() {
  formContainerElement.value?.scroll({
    top: 0,
    behavior: 'smooth'
  });
}

// 新增產品
async function createProduct() {
  console.log('createProduct Product');
  const reponse = await $fetch('/api/products', {
    method: 'post',
    body: {
      prototype_id: props.prototypeId,
      data: state
    }
  });
  if (reponse.result && reponse.link) {
    toast.add({
      id: `product_create_success`,
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'green',
      title: '新增產品成功！',
      timeout: 1000
    });
    // 到產品產示頁面
    $router.push(reponse.link);
  } else {
    toast.add({
      id: `product_create_fail`,
      icon: 'i-heroicons-x-circle-20-solid',
      color: 'red',
      title: '新增產品失敗！',
      timeout: 1000
    });
  }
}

// 更新產品
async function updateProduct() {
  console.log('updateProduct Product');
  const reponse = await $fetch(`/api/products/${props.productId}`, {
    method: 'put',
    body: {
      data: state
    }
  });
  if (reponse.result && reponse.link) {
    toast.add({
      id: `product_create_success`,
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'green',
      title: '更新產品成功！',
      timeout: 1000
    });
    // 到產品產示頁面
    $router.push(reponse.link);
  } else {
    toast.add({
      id: `product_create_fail`,
      icon: 'i-heroicons-x-circle-20-solid',
      color: 'red',
      title: '更新產品失敗！',
      timeout: 1000
    });
  }
}

// 回上頁
function onCancel() {
  $router.back();
}

// 開啟確認視窗
function onOpenConfirmModal(next: Function) {
  modal.open(MyConfirmModal, {
    modalContent: '表單有變更，確定要離開嗎？',
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
  <div
    class="flex flex-col gap-y-4"
    :class="{ 'max-w-screen-md': !testModeProxy }"
    ref="targetElement"
  >
    <div>
      <UFormGroup label="開發模式">
        <UToggle v-model="testModeProxy" />
      </UFormGroup>
    </div>
    <div
      class="grid grid-cols-1 gap-4"
      :class="{ 'sm:grid-cols-2': testModeProxy }"
    >
      <form v-if="schema && !isEmptyObject(schema)" @submit="onSubmit">
        <!-- 警示區 -->
        <UAlert
          v-if="!stateIsValid"
          icon="i-heroicons-exclamation-triangle-20-solid"
          color="rose"
          variant="soft"
          title="表單驗證失敗"
          description="請檢查表單內容是否正確"
          class="mb-4"
        />
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
      <div v-if="testModeProxy">
        <h3 class="text-primary font-bold text-xl mb-1">表單狀態</h3>
        <div class="p-4 border rounded-xl border-gray-200">
          <pre>state: {{ state }}</pre>
          <pre>stateValidator: {{ stateValidator }}</pre>
        </div>
      </div>
    </div>
    <!-- toTopButton -->
    <UButton
      class="fixed right-8 bottom-4 z-50"
      v-show="top < 80"
      color="primary"
      variant="soft"
      icon="i-heroicons-arrow-small-up-solid"
      :ui="{ rounded: 'rounded-full' }"
      @click="onScrollToTop"
    ></UButton>
  </div>
</template>

<style scoped></style>
