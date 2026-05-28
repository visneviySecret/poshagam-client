<template>
  <div class="page">
    <div v-if="loading" class="loading-message">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="product" class="product">
      <div class="media">
        <img :src="activeImage" :alt="product.name" class="image" />

        <div v-if="product.images?.length" class="thumbs">
          <button
            v-for="(img, idx) in product.images"
            :key="idx"
            type="button"
            class="thumb"
            :class="{ 'thumb--active': img === activeImage }"
            @click="activeImage = img"
          >
            <img :src="img" :alt="product.name" />
          </button>
        </div>
      </div>

      <div class="info">
        <h1 class="title">{{ product.name }}</h1>
        <div class="price">
          <span class="price__value">{{ formattedPrice }}</span>
          <span class="price__currency">₽</span>
        </div>

        <button
          type="button"
          class="button"
          :class="{ 'button--in-cart': isInCart }"
          @click="toggleCart"
        >
          {{ isInCart ? "В корзине" : "В корзину" }}
        </button>

        <div class="desc">
          <h3>Описание</h3>
          <p>{{ product.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { getPublicProduct } from "~/api/product";

const route = useRoute();
const store = useStore();

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const productId = computed(() => Number(route.params.id));

const activeImage = ref<string>("");

const formattedPrice = computed(() => {
  const p = product.value?.price ?? 0;
  return Number(p).toLocaleString("ru-RU");
});

const cartItem = computed(() => {
  return store.getters["cart/allCart"].find(
    (item: { product: Product; count: number }) =>
      item.product.id === productId.value
  );
});

const isInCart = computed(() => !!cartItem.value && cartItem.value.count > 0);

const toggleCart = () => {
  if (!product.value) return;
  if (!isInCart.value) {
    store.dispatch("cart/addProductToCart", product.value);
  } else {
    store.dispatch("cart/removeProductFromCart", productId.value);
  }
};

const load = async () => {
  try {
    loading.value = true;
    error.value = null;
    const data = await getPublicProduct(productId.value);
    product.value = data;
    activeImage.value = data.images?.[0] || data.preview || "";
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
};

watch(
  () => productId.value,
  () => {
    load();
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.product {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 28px;
}

.media {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 16px;
  background: #f3f4f6;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.thumbs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb--active {
  border-color: #2563eb;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.18);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price__value {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
}

.price__currency {
  font-size: 14px;
  color: #6b7280;
}

.button {
  width: fit-content;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.05s ease;
}

.button--in-cart {
  background: #16a34a;
}

.button:hover {
  opacity: 0.75;
}

.button:active {
  transform: translateY(1px);
}

.desc h3 {
  margin: 12px 0 6px;
  font-size: 16px;
  color: #111827;
}

.desc p {
  margin: 0;
  color: #475569;
  line-height: 1.55;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 60px 20px;
}

.error-message p {
  color: #dc2626;
}

@media (max-width: 900px) {
  .product {
    grid-template-columns: 1fr;
  }
}
</style>

