<script lang="ts" setup>
// Swiper Prototype: 旋轉立方原型
// import Swiper JS
import Swiper from 'swiper';
import { EffectCube } from 'swiper/modules';
const { onCTA } = usePreview();

// props
const props = defineProps({
  prototypeData: {
    type: Object,
    required: true
  }
});

const isShowHint = ref(true);

const isVertical = computed(() =>
  props.prototypeData.direction === 'vertical' ? true : false
);

onMounted(() => {
  // init Swiper: https://swiperjs.com/swiper-api#parameters
  new Swiper('.my-swiper', {
    // configure Swiper to use modules
    modules: [EffectCube],
    // Optional parameters
    // direction: 'vertical' | 'horizontal',
    direction: props.prototypeData.direction,
    loop: props.prototypeData.loop,
    effect: 'cube',
    // 修正奇數張圖片的loop問題
    loopAdditionalSlides: props.prototypeData.slides.length % 2 === 0 ? 0 : 1,
    speed: 300,
    grabCursor: true,
    // Events
    on: {
      setTranslate(swiper: any) {
        const transformString = swiper.slidesEl.style.transform;
        const newTransformString = getTransformString(
          transformString,
          isVertical.value,
          swiper.slidesEl.clientWidth - 2,
          swiper.slidesEl.clientHeight - 2
        );
        swiper.slidesEl.style.transform = newTransformString;
      },
      sliderFirstMove() {
        isShowHint.value = false;
      }
    }
  });
});
</script>
<template>
  <!-- 尺寸寫在父層: 256+2 x 448+2 / 342+2 x 598+2 (圖片尺寸: 1024 x 1792) -->
  <div>
    <!-- Slider main container -->
    <div v-if="prototypeData.slides" class="swiper my-swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div
          v-for="(slide, index) in prototypeData.slides"
          :key="`slide_${index}`"
          class="swiper-slide relative bg-transparent"
        >
          <img
            :src="`/images/prototype/${slide.image}`"
            :alt="slide.title"
            class="w-[256px] h-[448px] absolute top-0 left-0 sm:w-[342px] sm:h-[598px]"
          />
          {{ slide.title }}
          <UCard
            :ui="{
              base: 'border-none text-sm',
              ring: 'ring-0',
              body: { padding: 'px-3 py-2 sm:p-3' }
            }"
            class="swiper-slide-card animate-fade-in"
          >
            <div class="font-bold text-white text-lg mb-1">
              {{ slide.title }}
            </div>
            <template v-if="slide.description.length > 0">
              <hr />
              <div class="text-stone-200 text-xs mt-1">
                {{ slide.description }}
              </div>
              <div class="mt-4 flex flex-row justify-end">
                <UButton
                  icon="i-heroicons-arrow-long-right-16-solid"
                  size="xs"
                  :color="prototypeData.buttonColor"
                  variant="solid"
                  :label="prototypeData.buttonText"
                  trailing
                  @click="onCTA(slide.url, index)"
                />
              </div>
            </template>
            <template v-else>
              <hr />
              <div class="mt-3 flex flex-row justify-end">
                <UButton
                  icon="i-heroicons-arrow-long-right-16-solid"
                  size="sm"
                  :color="prototypeData.buttonColor"
                  variant="solid"
                  :label="prototypeData.buttonText"
                  trailing
                  @click="onCTA(slide.url, index)"
                />
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
    <img
      v-if="isVertical && isShowHint"
      src="~/assets/images/swipe-vertical.svg"
      alt="上下滑動以查看更多"
      width="32"
      height="32"
      class="animate-spin-simple-y absolute mx-auto right-0 left-0 bottom-4 pointer-events-none z-50"
    />
    <img
      v-else-if="!isVertical && isShowHint"
      src="~/assets/images/swipe-horizontal.svg"
      alt="左右滑動以查看更多"
      width="32"
      height="32"
      class="animate-spin-simple-x absolute mx-auto right-0 left-0 bottom-4 pointer-events-none z-50"
    />
  </div>
</template>
<style scoped>
@import 'swiper/css';
@import 'swiper/css/effect-cube';
@import '~/assets/css/prototype/swiper.css';
</style>
