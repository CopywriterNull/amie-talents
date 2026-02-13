import { NextResponse } from "next/server";
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Send welcome email
    await getResend().emails.send({
      from: "Amie Talents <noreply@amietalents.com>",
      to: [email],
      subject: "Welcome to the Amie Talents Newsletter!",
      html: `
        <h2>Thanks for subscribing!</h2>
        <p>You're now on the list to receive:</p>
        <ul>
          <li>Industry insights and trends</li>
          <li>Creator success stories</li>
          <li>Tips for brands and influencers</li>
          <li>Exclusive partnership opportunities</li>
        </ul>
        <p>We typically send updates 1-2 times per month. No spam, ever.</p>
        <p>Best,<br>The Amie Talents Team</p>
      `,
    });

    // Notify the team
    await getResend().emails.send({
      from: "Amie Talents <noreply@amietalents.com>",
      to: ["hello@amietalents.com"], // Replace with actual email
      subject: "New Newsletter Subscriber",
      html: `
        <p>New subscriber: <strong>${email}</strong></p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
