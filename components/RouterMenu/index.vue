<template>
  <div>
    <nuxt-link to="/" class="home">Главная</nuxt-link>
    <div v-if="routeName === '/cart'">
      <img src="~/assets/icons/navArrow.svg" />
      <nuxt-link to="/cart">Корзина</nuxt-link>
    </div>
    <div v-if="routeName === '/settings'">
      <img src="~/assets/icons/navArrow.svg" />
      <nuxt-link to="/settings">Настройки</nuxt-link>
    </div>
    <div v-if="routeName === '/products'">
      <img src="~/assets/icons/navArrow.svg" />
      <nuxt-link to="/products">Мои товары</nuxt-link>
    </div>
    <template v-if="routeName === '/products/create'">
      <div>
        <img src="~/assets/icons/navArrow.svg" />
        <nuxt-link to="/products">Мои товары</nuxt-link>
      </div>
      <div>
        <img src="~/assets/icons/navArrow.svg" />
        <nuxt-link to="/products/create">Новый товар</nuxt-link>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    routeName() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  display: flex;
  gap: 10px;
}
a {
  color: #797b86;
  text-decoration: none;
  &:hover {
    opacity: 0.7;
  }
}
.router-link-exact-active {
  color: #537694;
}

.home {
  color: #33374e;
}
</style>
