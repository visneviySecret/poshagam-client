<template>
  <div class="wrapper">
    <img :src="imageSrc" :alt="productTitle" />
    <div class="content">
      <h3 class="content__title">
        {{ product.product_name || product.name }}
      </h3>
    </div>
    <span class="cost"
      >{{
        getFormatNumber(product.price * itemCount)
      }}
      ₽</span
    >
    <div
      class="cross-wrapper"
      @click="removeProductFromCart(productId)"
    >
      <CrossIcon />
    </div>
  </div>
</template>

<script>
import CrossIcon from "@/UI/CrossIcon/index";
import { mapActions } from "vuex";
import { getFormatNumber } from "@/utils/getFormatNumber";

export default {
  props: {
    product: { type: Object, required: true },
    count: { type: Number, default: 1 },
  },
  computed: {
    itemCount() {
      return this.count || this.product.count || this.product.quantity || 1;
    },
    productId() {
      return this.product.product_id ?? this.product.id;
    },
    productTitle() {
      return this.product.product_name || this.product.name || "";
    },
    imageSrc() {
      if (Array.isArray(this.product.images) && this.product.images[0]) {
        return this.product.images[0];
      }
      if (this.product.preview) {
        return this.product.preview;
      }
      return "";
    },
  },
  methods: {
    ...mapActions([
      "removeProductFromCart",
      "incrementCounter",
      "decrementCounter",
    ]),
    getFormatNumber,
    handleIncrement() {
      this.incrementCounter(this.productId);
    },
    handleDecrement() {
      this.decrementCounter(this.productId);
    },
  },
  components: {
    CrossIcon,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 15px;
  max-height: 121px;
  margin-top: 25px;
}
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.content__specs {
  max-width: 282px;
  font-size: 12px;
  line-height: 150%;
  color: #2c3242;
  margin-block: 6px;
}
.content__article {
  font-size: 14px;
  line-height: 150%;
  color: #797b86;
}
.cost {
  width: 120px;
  font-family: "Roboto";
  font-weight: 500;
  font-size: 18px;
  line-height: 145%;
  text-align: left;
  color: #1f2432;
}
.cross-wrapper {
  position: absolute;
  top: 27px;
  right: 6px;
}
</style>
