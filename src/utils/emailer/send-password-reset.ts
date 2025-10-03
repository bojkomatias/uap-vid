'use server'

import nodemailer from 'nodemailer'

export async function sendPasswordResetEmail(email: string, code: string) {
  try {
    const html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
      <style type="text/css">
        @media only screen and (min-width: 520px) {
          .u-row { width: 500px !important; }
          .u-row .u-col { vertical-align: top; }
          .u-row .u-col-100 { width: 500px !important; }
        }
        @media (max-width: 520px) {
          .u-row-container { max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important; }
          .u-row .u-col { min-width: 320px !important; max-width: 100% !important; display: block !important; }
          .u-row { width: 100% !important; }
          .u-col { width: 100% !important; }
          .u-col > div { margin: 0 auto; }
        }
        body { margin: 0; padding: 0; }
        table, tr, td { vertical-align: top; border-collapse: collapse; }
        p { margin: 0; }
        .ie-container table, .mso-container table { table-layout: fixed; }
        * { line-height: inherit; }
        a[x-apple-data-detectors='true'] { color: inherit !important; text-decoration: none !important; }
        table, td { color: #000000; }
        #u_body a { color: #0000ee; text-decoration: underline; }
      </style>
    </head>
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
      <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                          <span>&#160;</span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                  <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: arial black,AvenirNext-Heavy,avant garde,arial; font-size: 22px; font-weight: 400;">Vicerrectoría de Investigación y Desarrollo</h1>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                          <span>&#160;</span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                  <h1 style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 22px; font-weight: 400;">Recuperación de Contraseña</h1>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                    <p style="line-height: 140%;">Has solicitado restablecer tu contraseña. Tu código de verificación es:</p>
                                    <p style="line-height: 140%; margin-top: 20px; margin-bottom: 20px;">
                                      <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; font-family: monospace;">${code}</span>
                                    </p>
                                    <p style="line-height: 140%;">Este código expirará en 3 horas.</p>
                                    <p style="line-height: 140%; margin-top: 10px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`

    let transporter

    if (process.env.NODE_ENV !== 'development') {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_ADDRESS,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        ignoreTLS: true,
      })
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_ADDRESS || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      })
    }

    const isDevelopment = process.env.NODE_ENV === 'development'
    const ghostEmail = 'nicolas.horn@uap.edu.ar'

    const emailObject = {
      from: '"Portal VID - UAP" no-reply@uap.edu.ar',
      to: isDevelopment ? ghostEmail : email,
      subject: 'Recuperación de Contraseña - Portal VID UAP',
      text: `Tu código de recuperación de contraseña es: ${code}. Este código expirará en 3 horas.`,
      html: html,
    }

    await transporter.sendMail(emailObject)
    console.log(`✅ Password reset email sent to: ${email}`)
    return true
  } catch (error) {
    console.error('❌ Error sending password reset email:', error)
    return false
  }
}
