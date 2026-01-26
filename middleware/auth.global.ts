import { useStore } from "vuex";

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/authorize") {
    const store = useStore();
    if (store.getters.isAuthenticated) {
      return navigateTo("/");
    }
    return;
  }
});
