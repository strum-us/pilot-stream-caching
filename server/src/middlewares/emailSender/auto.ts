import { mailingRepEmail } from "config/serverenv";
import { sendMail } from ".";

const hour = 1000 * 60 * 60
export function initAutoEmailTest() {
  console.log('start auto email')
  sendMail('[Strum mail] Regular Email', ['isaac@strum.us'], 'Regular Email Test ' + new Date(), mailingRepEmail)
  setInterval(async () => {
    const result = await sendMail('[Strum mail] Regular Email', ['isaac@strum.us'], 'Regular Email Test ' + new Date(), mailingRepEmail)
    console.log('email sent:', result)
  }, hour * 1)
}