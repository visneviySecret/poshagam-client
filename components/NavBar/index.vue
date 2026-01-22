<template>
  <div class="navbar">
    <RouterLink to="/">
      <img src="/images/logo.svg" alt="logo" width="200" />
    </RouterLink>
    <CartStatus />
    <UserMenu />
  </div>
</template>

<script setup>
import CartStatus from "@/components/CartStatus/index.vue";
import UserMenu from "@/components/UserMenu/index.vue";
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  height: 140px;
  padding-block: 25px;
  align-items: center;
}
</style>
