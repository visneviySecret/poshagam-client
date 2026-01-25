export default defineNuxtConfig({
  css: ["~/assets/styles/main.scss"],
  app: {
    head: {
      title: "По шагам",
      meta: [
        {
          name: "description",
          content: "Магазин инструкций для конструкторов",
        },
      ],
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
