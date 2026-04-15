import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, projectType, message } = await req.json();

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "nityanshuranawat.deuglo@gmail.com",
      subject: `New Contact Inquiry from ${name}`,
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:#111111; padding:24px 32px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:600;">
                  Tatvam Collective
                </h1>
                <p style="margin:8px 0 0; color:#C6A77D; font-size:14px;">
                  New Contact Inquiry
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 24px;">
                <h2 style="margin:0 0 24px; font-size:20px; color:#111111;">
                  Contact Form Submission
                </h2>

                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:10px 0; font-weight:bold; color:#111111;">Name:</td>
                    <td style="padding:10px 0; color:#6B7280;">${name}</td>
                  </tr>

                  <tr>
                    <td style="padding:10px 0; font-weight:bold; color:#111111;">Email:</td>
                    <td style="padding:10px 0; color:#6B7280;">${email}</td>
                  </tr>

                  <tr>
                    <td style="padding:10px 0; font-weight:bold; color:#111111;">Project Type:</td>
                    <td style="padding:10px 0; color:#6B7280;">${projectType}</td>
                  </tr>
                </table>

                <!-- Message Box -->
                <div style="
                  margin-top:24px;
                  padding:20px;
                  background:#f9fafb;
                  border-left:4px solid #C6A77D;
                  border-radius:8px;
                ">
                  <p style="
                    margin:0 0 10px;
                    font-weight:bold;
                    color:#111111;
                  ">
                    Message
                  </p>

                  <p style="
                    margin:0;
                    color:#6B7280;
                    line-height:1.6;
                    white-space:pre-line;
                  ">
                    ${message}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                background:#f9fafb;
                padding:20px;
                text-align:center;
                font-size:12px;
                color:#9CA3AF;
                border-top:1px solid #E5E7EB;
              ">
                This email was generated from the Tatvam Collective contact form.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
