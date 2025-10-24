/**
 * Google Analytics 4 Event Tracking
 * Documentación: https://developers.google.com/analytics/devguides/collection/ga4/events
 */

// Extender el objeto window para incluir gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Envía un evento a Google Analytics 4
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 GA4 Event:', eventName, eventParams);
    }
  }
};

/**
 * Eventos predefinidos para conversiones
 */
export const GAEvents = {
  // Formularios
  formSubmit: (formName: string, formLocation: string) => {
    trackEvent('form_submit', {
      form_name: formName,
      form_location: formLocation,
    });
  },

  // CTAs y botones
  ctaClick: (ctaName: string, ctaLocation: string, ctaType?: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      cta_type: ctaType || 'button',
    });
  },

  // WhatsApp
  whatsappClick: (location: string, message?: string) => {
    trackEvent('whatsapp_click', {
      location,
      message: message || 'default',
    });
  },

  // Proyectos
  projectClick: (projectName: string, location: string) => {
    trackEvent('project_click', {
      project_name: projectName,
      location,
    });
  },

  // Scroll depth
  scrollDepth: (percentage: number, pagePath: string) => {
    trackEvent('scroll_depth', {
      percentage,
      page_path: pagePath,
    });
  },

  // Teléfono
  phoneClick: (location: string) => {
    trackEvent('phone_click', {
      location,
    });
  },

  // Email
  emailClick: (location: string) => {
    trackEvent('email_click', {
      location,
    });
  },

  // Navegación
  navigationClick: (linkText: string, destination: string) => {
    trackEvent('navigation_click', {
      link_text: linkText,
      destination,
    });
  },
};
