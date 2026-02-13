import { NextResponse } from "next/server";
import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  type: "brand" | "influencer";
  name: string;
  email: string;
  company?: string;
  website?: string;
  socialHandle?: string;
  followers?: string;
  message: string;
  talentInterest?: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    const { type, name, email, company, website, socialHandle, followers, message, talentInterest } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isBrand = type === "brand";
    const subject = isBrand
      ? `New Brand Inquiry from ${company || name}`
      : `New Creator Application from ${name}`;

    const emailContent = isBrand
      ? `
        <h2>New Brand Partnership Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Website:</strong> ${website || "Not provided"}</p>
        ${talentInterest ? `<p><strong>Interested in Talent:</strong> ${talentInterest}</p>` : ""}
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `
      : `
        <h2>New Creator Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Social Handle:</strong> ${socialHandle || "Not provided"}</p>
        <p><strong>Followers:</strong> ${followers || "Not provided"}</p>
        <p><strong>Website/Media Kit:</strong> ${website || "Not provided"}</p>
        <h3>About Them:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `;

    // Send email notification to the agency
    await getResend().emails.send({
      from: "Amie Talents <noreply@amietalents.com>",
      to: ["hello@amietalents.com"], // Replace with actual email
      replyTo: email,
      subject,
      html: emailContent,
    });

    // Send confirmation email to the sender
    const confirmationContent = isBrand
      ? `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your inquiry about partnering with Amie Talents. Our team will review your message and get back to you within 2-3 business days.</p>
        <p>In the meantime, feel free to browse our <a href="https://amietalents.com/talent">talent roster</a> to learn more about the creators we represent.</p>
        <p>Best,<br>The Amie Talents Team</p>
      `
      : `
        <h2>Thank you for applying!</h2>
        <p>Hi ${name},</p>
        <p>We've received your application to join the Amie Talents roster. Our team will review your profile and get back to you within 2-3 business days.</p>
        <p>We're always excited to connect with talented creators, and we appreciate your interest in working with us.</p>
        <p>Best,<br>The Amie Talents Team</p>
      `;

    await getResend().emails.send({
      from: "Amie Talents <noreply@amietalents.com>",
      to: [email],
      subject: isBrand
        ? "We received your inquiry - Amie Talents"
        : "Application received - Amie Talents",
      html: confirmationContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
