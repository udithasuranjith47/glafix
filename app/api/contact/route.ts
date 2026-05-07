import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, reason, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"Glafix Contact" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `[Glafix Contact] ${reason}: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nReason: ${reason}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="margin-bottom:4px">New contact submission</h2>
          <p style="color:#888;margin-top:0">via Glafix.com</p>
          <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
            <tr><td style="padding:6px 0;font-weight:600;width:100px">Name</td><td>${name}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:6px 0;font-weight:600">Reason</td><td>${reason}</td></tr>
          </table>
          <div style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap">${message}</div>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
