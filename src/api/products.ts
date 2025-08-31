import axiosClient from "./axiosClient";
import type{ Product } from "../types/product";

export const productAPI = {
  getAll: async (): Promise<Product[]> => {
    const res = await axiosClient.get("/products");
    return res.data.products ?? [];
  },
  getById: async (id: string): Promise<Product> => {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data.product;
  },
  create: async (data: FormData): Promise<Product> => {
    const res = await axiosClient.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.product;
  },
  update: async (id: string, data: FormData): Promise<Product> => {
    const res = await axiosClient.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.product;
  },
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/products/${id}`);
  },
};
