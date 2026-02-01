const imageCache = new Map<string, string>();

export const loadToCache = async (url: string): Promise<string> => {
  if (!url) return url;

  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    imageCache.set(url, blobUrl);
    return blobUrl;
  } catch (error) {
    console.error("Ошибка загрузки изображения:", error);
    return url;
  }
};
