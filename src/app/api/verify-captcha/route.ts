import { NextRequest, NextResponse } from "next/server";

const RECAPTCHA_PROJECT_ID = process.env.RECAPTCHA_PROJECT_ID;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const RECAPTCHA_API_KEY = process.env.RECAPTCHA_API_KEY;
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE) || 0.5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, action = "form_submit" } = body;

    // Validar que el token existe
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.error("Token de reCAPTCHA faltante o inválido");
      return NextResponse.json(
        { ok: false, error: "Token de verificación faltante. Por favor recarga la página e intenta nuevamente." },
        { status: 400 }
      );
    }

    // Validar configuración
    if (!RECAPTCHA_PROJECT_ID || !RECAPTCHA_SITE_KEY || !RECAPTCHA_API_KEY) {
      console.error("CRÍTICO: Variables de reCAPTCHA Enterprise no configuradas");
      return NextResponse.json(
        { ok: false, error: "Captcha no configurado. Contacte al administrador." },
        { status: 500 }
      );
    }

    // Construir la URL del endpoint de reCAPTCHA Enterprise
    const apiUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${RECAPTCHA_API_KEY}`;

    // Preparar el payload
    const assessmentPayload = {
      event: {
        token: token,
        siteKey: RECAPTCHA_SITE_KEY,
        expectedAction: action,
      },
    };

    try {
      // Llamar a la API de reCAPTCHA Enterprise
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error HTTP de reCAPTCHA Enterprise: ${response.status}`, errorText);
        return NextResponse.json(
          { ok: false, error: "No pudimos verificar el captcha. Intenta nuevamente en unos segundos." },
          { status: 500 }
        );
      }

      const result = await response.json();

      // LOG COMPLETO de la respuesta para depuración
      console.log("Respuesta de reCAPTCHA Enterprise:", JSON.stringify({
        valid: result.tokenProperties?.valid,
        invalidReason: result.tokenProperties?.invalidReason,
        action: result.tokenProperties?.action,
        score: result.riskAnalysis?.score,
        reasons: result.riskAnalysis?.reasons,
      }, null, 2));

      // Verificar si el token es válido
      if (!result.tokenProperties?.valid) {
        console.error(`Token inválido: ${result.tokenProperties?.invalidReason}`);
        return NextResponse.json(
          { ok: false, error: "Token de verificación inválido. Por favor recarga la página e intenta nuevamente." },
          { status: 400 }
        );
      }

      // Verificar si se ejecutó la acción esperada
      if (result.tokenProperties?.action !== action) {
        console.error(`Acción no coincide. Esperada: ${action}, Recibida: ${result.tokenProperties?.action}`);
        return NextResponse.json(
          { ok: false, error: "Acción de verificación no válida." },
          { status: 400 }
        );
      }

      // Verificar el score de riesgo
      const score = result.riskAnalysis?.score ?? 0;
      if (score < MIN_SCORE) {
        console.warn(`Score reCAPTCHA bajo: ${score} (Mínimo requerido: ${MIN_SCORE})`);
        console.warn(`Razones:`, result.riskAnalysis?.reasons);
        return NextResponse.json(
          { ok: false, error: "No pudimos verificar que eres humano. Por favor intenta nuevamente." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: "Verificación exitosa",
        score: score
      });

    } catch (fetchError) {
      console.error("Error al llamar a reCAPTCHA Enterprise API:", fetchError);
      return NextResponse.json({
        ok: false,
        error: "Error procesando la solicitud."
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error en verify-captcha:", error);
    return NextResponse.json({
      ok: false,
      error: "Error procesando la solicitud."
    }, { status: 500 });
  }
}
