<script setup>
// Swiper Prototype
// import Swiper JS
import Swiper from 'swiper';
import { EffectCube, Navigation } from 'swiper/modules';
// props
const props = defineProps({
  productState: {
    type: Object,
    required: true
  }
});

onMounted(() => {
  // init Swiper: https://swiperjs.com/swiper-api#parameters
  const swiper = new Swiper('.my-swiper', {
    // configure Swiper to use modules
    modules: [EffectCube, Navigation],
    // Optional parameters
    // direction: 'vertical',
    direction: 'horizontal',
    effect: 'cube',
    loop: true,
    grabCursor: true,
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    on: {
      setTranslate(swiper) {
        const transformString = swiper.slidesEl.style.transform;
        const newTransformString = getTransformString(transformString, false);
        swiper.slidesEl.style.transform = newTransformString;
      }
    }
  });
});
</script>
<template>
  <!-- 320 x 512 -->
  <div class="border rounded-xl w-80 h-128 overflow-hidden">
    <!-- Slider main container -->
    <div class="swiper my-swiper">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class="swiper-slide">Slide 4</div>
        <div class="swiper-slide">Slide 5</div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>
<style scoped>
@import 'swiper/css';
@import 'swiper/css/navigation';
@import 'swiper/css/effect-cube';
@import '~/assets/css/prototype/swiper.css';
</style>
