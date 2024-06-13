// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  extends: ['@nuxt/ui-pro'],
  modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxt/ui'],
  plugins: ['~/plugins/hook'],
  colorMode: {
    preference: 'dark'
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ]
});
