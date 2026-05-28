<template>
  <div
    class="dropzone"
    :class="{ 'dropzone--active': isDragActive }"
    @dragover.prevent="isDragActive = true"
    @dragleave.prevent="isDragActive = false"
    @drop.prevent="handleDrop"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="dropzone__input"
      @change="handleFileChange"
      :multiple="multiple"
    />
    <slot v-if="!previews.length" name="placeholder" :error="errorMessage">
      <p v-if="errorMessage" class="dropzone__error">{{ errorMessage }}</p>
      <p v-else>{{ placeholderText }}</p>
    </slot>
    <slot
      v-else
      name="preview"
      :previews="previews"
      :removePreview="removePreview"
    />
  </div>
</template>

<script setup lang="ts">
interface FilePreview {
  dataUrl: string;
  name: string;
}

const props = withDefaults(
  defineProps<{
    previews: (string | FilePreview)[];
    placeholderText?: string;
    multiple?: boolean;
    accept: string;
  }>(),
  {
    placeholderText: "Перетащите изображения или нажмите для выбора",
    multiple: false,
  }
);

const emit = defineEmits<{
  (e: "update:previews", value: (string | FilePreview)[]): void;
  (e: "error", message: string): void;
}>();

const isDragActive = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const errorMessage = ref("");

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const formatMb = (bytes: number) =>
  `${Math.round((bytes / (1024 * 1024)) * 10) / 10}MB`;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const isFileAccepted = (file: File): boolean => {
  const acceptTypes = props.accept.split(",").map((type) => type.trim());
  return acceptTypes.some((acceptType) => {
    if (acceptType.startsWith(".")) {
      return file.name.toLowerCase().endsWith(acceptType.toLowerCase());
    }
    if (acceptType.endsWith("/*")) {
      const mainType = acceptType.split("/")[0];
      return file.type.startsWith(mainType + "/");
    }
    return file.type === acceptType;
  });
};

const addFiles = async (files: File[]) => {
  errorMessage.value = "";
  const tooLarge = files.find((f) => f.size > MAX_FILE_SIZE_BYTES);
  if (tooLarge) {
    const msg = `Файл слишком большой: ${tooLarge.name}. Максимум ${formatMb(
      MAX_FILE_SIZE_BYTES
    )}`;
    errorMessage.value = msg;
    emit("error", msg);
    if (fileInput.value) fileInput.value.value = "";
    return;
  }

  const acceptedFiles = files.filter((file) => isFileAccepted(file));
  if (!acceptedFiles.length) return;

  const filePreviews = await Promise.all(
    acceptedFiles.map(async (file) => ({
      dataUrl: await readFileAsDataUrl(file),
      name: file.name,
    }))
  );

  if (!props.multiple) {
    const last = filePreviews[filePreviews.length - 1];
    emit("update:previews", last ? [last] : []);
  } else {
    emit("update:previews", [...props.previews, ...filePreviews]);
  }
};

const handleDrop = async (e: DragEvent) => {
  isDragActive.value = false;
  if (!e.dataTransfer?.files?.length) return;
  const files = Array.from(e.dataTransfer.files);
  await addFiles(files);
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files?.length) return;
  const files = Array.from(target.files);
  await addFiles(files);
};

const removePreview = (index: number) => {
  const next = [...props.previews];
  next.splice(index, 1);
  emit("update:previews", next);
  if (!next.length && fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<style scoped lang="scss">
.dropzone {
  margin-top: 4px;
  padding: 18px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  color: #475569;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dropzone--active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
}
.dropzone__input {
  display: none;
}
.dropzone__error {
  color: #dc2626;
  font-weight: 500;
}
</style>
