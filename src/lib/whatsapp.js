export const WHATSAPP_NUMBER = "5563992282251";
export const WHATSAPP_MSG =
  "Olá! Vim pelo site da RA Energética e gostaria de mais informações sobre locação de geradores.";
export const WHATSAPP_QUOTE_MSG = "em breve retornaremos contato";

export const waLink = (msg = WHATSAPP_MSG) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export const waQuoteLink = () => waLink(WHATSAPP_QUOTE_MSG);

export const waLinkTo = (phone, msg) =>
  `https://wa.me/${String(phone).replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
