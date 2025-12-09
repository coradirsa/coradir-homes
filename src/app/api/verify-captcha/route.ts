import { NextRequest, NextResponse } from "next/server";

const RECAPTCHA_SECRET =
  process.env.RECAPTCHA_SECRET_KEY || process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

const MIN_SCORE =
  Number(process.env.NEXT_PUBLIC_RECAPTCHA_MIN_SCORE || process.env.RECAPTCHA_MIN_SCORE) || 0.5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    // Validar que el token existe
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.error("Token de reCAPTCHA faltante o inválido");
      return NextResponse.json(
        { ok: false, error: "Token de verificación faltante. Por favor recarga la página e intenta nuevamente." },
        { status: 400 }
      );
    }


    // Debug: Verificar SÓLO EN DESARROLLO o LOGS SEGUROS si la clave está cargada (mostrar solo últimos 4 caracteres)
    if (RECAPTCHA_SECRET) {
      console.log(`Verificando reCAPTCHA con secret terminada en ...${RECAPTCHA_SECRET.slice(-4)}`);
    } else {
      console.error("CRÍTICO: RECAPTCHA_SECRET es undefined o vacío.");
    }

    if (!RECAPTCHA_SECRET) {
      console.error("reCAPTCHA no configurado: falta RECAPTCHA_SECRET_KEY");
      return NextResponse.json(
        { ok: false, error: "Captcha no configurado. Falta RECAPTCHA_SECRET_KEY en el entorno." },
        { status: 500 }
      );
    }

    // 1. Validar el token de reCAPTCHA con Google
    const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
    });

    if (!recaptchaRes.ok) {
      console.error("Error HTTP al verificar reCAPTCHA", recaptchaRes.status);
      return NextResponse.json(
        { ok: false, error: "No pudimos verificar el captcha. Intenta nuevamente en unos segundos." },
        { status: 400 }
      );
    }

    const recaptchaJson = await recaptchaRes.json();

    // LOG COMPLETO de la respuesta de Google para depuración
    console.log("Respuesta de Google reCAPTCHA:", JSON.stringify(recaptchaJson, null, 2));

    if (!recaptchaJson.success) {
      const errorCodes = recaptchaJson["error-codes"] || [];
      console.error("reCAPTCHA FALLÓ. Códigos de error:", errorCodes);

      let errorMessage = "No pudimos verificar que eres humano, por favor recarga la página e intenta nuevamente.";
      
      // Errores de configuración del servidor (no deberían mostrarse al usuario final en prod, pero ayudan a depurar ahora)
      if (errorCodes.includes("missing-input-secret") || errorCodes.includes("invalid-input-secret")) {
        console.error("ERROR DE CONFIGURACIÓN: La clave secreta de reCAPTCHA es inválida o no se envió correctamente.");
        errorMessage = "Error de configuración del sistema (Captcha). Contacte al administrador.";
      } else if (errorCodes.includes("timeout-or-duplicate")) {
        errorMessage = "El token de verificación expiró. Por favor recarga la página e intenta nuevamente.";
      } else if (errorCodes.includes("invalid-input-response")) {
        errorMessage = "Token de verificación inválido. Por favor recarga la página e intenta nuevamente.";
      } else if (errorCodes.includes("bad-request")) {
         errorMessage = "Solicitud inválida al servidor de verificación.";
      }

      return NextResponse.json(
        { ok: false, error: errorMessage, debugCodes: errorCodes }, // debugCodes útil durante desarrollo
        { status: 400 }
      );
    }

    if (typeof recaptchaJson.score === "number" && recaptchaJson.score < MIN_SCORE) {
      console.warn(`Score reCAPTCHA bajo: ${recaptchaJson.score} (Mínimo requerido: ${MIN_SCORE})`);
      return NextResponse.json(
        { ok: false, error: "No pudimos verificar que eres humano, por favor recarga la pagina o intenta nuevamente." },
        { status: 400 }
      );
    }

    // 2. Procesa el formulario (enviar mail, guardar en DB, etc.)
    // Aqui puedes hacer lo que necesites con formData

    return NextResponse.json({ ok: true, message: "Formulario recibido", score: recaptchaJson.score ?? null });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Error procesando la solicitud." }, { status: 500 });
  }
}
