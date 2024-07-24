'use client'
import React, { useState } from 'react'
import { Heading, Subheading } from '../../components/heading'
import { useCasesDictionary } from '@utils/emailer/use-cases'
import { Dialog } from '@components/dialog'
import { Button } from '@headlessui/react'
import { ArrowDown, ArrowRight, User } from 'tabler-icons-react'
import type { EmailContentTemplate } from '@prisma/client'
import EmailForm from './EmailForm'

export default function EmailsTable({
  emails,
}: {
  emails: EmailContentTemplate[]
}) {
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<EmailContentTemplate>(
    emails[0]
  )
  const useCases = emails?.map((e) => e.useCase)

  const href = `https://vidonline.uap.edu.ar/protocols/id_del_protocolo`
  const html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>

        <style type="text/css">
          @media only screen and (min-width: 520px) {
      .u-row {
        width: 500px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }

      .u-row .u-col-100 {
        width: 500px !important;
      }

    }

    @media (max-width: 520px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }
      .u-row {
        width: 100% !important;
      }
      .u-col {
        width: 100% !important;
      }
      .u-col > div {
        margin: 0 auto;
      }
    }
    body {
      margin: 0;
      padding: 0;
    }

    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }

    p {
      margin: 0;
    }

    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }

    * {
      line-height: inherit;
    }

    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }

    table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
        </style>



    </head>

    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->


    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

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

      <h1 style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 22px; font-weight: 400;">${dialogContent?.content}</h1>

          </td>
        </tr>
      </tbody>
    </table>

    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

      <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
        <p style="line-height: 140%;">Entrá a ver el protocolo haciendo <a rel="noopener" href=${href} target="_blank">click acá.</a></p>
      </div>

          </td>
        </tr>
      </tbody>
    </table>

      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>


        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
      </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>

    </html>`

  const htmlEmailUpdate = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>

        <style type="text/css">
          @media only screen and (min-width: 520px) {
      .u-row {
        width: 500px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }

      .u-row .u-col-100 {
        width: 500px !important;
      }

    }

    @media (max-width: 520px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row .u-col {
        min-width: 320px !important;
        max-width: 100% !important;
        display: block !important;
      }
      .u-row {
        width: 100% !important;
      }
      .u-col {
        width: 100% !important;
      }
      .u-col > div {
        margin: 0 auto;
      }
    }
    body {
      margin: 0;
      padding: 0;
    }

    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }

    p {
      margin: 0;
    }

    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }

    * {
      line-height: inherit;
    }

    a[x-apple-data-detectors='true'] {
      color: inherit !important;
      text-decoration: none !important;
    }

    table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
        </style>



    </head>

    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->


    <div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
      <div style="height: 100%;width: 100% !important;">
      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

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

      <h1 style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 22px; font-weight: 400;">${dialogContent?.content}: <span style="font-weight: 800;"> ${Math.random().toString().split('.')[1].slice(0, 6)}</span></h1>

          </td>
        </tr>
      </tbody>
    </table>

    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">



          </td>
        </tr>
      </tbody>
    </table>

      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
      </div>
    </div>
    <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>


        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
      </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>

    </html>`

  const useCasesExplanation = {
    onReview: (
      <div className="relative mx-auto my-5 flex w-fit flex-col items-center gap-3 text-justify text-gray-700 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Evaluador</h3>{' '}
          <p className="text-xs">
            Evaluador (metodólogo, evaluador interno, externo o extraordinario)
            completa una evaluación.
          </p>
        </div>
        <div className="hidden place-self-center self-center md:block">
          <ArrowRight />
        </div>
        <div className="block place-self-center self-center md:hidden">
          <ArrowDown />
        </div>
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Investigador</h3>{' '}
          <p className="text-xs ">
            El investigador al que está asociado el protocolo recibe una
            notificación por email informándole que su protocolo fue evaluado.
          </p>
        </div>
      </div>
    ),
    onRevised: (
      <div className="relative mx-auto my-5 flex w-fit flex-col items-center gap-3 text-justify text-gray-700 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Investigador</h3>{' '}
          <p className="text-xs">
            Si un evaluador requirió cambios en el protocolo, el investigador
            los corrige y guarda el protocolo marcándolo como {`'revisado'`}.
          </p>
        </div>
        <div className="hidden place-self-center self-center md:block">
          <ArrowRight />
        </div>
        <div className="block place-self-center self-center md:hidden">
          <ArrowDown />
        </div>
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Evaluador</h3>{' '}
          <p className="text-xs ">
            El evaluador recibe una notificación por email informándole que el
            protocolo donde indicó que era necesario hacer cambios fue revisado
            y corregido.
          </p>
        </div>
      </div>
    ),
    onAssignation: (
      <div className="relative mx-auto my-5 flex w-fit flex-col items-center gap-3 text-justify text-gray-700 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Secretario o Administrador</h3>{' '}
          <p className="text-xs">
            Un secretario o administrador asigna un evaluador (metodólogo,
            evaluador interno, externo o extaordinario) a un protocolo.
          </p>
        </div>
        <div className="hidden place-self-center self-center md:block">
          <ArrowRight />
        </div>
        <div className="block place-self-center self-center md:hidden">
          <ArrowDown />
        </div>
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Evaluador</h3>{' '}
          <p className="text-xs ">
            El evaluador recibe una notificación por email informándole que le
            fue asignado un protocolo para evaluar.
          </p>
        </div>
      </div>
    ),
    onPublish: (
      <div className="relative mx-auto my-5 flex w-fit flex-col items-center gap-3 text-justify text-gray-700 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Investigador</h3>{' '}
          <p className="text-xs">
            El investigador completa todos los datos de un protocolo y lo
            publica para ser evaluado.
          </p>
        </div>
        <div className="hidden place-self-center self-center md:block">
          <ArrowRight />
        </div>
        <div className="block place-self-center self-center md:hidden">
          <ArrowDown />
        </div>
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Secretarios</h3>{' '}
          <p className="text-xs ">
            Los secretarios asociados a la Unidad Académica a la que pertenece
            el protocolo reciben un email donde se les informa que se publicó un
            nuevo protocolo.
          </p>
        </div>
      </div>
    ),
    onApprove: (
      <div className="relative mx-auto my-5 flex w-fit flex-col items-center gap-3 text-justify text-gray-700 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Secretario o Administrador</h3>{' '}
          <p className="text-xs">
            Luego de pasar todas las evaluaciones y ser aprobado el presupuesto,
            un secretario o administrador aprueba el protocolo.
          </p>
        </div>
        <div className="hidden place-self-center self-center md:block">
          <ArrowRight />
        </div>
        <div className="block place-self-center self-center md:hidden">
          <ArrowDown />
        </div>
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Investigador</h3>{' '}
          <p className="text-xs ">
            El investigador recibe una notificación por email informándole que
            su protocolo fue aprobado.
          </p>
        </div>
      </div>
    ),
    changeUserEmail: (
      <div className="relative mx-auto my-5 flex w-fit flex-col items-center gap-3 text-justify text-gray-700 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <User className="h-10 w-10" />{' '}
          <h3 className="text-sm font-bold">Usuario</h3>{' '}
          <p className="text-xs">
            El usuario al que pertenece la cuenta desea cambiar de email recibe
            un código de confirmación en su email actual.
          </p>
        </div>
      </div>
    ),
  }

  return (
    <div className="text-primary-950">
      <Heading>Emails</Heading>
      <Subheading>
        Puede editar el asunto y contenido de los emails que salen del sistema
        dependiendo del caso de uso.
      </Subheading>
      <p className="my-2 text-lg font-semibold text-gray-600">Casos de uso:</p>
      <div className="flex flex-wrap gap-2">
        {useCases?.map((uc) => (
          <Button
            key={uc}
            onClick={() => {
              setOpen(true)
              setDialogContent(emails.find((e) => e.useCase == uc)!)
            }}
            className="cursor-pointer rounded-lg border p-4 text-lg font-medium drop-shadow-sm transition hover:shadow-lg"
          >
            {useCasesDictionary[uc as keyof typeof useCasesDictionary]}
          </Button>
        ))}
      </div>
      <Dialog size="2xl" open={open} onClose={setOpen}>
        <Heading className="text-primary-950">
          {
            useCasesDictionary[
              dialogContent?.useCase as keyof typeof useCasesDictionary
            ]
          }
        </Heading>
        {
          useCasesExplanation[
            dialogContent?.useCase as keyof typeof useCasesExplanation
          ]
        }
        <Subheading className=" my-2">Email</Subheading>
        <EmailForm email={dialogContent} callbackFn={setDialogContent} />
        <Subheading className="mt-3">Vista previa del email</Subheading>
        <div className="my-2 rounded-lg border p-4">
          <div
            dangerouslySetInnerHTML={{
              __html:
                dialogContent?.useCase == 'changeUserEmail' ?
                  htmlEmailUpdate
                : html,
            }}
          />
        </div>
      </Dialog>
    </div>
  )
}
