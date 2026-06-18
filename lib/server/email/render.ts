/**
 * Email layout — table-based, inline-CSS, ~600px, with a hidden preheader and
 * a plain-text twin. Built for Gmail / Outlook / Apple Mail / Yahoo / mobile.
 * No external images (privacy + spam-friendly). Nature palette baked in.
 */

const C = {
  morningMist: "#FBF9F3",
  linenAir: "#F1EDE1",
  card: "#FFFFFF",
  freshFern: "#79A971",
  deepPine: "#284E3C",
  clearTeal: "#4E9B92",
  goldenHour: "#E7C566",
  bark: "#3C352B",
  softStone: "#8A7F6B",
  border: "#E7E1D3",
};

export interface EmailContent {
  preheader: string;
  heading: string;
  intro: string;
  /** Extra paragraphs (already plain strings). */
  paragraphs?: string[];
  button?: { label: string; url: string };
  fallbackUrl?: string;
  footnote?: string;
}

export function renderEmailHtml(c: EmailContent): string {
  const button = c.button
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0">
        <tr>
          <td align="center" bgcolor="${C.deepPine}" style="border-radius:999px">
            <a href="${c.button.url}"
               style="display:inline-block;padding:14px 34px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px">
              ${c.button.label}
            </a>
          </td>
        </tr>
      </table>`
    : "";

  const fallback = c.fallbackUrl
    ? `<p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${C.softStone}">Or paste this link into your browser:</p>
       <p style="margin:0 0 24px;font-size:13px;line-height:1.6;word-break:break-all"><a href="${c.fallbackUrl}" style="color:${C.clearTeal}">${c.fallbackUrl}</a></p>`
    : "";

  const extra = (c.paragraphs ?? [])
    .map((p) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${C.bark}">${p}</p>`)
    .join("");

  const footnote = c.footnote
    ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${C.softStone}">${c.footnote}</p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${c.heading}</title>
</head>
<body style="margin:0;padding:0;background:${C.morningMist}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.morningMist}">${c.preheader}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.morningMist}">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

          <!-- header band (gradient with solid fallback for Outlook) -->
          <tr>
            <td bgcolor="${C.deepPine}" style="background:linear-gradient(120deg,${C.deepPine},${C.clearTeal});border-radius:20px 20px 0 0;padding:26px 32px">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:-.2px">Breath+</span>
              <span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#d9e7df;float:right;padding-top:5px">a deep breath, delivered</span>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td bgcolor="${C.card}" style="border-left:1px solid ${C.border};border-right:1px solid ${C.border};padding:36px 32px 8px">
              <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.25;color:${C.bark};font-weight:normal">${c.heading}</h1>
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${C.bark}">${c.intro}</p>
              ${extra}
              <div style="font-family:Arial,Helvetica,sans-serif">${button}</div>
              <div style="font-family:Arial,Helvetica,sans-serif">${fallback}${footnote}</div>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td bgcolor="${C.card}" style="border:1px solid ${C.border};border-top:0;border-radius:0 0 20px 20px;padding:24px 32px">
              <hr style="border:0;border-top:1px solid ${C.border};margin:0 0 16px">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${C.softStone}">
                Breath+ — the premium respiration platform. A satire of subscription culture; the air is, and always was, free.
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${C.softStone}">
                Breath+ Atmospheric Holdings · 1 Oxygen Way · Cape Town, South Africa
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderEmailText(c: EmailContent): string {
  const lines = [
    c.heading,
    "",
    c.intro,
    ...(c.paragraphs ?? []),
    "",
    ...(c.button ? [`${c.button.label}: ${c.button.url}`, ""] : []),
    ...(c.footnote ? [c.footnote, ""] : []),
    "—",
    "Breath+ — a satire of subscription culture. The air is free.",
    "Breath+ Atmospheric Holdings · 1 Oxygen Way · Cape Town, South Africa",
  ];
  return lines.join("\n");
}
