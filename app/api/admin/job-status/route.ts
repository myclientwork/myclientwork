import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

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

    // Format status nicely (e.g., "IN_PROGRESS" -> "In Progress")
    const formattedStatus = status
      .toLowerCase()
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myclientwork.online';
    const dashboardLink = jobId ? `${siteUrl}/dashboard/jobs/${jobId}` : `${siteUrl}/dashboard`;

    // Sleek status badge colors
    let badgeBg = '#0284c7';
    let badgeText = '#ffffff';
    if (status === 'COMPLETED' || status === 'QUALIFIED') {
      badgeBg = '#10b981';
    } else if (status === 'IN_PROGRESS') {
      badgeBg = '#6366f1';
    } else if (status === 'REJECTED' || status === 'CANCELLED') {
      badgeBg = '#ef4444';
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Requirement Update</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 600px; background-color: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                
                <!-- Header Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #050816 0%, #1e1b4b 50%, #0f172a 100%); padding: 32px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
                    <div style="display: inline-block; padding: 6px 16px; background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 20px; color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                      MyClientWork Workspace
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; tracking-tight: -0.5px;">
                      Project Requirement Update
                    </h1>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 36px 30px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                    <p style="margin-top: 0; color: #f8fafc; font-size: 16px; font-weight: 600;">
                      Hello ${clientName || 'Valued Client'},
                    </p>
                    <p style="margin-bottom: 24px; color: #94a3b8;">
                      Our engineering team has updated the execution status for your submitted requirement specs.
                    </p>

                    <!-- Requirement Details Card -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 28px; padding: 20px;">
                      <tr>
                        <td>
                          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 6px;">
                            Requirement Title
                          </div>
                          <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
                            ${jobTitle || 'Custom Application Specs'}
                          </div>

                          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 6px;">
                            Updated Execution Status
                          </div>
                          <div>
                            <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeText}; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 20px; letter-spacing: 0.3px;">
                              ${formattedStatus}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin-bottom: 28px; color: #94a3b8; font-size: 14px;">
                      You can review real-time milestones, submit feedback, or communicate with our engineering leads directly through your client workspace.
                    </p>

                    <!-- Action Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 10px auto;">
                      <tr>
                        <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);">
                          <a href="${dashboardLink}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px;">
                            View Requirement in Workspace &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #090d16; padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b;">
                    <p style="margin: 0 0 6px 0;">
                      Need assistance? Contact us at <a href="mailto:myclientwork3@gmail.com" style="color: #38bdf8; text-decoration: none;">myclientwork3@gmail.com</a>
                    </p>
                    <p style="margin: 0;">
                      &copy; ${new Date().getFullYear()} MyClientWork (myclientwork.online). All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Clean professional subject line without raw status tags
    const emailSubject = `Project Requirement Update: ${jobTitle || 'Requirement Specs'}`;

    const emailResult = await sendEmail({
      to: clientEmail,
      subject: emailSubject,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      emailSent: emailResult.success,
      method: emailResult.method,
      message: emailResult.message,
    });
  } catch (error: any) {
    console.error('Error sending status notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email notification' },
      { status: 500 }
    );
  }
}
