<script lang="ts" setup>
import { Scratch } from '~/utils/scratch';
// Scratch Prototype: 刮刮樂原型
const { onCTA } = usePreview();

const scratchContainerElementRef = ref(null);

// props
const props = defineProps({
  prototypeData: {
    type: Object,
    required: true
  }
});

const isShowHint = ref(true);
const isShowResult = ref(false);
const resultIndex = ref(-1);
let scratch: any = null;

onMounted(() => {
  scratch = new Scratch({
    containerRef: scratchContainerElementRef,
    containerId: 'myScratchContainer',
    data: props.prototypeData,
    // width: 342,
    // height: 598,
    width: 1024,
    height: 1792,
    on: {
      init(index: number) {
        resultIndex.value = index;
      },
      firstScratch() {
        isShowHint.value = false;
      },
      showResult() {
        isShowResult.value = true;
      }
    }
  });
});
onBeforeUnmount(() => {
  scratch.destroy();
});
</script>
<template>
  <!-- 尺寸寫在父層: 256+2 x 448+2 / 342+2 x 598+2 (圖片尺寸: 1024 x 1792) -->
  <div>
    <div
      id="myScratchContainer"
      class="scratch-container"
      ref="scratchContainerElementRef"
    ></div>
    <img
      v-if="isShowHint"
      src="~/assets/images/scratch.svg"
      alt="上下滑動以查看更多"
      width="32"
      height="32"
      class="scratch-hint absolute mx-auto right-0 left-0 top-32 pointer-events-none z-50"
    />
    <UCard
      v-if="resultIndex >= 0 && isShowResult"
      :ui="{
        base: 'border-none text-sm',
        ring: 'ring-0',
        body: { padding: 'px-3 py-3 sm:p-4' }
      }"
      class="scratch-card animate-fade-in"
    >
      <div class="flex flex-col justify-center items-center gap-y-2">
        <div class="font-bold text-white text-lg mb-1">
          {{ prototypeData.results[resultIndex].title }}
        </div>
        <UButton
          size="sm"
          :color="prototypeData.buttonColor"
          variant="solid"
          :label="prototypeData.buttonText"
          @click="onCTA(prototypeData.results[resultIndex].url, resultIndex)"
        />
      </div>
    </UCard>
  </div>
</template>
<style scoped>
@import '~/assets/css/prototype/scratch.css';
</style>
