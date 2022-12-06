import { Product } from "@/models";

export const EntregaService = {
  async getEntregas(signal?: AbortSignal) {
    try {
      const response = await fetch("/api/entregas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });
      const data = await response.json();
      if (response.ok) {
        return { data };
      } else {
        throw data;
      }
    } catch (error) {
      return { data: null, error };
    }
  },
  async getEntrega(id: number, signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/entregas/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });
      const data = await response.json();
      if (response.ok) {
        return { data };
      } else {
        throw data;
      }
    } catch (error) {
      return { data: null, error };
    }
  },
  async createEntrega(data: Partial<Product>, signal?: AbortSignal) {
    try {
      const response = await fetch("/api/entregas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal,
      });
      const dataResponse = await response.json();
      if (response.ok) {
        return { data: dataResponse };
      } else {
        throw dataResponse;
      }
    } catch (error) {
      return { data: null, error };
    }
  },
  async updateEntrega(
    id: number,
    data: Partial<Product>,
    signal?: AbortSignal
  ) {
    try {
      const response = await fetch(`/api/entregas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal,
      });
      const dataResponse = await response.json();
      if (response.ok) {
        return { data: dataResponse };
      } else {
        throw dataResponse;
      }
    } catch (error) {
      return { data: null, error };
    }
  },
  async deleteEntrega(id: number, signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/entregas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });
      const data = await response.json();
      if (response.ok) {
        return { data };
      } else {
        throw data;
      }
    } catch (error) {
      return { data: null, error };
    }
  },
  async bulkDeleteEntregas(ids: number[], signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/entregas/bulk`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
        signal,
      });
      const data = await response.json();
      if (response.ok) {
        return { data };
      } else {
        throw data;
      }
    } catch (error) {
      return { data: null, error };
    }
  },
};
