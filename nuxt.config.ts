// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  target: 'static',
  generate:{
    fallback: true
  },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', 'pinia-plugin-persistedstate/nuxt',],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  nitro: {
    experimental:{
      websocket: true
    }
  },
  runtimeConfig: {
    // серверная часть
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    
    public: {
      // клиентская часть
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
})