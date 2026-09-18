/**
 * One plain layout for every email we send. Email clients strip <style> blocks and most modern CSS,
 * so the styles are inline and the structure is a single centred column that survives anywhere.
 */

export type EmailButton = { label: string; url: string }

export type EmailContent = {
  schoolName: string
  /** Shown large at the top of the message. */
  heading: string
  /** One paragraph per entry. */
  paragraphs: string[]
  button?: EmailButton
  /** Small print under the button, e.g. how long a link works. */
  footnotes?: string[]
}

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function renderEmailHtml(content: EmailContent): string {
  const paragraphs = content.paragraphs
    .map((text) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1f2933;">${escapeHtml(text)}</p>`)
    .join('')
  const button = content.button
    ? `<p style="margin:24px 0;">
         <a href="${escapeHtml(content.button.url)}"
            style="display:inline-block;padding:12px 22px;border-radius:8px;background:#1d4ed8;color:#ffffff;
                   font-size:15px;font-weight:600;text-decoration:none;">${escapeHtml(content.button.label)}</a>
       </p>
       <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#5c6b7a;">
         If the button doesn’t work, copy this link into your browser:<br>
         <span style="word-break:break-all;color:#1d4ed8;">${escapeHtml(content.button.url)}</span>
       </p>`
    : ''
  const footnotes = (content.footnotes ?? [])
    .map((text) => `<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#5c6b7a;">${escapeHtml(text)}</p>`)
    .join('')

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px 12px;background:#f4f6f8;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560"
                 style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e3e8ee;border-radius:12px;">
            <tr>
              <td style="padding:28px 28px 8px;border-bottom:1px solid #eef1f5;">
                <span style="font-size:15px;font-weight:700;color:#1f2933;">${escapeHtml(content.schoolName)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 28px;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;color:#1f2933;">${escapeHtml(content.heading)}</h1>
                ${paragraphs}
                ${button}
                ${footnotes}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 24px;border-top:1px solid #eef1f5;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#8a97a5;">
                  This message was sent by the ${escapeHtml(content.schoolName)} school management system.
                  Please don’t reply to it.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

/** The same message as text, for clients that don't show HTML and for spam scoring. */
export function renderEmailText(content: EmailContent): string {
  const lines = [content.schoolName, '', content.heading, '', ...content.paragraphs]
  if (content.button) lines.push('', `${content.button.label}: ${content.button.url}`)
  if (content.footnotes?.length) lines.push('', ...content.footnotes)
  lines.push('', `Sent by the ${content.schoolName} school management system. Please don’t reply.`)
  return lines.join('\n')
}
