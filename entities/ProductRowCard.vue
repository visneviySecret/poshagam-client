<template>
  <div
    class="product-row"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="product-row-image">
      <img :src="currentImage" :alt="product.name" class="product-thumbnail" />
    </div>
    <div class="product-row-content">
      <h3 class="product-row-title">{{ product.name }}</h3>
      <p class="product-row-description">{{ product.description }}</p>
      <div class="product-row-price">
        <span class="price-value">{{ formattedPrice }}</span>
        <span class="price-currency">₽</span>
      </div>
    </div>
    <div class="product-row-actions">
      <button
        type="button"
        class="action-button edit-button"
        @click="handleEdit"
        title="Редактировать"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74169 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4584 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.5 18.3333H17.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        class="action-button delete-button"
        @click="handleDelete"
        title="Удалить"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.3584 18.3333H7.64169C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.60831 13.75H11.3833"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.91669 10.4167H12.0834"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { loadToCache } from "~/utils/toCache";

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  (e: "edit", product: Product): void;
  (e: "delete", productId: number): void;
}>();

const isHovered = ref(false);
const cachedGifUrl = ref<string | null>(null);
const cachedImageUrl = ref<string | null>(null);

const formattedPrice = computed(() =>
  props.product.price.toLocaleString("ru-RU")
);

const currentImage = computed(() => {
  if (isHovered.value && cachedGifUrl.value) {
    return cachedGifUrl.value;
  }
  return cachedImageUrl.value || props.product.images[0];
});

const handleEdit = () => {
  emit("edit", props.product);
};

const handleDelete = () => {
  if (confirm("Вы уверены, что хотите удалить этот товар?")) {
    emit("delete", props.product.id);
  }
};

watch(
  () => props.product.preview,
  async (previewUrl) => {
    if (previewUrl) {
      cachedGifUrl.value = await loadToCache(previewUrl);
    }
  },
  { immediate: true }
);

watch(
  () => props.product.images[0],
  async (imageUrl) => {
    if (imageUrl) {
      cachedImageUrl.value = await loadToCache(imageUrl);
    }
  },
  { immediate: true }
);

watch(isHovered, async (hovered) => {
  if (hovered && props.product.preview && !cachedGifUrl.value) {
    cachedGifUrl.value = await loadToCache(props.product.preview);
  }
});
</script>

<style scoped lang="scss">
.product-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}

.product-row:hover {
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  border-color: #d1d5db;
}

.product-row-image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, #e5e7eb, #f9fafb);
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.product-row-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.product-row-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.product-row-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-row-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 4px;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.price-currency {
  font-size: 14px;
  color: #6b7280;
}

.product-row-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.action-button svg {
  width: 18px;
  height: 18px;
}

.edit-button:hover {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

.delete-button:hover {
  background: #fef2f2;
  border-color: #dc2626;
  color: #dc2626;
}

.action-button:active {
  transform: translateY(1px);
}
</style>
