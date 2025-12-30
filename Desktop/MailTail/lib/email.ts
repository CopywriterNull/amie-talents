import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInviteEmailParams {
  to: string;
  inviterName: string;
  teamName: string;
  role: string;
  inviteLink: string;
}

export async function sendInviteEmail({
  to,
  inviterName,
  teamName,
  role,
  inviteLink,
}: SendInviteEmailParams) {
  const { error } = await resend.emails.send({
    from: "MailTail <onboarding@resend.dev>",
    to,
    subject: `You've been invited to join ${teamName} on MailTail`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafafa; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e5e5e5; overflow: hidden;">
            <div style="padding: 32px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #171717, #404040); border-radius: 10px; margin-bottom: 24px;"></div>

              <h1 style="font-size: 20px; font-weight: 600; color: #171717; margin: 0 0 8px 0;">
                You're invited to join ${teamName}
              </h1>

              <p style="font-size: 14px; color: #737373; margin: 0 0 24px 0; line-height: 1.6;">
                ${inviterName} has invited you to join their team on MailTail as a <strong style="color: #171717;">${role}</strong>.
              </p>

              <a href="${inviteLink}" style="display: inline-block; background: #171717; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                Accept Invitation
              </a>

              <p style="font-size: 12px; color: #a3a3a3; margin: 24px 0 0 0; line-height: 1.5;">
                This invite expires in 7 days. If you didn't expect this invitation, you can ignore this email.
              </p>
            </div>

            <div style="background: #fafafa; border-top: 1px solid #e5e5e5; padding: 16px 32px;">
              <p style="font-size: 12px; color: #a3a3a3; margin: 0;">
                MailTail - Improve your Gmail inbox placement
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Failed to send invite email:", error);
    throw error;
  }
}
