import { createCart, clearCart as clearCartApi, updateCart } from "~/api/cart";
import { saveCartToLocalStorage } from "~/utils/cartLocalStorage";

const initialStore = [];

export default {
  namespaced: true,
  state() {
    return {
      products: initialStore,
      cartId: null,
      cartSyncTimer: null,
      emptyCartTimer: null,
      cartStatus: "loading",
    };
  },
  getters: {
    allCart(state) {
      return state.products;
    },
    cartStats(state) {
      let count = 0;
      let cost = 0;
      state.products.forEach((item) => {
        count += item.count;
        cost += item.product.price * item.count;
      });

      return {
        count,
        cost,
      };
    },
    cartStatus(state) {
      return state.cartStatus;
    },
    isCartEmpty(state) {
      return state.products.length === 0;
    },
  },
  actions: {
    addProductToCart({ commit, dispatch }, product) {
      commit("addProductToCart", product);
      dispatch("syncCartWithServer");
      dispatch("cancelCartClear");
    },
    removeProductFromCart({ commit, dispatch }, productId) {
      commit("removeProductFromCart", productId);
      dispatch("syncCartWithServer");
    },
    async syncCartWithServer({ state, commit, dispatch, rootGetters }) {
      if (state.cartSyncTimer) {
        clearTimeout(state.cartSyncTimer);
      }

      state.cartSyncTimer = setTimeout(async () => {
        try {
          const user = rootGetters.user;

          if (!user || !user.id) {
            saveCartToLocalStorage(state.products);
            return;
          }

          const items = state.products.map((item) => ({
            product_id: item.product.id,
            count: item.count,
            price: item.product.price,
          }));

          if (state.cartId) {
            await updateCart(state.cartId, { items });
          } else {
            const cart = await createCart({ items });
            commit("setCartId", cart.id);
          }

          if (state.products.length === 0 && state.cartId) {
            dispatch("scheduleCartClear");
          } else {
            dispatch("cancelCartClear");
          }
        } catch (error) {
          console.error("Ошибка синхронизации корзины:", error);
        }
      }, 1000);
    },
    scheduleCartClear({ state, commit }) {
      if (state.emptyCartTimer) {
        clearTimeout(state.emptyCartTimer);
      }

      state.emptyCartTimer = setTimeout(async () => {
        if (state.cartId && state.products.length === 0) {
          try {
            await clearCartApi();
            commit("setCartId", null);
          } catch (error) {
            console.error("Ошибка очистки корзины:", error);
          }
        }
      }, 10000);
    },
    cancelCartClear({ state }) {
      if (state.emptyCartTimer) {
        clearTimeout(state.emptyCartTimer);
        state.emptyCartTimer = null;
      }
    },
    removeProductById({ commit }, productId) {
      commit("removeProductById", productId);
    },
    clearCart({ commit }) {
      commit("clearCart");
    },
    incrementCounter({ commit }, productId) {
      commit("incrementCounter", productId);
    },
    decrementCounter({ commit }, productId) {
      commit("removeProductFromCart", productId);
    },
  },
  mutations: {
    addProductToCart(state, product) {
      const existingProduct = state.products.find(
        (item) => item.product.id === product.id
      );
      if (existingProduct) {
        existingProduct.count += 1;
      } else {
        state.products.push({ product, count: 1 });
      }
    },
    removeProductFromCart(state, productId) {
      const existingProduct = state.products.find(
        (item) => item.product.id === productId
      );
      if (existingProduct && existingProduct.count > 1) {
        existingProduct.count -= 1;
      } else {
        state.products = state.products.filter(
          (item) => item.product.id !== productId
        );
      }
    },
    updateCart(state, payload) {
      state.products = payload;
    },
    removeProductById(state, productId) {
      state.products = state.products.filter(
        (item) => item.product.id !== productId
      );
    },
    async clearCart(state) {
      state.products = [];
      await clearCartApi();
    },
    incrementCounter(state, productId) {
      state.products.forEach((item) => {
        if (item.product.id === productId) item.count += 1;
      });
    },
    decrementCounter(state, productId) {
      state.products.forEach((item) => {
        if (item.product.id === productId && item.count > 0) item.count -= 1;
      });
    },
    setCartId(state, cartId) {
      state.cartId = cartId;
    },
    setCartStatus(state, status) {
      state.cartStatus = status;
    },
  },
};
