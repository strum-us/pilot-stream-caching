import { GOOGLE_ACCOUNT } from 'config/secretkey'
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'

// export function makeAuthCodeEmailHtml(code: string, copywrite: string): string {
//   return `
//     <html lang="ko">
//       <head>
//         <meta charset="utf-8">
//         <title>Reset password</title>
//       </head>
//       <body>
//         <p style="font-size:16px">Hello,</p>
//         <p style="font-size:16px">Input your code : ${code}</p>
//         <p style="font-size: 12px; margin-top: 5px;">${copywrite}</p>
//       </body>
//     </html>
// `
// }

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  // host: 'smtp.gmail.com',
  auth: {
    user: GOOGLE_ACCOUNT.user,
    pass: GOOGLE_ACCOUNT.pass,
  },
}))

export async function sendMail(title: string, recipients: string[], html: string) {
  // let emails = ''
  // recipients.forEach((r) => { emails += `${r}, ` })
  return Promise.all(recipients.map(async (email) =>
    await transporter.sendMail({
      from: `Issuenote <${GOOGLE_ACCOUNT.user}>`,
      to: email,
      subject: title,
      html: html,
    }),
  ))
}

export async function sendPublishMail(req: any, res: any) {
  const { sender, title, email, url } = req.query
  const html = `
      <html lang="ko">
      <head>
        <meta charset="utf-8">
        <title>Invitation from ${sender}</title>
      </head>
      <body>
        <p style="font-size:16px">Hello,</p>
        <p style="font-size:16px">${sender} Send Issuenote to you</p>
        <a style="font-size:16px" href='${url}'>Open document</a>
      </body>
    </html>
  `
  const result = await sendMail(title, [email], html)
  console.log({ sender, email, url, result })
  res.send({ result })
}
