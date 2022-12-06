import { ErrorObject } from "@vuelidate/core";

// Função que recebe um objeto de erros do vuelidate
// e retorna um objeto com os erros traduzidos
function getValidationMessages(error: string, message?: string) {
  // Como não recebemos o número exigido para validar,
  // vamos pegar os números que aparecem na string do erro em inglês
  let number = "";
  if (message) {
    number = message.replace(/\D/g, "");
  }

  switch (error) {
    case "required":
      return "Campo obrigatório!";
    case "email":
      return "Por favor, informe um e-mail válido!";
    case "minLength":
      return `Este campo deve ter no mínimo ${number} caracteres!`;
    case "maxLength":
      return `Este campo deve ter no máximo ${number} caracteres!`;
    default:
      return "Campo inválido!";
  }
}

// Função para facilitar a utilização do Vuelidate
export function getValidationErrors(err: ErrorObject[]) {
  const errorsArray: any[] = [];
  err.forEach((error: any) => {
    errorsArray[error.$property] = getValidationMessages(error.$validator);
  });
  return errorsArray;
}
