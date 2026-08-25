export function mapAuthError(message = "") {
  const text = String(message).toLowerCase();
  if (text.includes("invalid login") || text.includes("invalid_credentials")) {
    return "E-mail ou senha inválidos.";
  }
  if (text.includes("email not confirmed")) {
    return "E-mail ainda não confirmado. Peça ao administrador para liberar o acesso.";
  }
  if (text.includes("too many")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }
  if (text.includes("network") || text.includes("failed to fetch")) {
    return "Falha de conexão. Verifique a internet e tente novamente.";
  }
  return message || "Não foi possível entrar. Tente novamente.";
}
