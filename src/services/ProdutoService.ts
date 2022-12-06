import { Product } from "@/models";

export const ProdutoService = {
  async getProdutos(signal?: AbortSignal) {
    try {
      const response = await fetch("/api/produtos", {
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
  async getProduto(id: number, signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
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
  async searchProduct(term: string, signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/produtos/search/${term}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw data;
      }
    } catch (error) {
      return { data: null, error };
    }
  },
  async createProduto(data: Partial<Product>, signal?: AbortSignal) {
    try {
      const response = await fetch("/api/produtos", {
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
  async updateProduto(
    id: number,
    data: Partial<Product>,
    signal?: AbortSignal
  ) {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
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
  async deleteProduto(id: number, signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
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
  async bulkDeleteProdutos(ids: number[], signal?: AbortSignal) {
    try {
      const response = await fetch(`/api/produtos/bulk`, {
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
