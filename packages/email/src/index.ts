import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_NAME = "KSC System";
const FROM_EMAIL = process.env.SMTP_USER ?? "noreply@kscsystem.pl";
const APP_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://kscsystem.pl";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""),
  });
}

// --- Email templates ---

export async function sendWelcomeEmail(email: string, name: string) {
  return sendMail({
    to: email,
    subject: "Witamy w KSC System!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Witaj, ${name}!</h2>
        <p>Dziękujemy za rejestrację w <strong>KSC System</strong>.</p>
        <p>Twoje konto jest aktywne. Możesz się teraz zalogować i rozpocząć pracę nad zgodnością z ustawą o Krajowym Systemie Cyberbezpieczeństwa.</p>
        <p style="margin-top: 24px;">
          <a href="${APP_URL}/login" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Zaloguj się
          </a>
        </p>
        <p style="margin-top: 32px; color: #888; font-size: 12px;">
          Pozdrawiamy,<br/>Zespół KSC System
        </p>
      </div>
    `,
  });
}

export async function sendQuizReportEmail(
  email: string,
  name: string,
  classification: string,
  score: number
) {
  const classLabel =
    classification === "essential"
      ? "Podmiot kluczowy"
      : classification === "important"
        ? "Podmiot ważny"
        : "Nie podlega ustawie";

  const classColor =
    classification === "essential"
      ? "#ef4444"
      : classification === "important"
        ? "#f59e0b"
        : "#22c55e";

  return sendMail({
    to: email,
    subject: `Raport KSC — ${classLabel}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Raport z analizy KSC</h2>
        <p>Cześć${name ? `, ${name}` : ""}!</p>
        <p>Oto wynik Twojej analizy zgodności z ustawą o Krajowym Systemie Cyberbezpieczeństwa:</p>

        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid ${classColor};">
          <p style="font-size: 14px; color: #666; margin: 0 0 8px 0;">Klasyfikacja:</p>
          <p style="font-size: 24px; font-weight: bold; color: ${classColor}; margin: 0;">${classLabel}</p>
          <p style="font-size: 14px; color: #666; margin: 8px 0 0 0;">Wynik: ${score} / 100 pkt</p>
        </div>

        ${classification !== "not_applicable" ? `
        <p>Twoja organizacja prawdopodobnie podlega obowiązkom wynikającym z ustawy o KSC. Zalecamy:</p>
        <ul>
          <li>Przeprowadzenie szczegółowej analizy ryzyka</li>
          <li>Wdrożenie systemu zarządzania bezpieczeństwem informacji</li>
          <li>Wyznaczenie osoby kontaktowej ds. KSC</li>
        </ul>
        ` : `
        <p>Na podstawie podanych informacji Twoja organizacja prawdopodobnie nie podlega bezpośrednio ustawie o KSC. Warto jednak monitorować zmiany w przepisach.</p>
        `}

        <p style="margin-top: 24px;">
          <a href="${APP_URL}/register" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Zacznij wdrożenie w KSC System
          </a>
        </p>

        <p style="margin-top: 32px; color: #888; font-size: 12px;">
          Pozdrawiamy,<br/>Zespół KSC System
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  return sendMail({
    to: email,
    subject: "Reset hasła — KSC System",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Reset hasła</h2>
        <p>Otrzymaliśmy prośbę o reset hasła do Twojego konta w KSC System.</p>
        <p style="margin-top: 24px;">
          <a href="${resetUrl}" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Ustaw nowe hasło
          </a>
        </p>
        <p style="margin-top: 16px; color: #888; font-size: 13px;">Link jest ważny przez 1 godzinę. Jeśli nie prosiłeś/aś o reset — zignoruj tę wiadomość.</p>
        <p style="margin-top: 32px; color: #888; font-size: 12px;">
          Pozdrawiamy,<br/>Zespół KSC System
        </p>
      </div>
    `,
  });
}
