<script setup lang="ts">
// default-passive-events: 解決 Chrome51 以上版本的報錯
import 'default-passive-events';

const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === 'dark' ? '#111827' : 'white'
);

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'zh-TW'
  }
});

const title = '結構化表單系統 with Nuxt 3';
const description =
  '這是一個使用 Nuxt3 和 Nuxt UI 架設的模擬結構化表單系統平台的專案';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
});
</script>

<template>
  <Html>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </Html>
</template>
