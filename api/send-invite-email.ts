/* eslint-env node */
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, inviteLink, groupName } = req.body;
  if (!to || !inviteLink || !groupName)
    return res.status(400).json({ error: "Missing fields" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Resend config missing" });

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "noreply@famcaly.com",
        to,
        subject: `Inbjudan till gruppen ${groupName}`,
        html: `
          <h2>Du har blivit inbjuden till ${groupName}!</h2>
          <p>Klicka på länken för att gå med: <a href="${inviteLink}">${inviteLink}</a></p>
          <p>Om du inte har ett konto, registrera dig först.</p>
        `
      })
    });

    if (!resendRes.ok) {
      const text = await resendRes.text();
      return res.status(500).json({ error: "Resend error", details: text });
    }

    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ error: "Kunde inte skicka e-post" });
  }
}
