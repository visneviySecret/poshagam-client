<template>
  <div>
    <Button :onClick="goToPayment" :disabled="isCartEmpty"
      >Оформить заказ</Button
    >
  </div>
</template>

<script>
import Button from "@/UI/Button/index";
import { mapGetters } from "vuex";
export default {
  components: {
    Button,
  },
  computed: {
    ...mapGetters("cart", ["allCart", "isCartEmpty"]),
  },
  methods: {
    goToPayment() {
      this.$router.push("/payment");
    },
  },
};
</script>

<style lang="scss" scoped>
div:first-child {
  margin-bottom: 12px;
}
</style>
