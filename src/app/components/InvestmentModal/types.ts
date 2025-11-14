/**
 * Investment Modal Types
 * Tipos para el modal de inversiones inmobiliarias
 */

export interface InvestmentFormData {
  nombre: string;
  email: string;
  telefono: string;
  monto?: string;
  acepta_politica: boolean;
}

export interface InvestmentModalConfig {
  /** Mostrar una sola vez por sesión */
  showOncePerSession?: boolean;
  /** Delay en milisegundos antes de mostrar el modal */
  delayMs?: number;
  /** Número de WhatsApp para contacto (con código de país) */
  whatsappNumber?: string;
  /** Habilitar tracking de eventos GTM */
  trackEvents?: boolean;
}

export interface InvestmentModalProps extends InvestmentModalConfig {
  /** Control manual de visibilidad (opcional) */
  isOpen?: boolean;
  /** Callback al cerrar (opcional) */
  onClose?: () => void;
}

export interface UseInvestmentModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  shouldShow: boolean;
}
