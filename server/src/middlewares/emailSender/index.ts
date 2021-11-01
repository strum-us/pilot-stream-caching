// import { copywrite, mailingRepEmail } from '../../config/serverenv'

import { GOOGLE_ACCOUNT } from 'config/secretkey'
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'

export function makeAuthCodeEmailHtml(code: string, copywrite: string): string {
  return `
    <html lang="ko">
      <head>
        <meta charset="utf-8">
        <title>Reset password</title>
      </head>
      <body>
        <p style="font-size:16px">Hello,</p>
        <p style="font-size:16px">Input your code : ${code}</p>
        <p style="font-size: 12px; margin-top: 5px;">${copywrite}</p>
      </body>
    </html>
`
}

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  // host: 'smtp.gmail.com',
  auth: {
    user: GOOGLE_ACCOUNT.user,
    pass: GOOGLE_ACCOUNT.pass,
  },
}))

export async function sendMail(title: string, recipients: string[], html: string, mailingRepEmail: string) {
  // let emails = ''
  // recipients.forEach((r) => { emails += `${r}, ` })
  return Promise.all(recipients.map(async (email) =>
    await transporter.sendMail({
      from: `Issuenote Service <${GOOGLE_ACCOUNT.user}>`,
      to: email,
      subject: title,
      html: html,
    }),
  ))
}

export async function sendServerErrorMail(err: Error): Promise<void> {
  try {
    const title: string = 'Server Error'
    const message = `
      <div>
        <h2>${err.constructor.name}: ${err.message}</h2>
        ${err.stack?.split('\n').join('<br/>')}
        <br/>
        <h2>Error stack</h2>
        ${getStackTrace(err)?.split('\n').join('<br/>')}
      </div>
    `
  } catch (err) {
    console.error(err)
  }
}

const getStackTrace = (err: Error) => {
  Error.captureStackTrace(err, getStackTrace)
  return err.stack
}
