import { Client } from "@/models";

export const ClienteService = {
  async getClientes() {
    const abortController = new AbortController();
    try {
      const response = await fetch("/api/clientes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
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
  async getCliente(id: number) {
    const abortController = new AbortController();
    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
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
  async searchClient(query: string) {
    const abortController = new AbortController();
    try {
      const response = await fetch(`/api/clientes/search/${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
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
  async createCliente(data: Partial<Client>) {
    const abortController = new AbortController();
    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: abortController.signal,
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
  async updateCliente(id: number, data: Partial<Client>) {
    const abortController = new AbortController();
    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: abortController.signal,
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
  async deleteCliente(id: number) {
    const abortController = new AbortController();
    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
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
  async bulkDeleteClientes(ids: number[]) {
    const abortController = new AbortController();
    try {
      const response = await fetch(`/api/clientes/bulk`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
        signal: abortController.signal,
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
