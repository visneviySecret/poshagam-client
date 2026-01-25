export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_API_URL || "https://poshagam.store/api",
    },
  },
  css: ["~/assets/styles/main.scss"],
  app: {
    head: {
      title: "По шагам",
      meta: [{ name: "description", content: "Управляй своей корзиной" }],
      script: [
        {
          src: "https://auth.robokassa.ru/Merchant/bundle/robokassa_iframe.js",
          async: true,
          defer: true,
        },
      ],
    },
  },
  modules: [],
});
