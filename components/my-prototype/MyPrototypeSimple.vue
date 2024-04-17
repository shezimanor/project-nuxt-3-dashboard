<script lang="ts" setup>
// Simple Prototype: 靜態圖片原型
const { onCTA } = usePreview();

// props
defineProps({
  prototypeData: {
    type: Object,
    required: true
  }
});
</script>
<template>
  <!-- 尺寸寫在父層: 256+2 x 448+2 / 342+2 x 598+2 (圖片尺寸: 1024 x 1792) -->
  <div>
    <img
      :src="`/images/prototype/${prototypeData.image}`"
      :alt="prototypeData.title"
      class="w-full absolute top-0 left-0"
    />
    <UCard
      :ui="{
        base: 'border-none text-sm',
        rounded: 'rounded-none',
        ring: 'ring-0',
        body: { padding: 'px-3 py-2 sm:p-3' }
      }"
      class="simple-card"
      :class="{
        'is-top': prototypeData.position === 'top',
        'is-bottom': prototypeData.position === 'bottom'
      }"
    >
      <div class="font-bold text-lg text-white mb-1">
        {{ prototypeData.title }}
      </div>
      <template v-if="prototypeData.description.length > 0">
        <hr />
        <div class="text-stone-200 text-xs mt-1">
          {{ prototypeData.description }}
        </div>
        <div class="mt-4 flex flex-row justify-end">
          <UButton
            icon="i-heroicons-arrow-long-right-16-solid"
            size="xs"
            :color="prototypeData.buttonColor"
            variant="solid"
            :label="prototypeData.buttonText"
            trailing
            @click="onCTA(prototypeData.url, 0)"
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
            @click="onCTA(prototypeData.url, 0)"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
<style scoped>
@import '~/assets/css/prototype/simple.css';
</style>
