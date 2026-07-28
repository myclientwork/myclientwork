import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId, status, clientEmail, clientName, jobTitle } = body;

    if (!jobId || !status || !clientEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters (jobId, status, clientEmail)' },
        { status: 400 }
      );
    }

    const readableStatus = status.replace(/_/g, ' ');

    // Configure Nodemailer Transporter
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined;
    const from = process.env.SMTP_FROM || user || '"MyClientWork Team" <noreply@myclientwork.online>';

    let emailSent = false;
    let emailNote = '';

    if (user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
          <div style="background-color: #0f172a; padding: 16px 24px; border-radius: 6px 6px 0 0; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Requirement Status Update</h2>
          </div>
          <div style="padding: 24px; color: #333333; line-height: 1.6;">
            <p>Dear <strong>${clientName || 'Valued Client'}</strong>,</p>
            <p>The status of your project requirement <strong>"${jobTitle || 'Project Requirement'}"</strong> has been updated by our team:</p>
            <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">New Requirement Status:</p>
              <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: bold; color: #0f172a;">${readableStatus}</p>
            </div>
            <p>If you have any questions or additional details to provide, please reply to this email or visit your dashboard workspace.</p>
            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">Thank you for choosing <strong>MyClientWork</strong>.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 12px 24px; border-radius: 0 0 6px 6px; text-align: center; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} MyClientWork. All rights reserved.
          </div>
        </div>
      `;

      await transporter.sendMail({
        from,
        to: clientEmail,
        subject: `Update on your requirement: ${jobTitle} [${readableStatus}]`,
        html: htmlContent,
      });

      emailSent = true;
      emailNote = `Email sent successfully via Nodemailer to ${clientEmail}`;
    } else {
      console.log(`[Nodemailer Mock Mode] SMTP credentials not set. Status change notification for "${jobTitle}" (${readableStatus}) intended for ${clientEmail}`);
      emailNote = `Status updated successfully. (Note: SMTP credentials not set, email logged to console)`;
    }

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailNote,
    });
  } catch (error: any) {
    console.error('Error sending status email via Nodemailer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email notification' },
      { status: 500 }
    );
  }
}
