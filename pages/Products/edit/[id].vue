<template>
  <div class="page">
    <div class="page-header">
      <h1>Редактировать товар</h1>
      <button type="button" class="back-button" @click="goToProducts">
        Вернуться к товарам
      </button>
    </div>
    <div v-if="loading && !product" class="loading-message">
      <p>Загрузка...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <form v-else class="form" @submit.prevent="handleSubmit">
      <label class="field">
        <span>Название</span>
        <input v-model="name" type="text" required />
      </label>
      <label class="field">
        <span>Изображения</span>
        <DropZoneImage
          v-model:previews="imagePreviews"
          :previewText="'Перетащите изображение или кликните для выбора'"
          multiple
        />
      </label>
      <label class="field">
        <span>Цена</span>
        <input
          v-model.number="price"
          type="number"
          min="0"
          step="0.01"
          required
        />
      </label>
      <label class="field">
        <span>Предпросмотр</span>
        <DropZoneImage
          v-model:previews="gifPreview"
          :previewText="'Перетащите gif или кликните для выбора'"
        />
      </label>
      <label class="field">
        <span>Инструкция</span>
        <DropZoneFile
          v-model:previews="pdfPreview"
          :previewText="'Перетащите pdf или кликните для выбора'"
        />
      </label>
      <label class="field">
        <span>Описание</span>
        <textarea v-model="description" required></textarea>
      </label>
      <p v-if="submitError" class="error">{{ submitError }}</p>
      <button type="submit" class="button" :disabled="loading">
        {{ loading ? "Сохранение..." : "Сохранить" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import DropZoneImage from "~/entities/DropZoneImage.vue";
import DropZoneFile from "~/entities/DropZoneFile.vue";
import { getProductForEdit, updateProduct } from "~/api/product";
import dataURLtoBlob from "~/utils/dataURLtoBlob";

interface FilePreview {
  dataUrl: string;
  name: string;
}

const route = useRoute();
const productId = computed(() => Number(route.params.id));

const name = ref("");
const description = ref("");
const price = ref<number | null>(null);
const imagePreviews = ref<(string | FilePreview)[]>([]);
const gifPreview = ref<(string | FilePreview)[]>([]);
const pdfPreview = ref<(string | FilePreview)[]>([]);
const loading = ref(false);
const error = ref("");
const submitError = ref("");
const product = ref<Product | null>(null);

const getDataUrl = (item: string | FilePreview): string => {
  return typeof item === "string" ? item : item.dataUrl;
};

const goToProducts = () => {
  navigateTo("/products");
};

const loadProduct = async () => {
  try {
    loading.value = true;
    error.value = "";
    const productData = await getProductForEdit(productId.value);
    product.value = productData;
    name.value = productData.name;
    description.value = productData.description;
    price.value = productData.price;
    imagePreviews.value = productData.images || [];
    if (productData.preview) {
      gifPreview.value = [productData.preview];
    }
  } catch (e) {
    error.value = (e as Error).message ?? "Ошибка загрузки товара";
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (price.value === null) return;
  try {
    loading.value = true;
    submitError.value = "";
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("description", description.value);
    formData.append("price", price.value.toString());
    formData.append("category", "1");

    imagePreviews.value.forEach((image) => {
      if (typeof image === "string") {
        return;
      }
      const blob = dataURLtoBlob(getDataUrl(image));
      formData.append("images", blob);
    });

    if (gifPreview.value.length > 0) {
      const previewItem = gifPreview.value[0];
      if (typeof previewItem !== "string") {
        const gifBlob = dataURLtoBlob(getDataUrl(previewItem));
        formData.append("preview", gifBlob);
      }
    }

    if (pdfPreview.value.length > 0) {
      const pdfItem = pdfPreview.value[0];
      if (typeof pdfItem !== "string") {
        const pdfBlob = dataURLtoBlob(getDataUrl(pdfItem));
        formData.append("instruction", pdfBlob);
      }
    }

    await updateProduct(
      productId.value,
      formData as unknown as CreateProductPayload
    );
    navigateTo("/products");
  } catch (e) {
    submitError.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProduct();
});
</script>

<style scoped lang="scss">
.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
}

.back-button {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease,
    transform 0.05s ease;
}

.back-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.back-button:active {
  transform: translateY(1px);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field span {
  font-size: 14px;
  color: #6b7280;
}
input,
textarea {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}
textarea {
  min-height: 100px;
  resize: vertical;
}
.button {
  margin-top: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}
.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #dc2626;
  font-size: 13px;
}
.loading-message {
  text-align: center;
  padding: 60px 20px;
}
.loading-message p {
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
</style>
