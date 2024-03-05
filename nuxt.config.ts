// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/ui'],
  colorMode: {
    preference: 'dark'
  }
});
