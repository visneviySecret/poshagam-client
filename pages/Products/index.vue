<template>
  <div class="page">
    <div class="page-header">
      <h1>Мои товары</h1>
      <button type="button" class="add-button" @click="goToCreateProduct">
        Добавить товар
      </button>
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-if="loading" class="loading-message">
      <p>Загрузка...</p>
    </div>
    <div v-else>
      <div v-if="products.length === 0" class="empty-products">
        <p>У вас пока нет товаров</p>
      </div>
      <div v-else>
        <div class="products-list">
          <ProductRowCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOwnerProducts, deleteProduct } from "~/api/product";
import ProductRowCard from "~/entities/ProductRowCard.vue";

const products = ref<Product[]>([]);
const error = ref<string | undefined>(undefined);
const loading = ref<boolean>(true);

const goToCreateProduct = () => {
  navigateTo("/products/create");
};

const handleEdit = (product: Product) => {
  navigateTo(`/products/edit/${product.id}`);
};

const handleDelete = async (productId: number) => {
  try {
    await deleteProduct(productId);
    products.value = products.value.filter((p) => p.id !== productId);
  } catch (err) {
    error.value = (err as Error).message ?? "Ошибка удаления товара";
  }
};

onMounted(async () => {
  try {
    products.value = await getOwnerProducts();
  } catch (err) {
    error.value = (err as Error).message ?? "Ошибка получения товаров";
  } finally {
    loading.value = false;
  }
});

watch(error, (newValue) => {
  if (newValue) {
    setTimeout(() => (error.value = undefined), 5000);
  }
});
</script>

<style scoped lang="scss">
.page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #111827;
}

.add-button {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;
}

.add-button:hover {
  background: #1d4ed8;
}

.add-button:active {
  transform: translateY(1px);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-products {
  text-align: center;
  padding: 60px 20px;
}

.empty-products p {
  font-size: 18px;
  color: #6b7280;
}

.error-message {
  padding: 20px;
  background: #fef2f2;
  border-radius: 10px;
  border: 1px solid #fecaca;
}

.error-message p {
  margin: 0;
  color: #dc2626;
  font-size: 14px;
}

.loading-message {
  text-align: center;
  padding: 60px 20px;
}

.loading-message p {
  font-size: 18px;
  color: #6b7280;
}
</style>
