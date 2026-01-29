import axios from "axios";
import { refreshToken } from "~/api/auth";

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object") {
      const normalizeUrl = (url: string | undefined | null): string => {
        if (!url || typeof url !== "string") return url || "";
        if (url.startsWith("http://poshagam.store:9000")) {
          return url.replace("http://", "//");
        }
        return url;
      };

      const normalizeProduct = (product: any) => {
        if (product.images && Array.isArray(product.images)) {
          product.images = product.images.map(normalizeUrl);
        }
        if (product.preview) {
          product.preview = normalizeUrl(product.preview);
        }
        return product;
      };

      if (Array.isArray(response.data)) {
        response.data = response.data.map((item) =>
          item.images || item.preview ? normalizeProduct(item) : item
        );
      } else if (response.data.images || response.data.preview) {
        response.data = normalizeProduct(response.data);
      }
    }
    return response;
  },
  async (error) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Произошла ошибка";
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest?._isRetry) {
        originalRequest._isRetry = true;
        try {
          await refreshToken();
          return apiClient.request(error.config);
        } catch (err) {
          // TODO это поведение по переадресации на авторизацию всегда вызывается,
          // даже когда рефреш успешно пришёл, пока уберём
          // return navigateTo("/authorize");
        }
      }
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
