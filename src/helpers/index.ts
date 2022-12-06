// Função para realizar a consulta de CEP na API do OpenCEP
export async function buscaCep(cep: string) {
  const controller = new AbortController();
  try {
    const response = await fetch(`https://opencep.com/v1/${cep}`, {
      signal: controller.signal,
    });
    if (response?.ok) {
      const data = await response.json();
      return data;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }

  return () => {
    controller.abort();
  };
}

export function toCurrency(value: string | number) {
  return Number(value).toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
  });
}

// Função para gerar um número inteiro aleatório entre dois números
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
