import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  method: 'resend' | 'smtp' | 'mock';
  message: string;
  data?: any;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text, from: customFrom } = options;

  const resendApiKey = process.env.RESEND_API_KEY;

  // Resend requires a verified domain or onboarding@resend.dev (never @gmail.com)
  let resendFrom =
    customFrom ||
    process.env.RESEND_FROM ||
    '"MyClientWork" <updates@myclientwork.online>';

  if (resendFrom.includes('@gmail.com')) {
    resendFrom = process.env.RESEND_FROM || '"MyClientWork" <updates@myclientwork.online>';
  }

  // 1. Try Resend SDK if RESEND_API_KEY is defined
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      let resendResponse = await resend.emails.send({
        from: resendFrom,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>?/gm, ''),
      });

      // If domain not verified, retry with default Resend test address (onboarding@resend.dev)
      if (
        resendResponse.error &&
        resendResponse.error.message.toLowerCase().includes('not verified')
      ) {
        console.warn('Resend custom domain unverified, retrying with onboarding@resend.dev');
        resendResponse = await resend.emails.send({
          from: 'MyClientWork <onboarding@resend.dev>',
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>?/gm, ''),
        });
      }

      if (resendResponse.error) {
        throw new Error(resendResponse.error.message);
      }

      return {
        success: true,
        method: 'resend',
        message: `Email sent via Resend SDK to ${to}`,
        data: resendResponse.data,
      };
    } catch (err: any) {
      console.warn('Resend SDK send failed, attempting SMTP fallback:', err?.message || err);
    }
  }

  // 2. Try Nodemailer / SMTP fallback
  const smtpFrom =
    customFrom ||
    process.env.SMTP_FROM ||
    '"MyClientWork" <myclientwork3@gmail.com>';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>?/gm, ''),
      });

      return {
        success: true,
        method: 'smtp',
        message: `Email sent via SMTP (${smtpHost}) to ${to}`,
        data: info,
      };
    } catch (err: any) {
      console.error('SMTP email send failed:', err?.message || err);
      throw new Error(`Failed to send email: ${err?.message || 'SMTP Error'}`);
    }
  }

  // 3. Fallback: Mock Mode
  console.log(`[Email Service Mock] No RESEND_API_KEY or SMTP credentials set. Email to ${to}: "${subject}"`);
  return {
    success: true,
    method: 'mock',
    message: `[Mock Mode] Email logged for ${to}`,
  };
}
