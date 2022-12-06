export async function getCEP(value: string, signal?: AbortSignal) {
  const cleanCEP = value.replace(/\D/g, "");

  try {
    const response = await fetch(`https://opencep.com/v1/${cleanCEP}`, {
      signal,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}
