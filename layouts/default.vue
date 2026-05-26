<template>
  <div class="layout">
    <div class="container">
      <header>
        <NavBar />
        <RouterMenu />
      </header>
      <main>
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { getUserMe } from "~/api/user";
import { getMyCart } from "~/api/cart";
import { useStore } from "vuex";
import { loadCartFromLocalStorage as readStoredCart } from "~/utils/cartLocalStorage";
import { mapCartItemFromApi } from "~/utils/mapCartItemFromApi";

const store = useStore();

const loadCartFromServer = async () => {
  try {
    const serverCart = await getMyCart();
    if (serverCart?.items?.length) {
      store.commit(
        "cart/updateCart",
        serverCart.items.map(mapCartItemFromApi)
      );
    }
    if (serverCart) {
      store.commit("cart/setCartId", serverCart.id);
    }
  } catch (error) {
    console.error("Ошибка загрузки корзины:", error);
  } finally {
    store.commit("cart/setCartStatus", "loaded");
  }
};

const hydrateCartFromStorage = async () => {
  const savedCart = readStoredCart();
  if (savedCart && savedCart.length > 0) {
    store.commit("cart/updateCart", savedCart);
  }
  store.commit("cart/setCartStatus", "loaded");
};

onMounted(async () => {
  try {
    const userData = await getUserMe();
    store.dispatch("setUser", userData);
    await loadCartFromServer();
  } catch {
    await hydrateCartFromStorage();
  }
});
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: min(95%, 1280px);
  margin-inline: auto;
  margin-bottom: 115px;
  color: #1f2432;
}

header {
  margin-bottom: 50px;
}
</style>
