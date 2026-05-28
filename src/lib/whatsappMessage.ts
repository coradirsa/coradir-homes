const WHATSAPP_HOSTS = ["wa.me", "whatsapp.com"];

const normalizeSenderName = (name: string) => name.trim().replace(/\s+/g, " ");

const capitalizeFirstLetter = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const removeLeadingGreeting = (message: string) =>
  message.trim().replace(/^hola[!¡,.:;\-\s]*/i, "").trim();

export const isWhatsAppUrl = (href: string) => {
  if (!href.startsWith("http")) return false;

  try {
    const url = new URL(href);
    return WHATSAPP_HOSTS.some((host) => url.hostname.includes(host));
  } catch {
    return false;
  }
};

export const addSenderNameToWhatsAppMessage = (message: string, name: string) => {
  const senderName = normalizeSenderName(name);
  const cleanMessage = capitalizeFirstLetter(removeLeadingGreeting(message));

  if (!senderName) return message;
  if (!cleanMessage) return `Hola soy ${senderName}.`;

  return `Hola soy ${senderName}. ${cleanMessage}`;
};

export const addSenderNameToWhatsAppUrl = (href: string, name: string) => {
  if (!isWhatsAppUrl(href)) return href;

  try {
    const url = new URL(href);
    const message = url.searchParams.get("text") || "";
    url.searchParams.set("text", addSenderNameToWhatsAppMessage(message, name));
    return url.toString();
  } catch {
    return href;
  }
};

export const WHATSAPP_OPEN_REQUEST_EVENT = "whatsapp-open-request";

export type WhatsAppOpenRequest = {
  href: string;
  target?: string;
  features?: string;
};

export const requestWhatsAppOpen = (request: WhatsAppOpenRequest) => {
  if (typeof window === "undefined") return false;

  window.dispatchEvent(
    new CustomEvent<WhatsAppOpenRequest>(WHATSAPP_OPEN_REQUEST_EVENT, {
      detail: request,
    })
  );

  return true;
};

export const subscribeToWhatsAppOpenRequests = (
  handler: (request: WhatsAppOpenRequest) => void
) => {
  if (typeof window === "undefined") return () => undefined;

  const listener = (event: Event) => {
    handler((event as CustomEvent<WhatsAppOpenRequest>).detail);
  };

  window.addEventListener(WHATSAPP_OPEN_REQUEST_EVENT, listener);

  return () => window.removeEventListener(WHATSAPP_OPEN_REQUEST_EVENT, listener);
};
