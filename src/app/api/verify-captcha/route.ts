import { NextRequest, NextResponse } from "next/server";

const RECAPTCHA_SECRET =
  process.env.RECAPTCHA_SECRET_KEY || process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

const MIN_SCORE =
  Number(process.env.NEXT_PUBLIC_RECAPTCHA_MIN_SCORE || process.env.RECAPTCHA_MIN_SCORE) || 0.5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

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

    if (!recaptchaJson.success) {
      console.error("reCAPTCHA rechazo:", recaptchaJson["error-codes"] || recaptchaJson);
      return NextResponse.json(
        { ok: false, error: "No pudimos verificar que eres humano, por favor recarga la pagina o intenta nuevamente." },
        { status: 400 }
      );
    }

    if (typeof recaptchaJson.score === "number" && recaptchaJson.score < MIN_SCORE) {
      console.warn("Score reCAPTCHA bajo:", recaptchaJson.score);
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
