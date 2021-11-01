import { URLs, copywrite, privacyUrl, serviceName, termsUrl } from 'config/serverenv'

import User from 'src/database/user'

/* eslint-disable max-len */
// import { User } from '@protocols/graphql-types'

export const EmailFormat = {
  leaveMessage: (senderName: string, senderPhoto: string, invitationUrl: string, targetName: string, content: string) => `
    <p></p>
    <div style="position: relative; width: 100%; height: 150px; top: 0px; background: #eee;">
        <p style="text-align: center;"><span style="font-size: 40px; padding: 130px 0px;">${serviceName}</span></p>
        <p style="text-align: center; font-size: 18px; color: #333333;">
        <img src="${senderPhoto}" style="width: 32px; height: auto; border-radius: 20px;" /> ${senderName} has left a message
        </p>
    </div>
    <div style="margin: auto; position: relative; width: 540px; height: 500px; top: 50px; background: #ffffff;">
        <div style="position: absolute; width: 650px; height: 41px; left: calc(50% - 650px / 2 - 0.15px); top: 50px;">
        </div>
        <div style="position: absolute; width: 401px; height: 314px; left: calc(50% - 401px / 2); top: 182px;">
            <br />
            <p style="font-family: Helvetica; font-size: 16px; line-height: 25px; text-align: center; color: #333333;">${content},</p>
            <p style="text-align: center;">
                <a href="${invitationUrl}" style="font-size: 15px; border-radius: 32px; cursor: pointer; text-decoration: none; margin: 4px 0px; padding: 8px 30px; border: 2px solid #355be4; color: #355be4;"> Reply message </a>
            </p>
        </div>
    </div>
    <div style="position: relative; width: 100%; height: 80px; background: #eee;">
        <br />
        <p style="text-align: center;">
            <a href="${termsUrl}" style="font-size: 10px; margin-top: 5px; color: black; text-decoration: none;">Terms and condition</a> <span> | </span>
            <a href="${privacyUrl}" style="font-size: 10px; margin-top: 5px; color: black; text-decoration: none;">Privacy policy</a>
        </p>
        <p style="text-align: center; font-size: 10px; margin-top: 5px;">${copywrite}</p>
    </div>  
  `,
  // verificationEmail: (email: string, token: string) => `
  //   <p>
  //     Hi ${email}, now that you've created your account, it's time to create your password. Creating your password will confirm your email address if you haven't done so already.
  //     To create your password, click the button below.
  //        <a href="${URLs.APP_URL + '/#/verification/?t=' + token}" style="font-size: 15px; border-radius: 32px; cursor: pointer; text-decoration: none; margin: 4px 0px; padding: 8px 30px; border: 2px solid #355be4; color: #355be4;"> create password </a>

  //   </p>
  // `,
  verificationEmail: (email: string, token: string) => `
  <p style="padding: 40px;">
  <table style="border: 1px solid #dddddd; border-radius: 12px; max-width: 500px; margin: auto;" 
    cellpadding="0" cellspacing="0" width="100%">
    <tr height="100px"><td align="center" style="padding-top: 40px;">
        <a href="http://strum.us/">
          <img src="http://resources.strum.us/email/logo.png" alt="Strum" width="180">
        </a>
    </td></tr>
    <tr><td style="padding: 20px 60px;">
        <div style="width: 100%; margin: auto;">
        <p style="line-height: 20px; font-size: 15px; text-align: center; color: #333333;">
          Hi ${email} now that you've created your account, it's time to create your password. Creating your password will confirm your email address if you haven't done so already. To create your password, click the button below.
        </p>
        </div>
      </td> </tr>
    <tr><td align="center">
        <a href="${URLs.APP_URL + '/verification?t=' + token}&&email=${email}">
          <p style="background-color: #355BE4; border-radius: 48px; color: #FFFFFF; display: inline-block; font-size: 15px; font-weight: bold; text-align: center; text-decoration: none; width: 180px; line-height: 48px; mso-hide: all;">
            Create password
          </p>
          
        </a>
      </td> </tr>
    <tr><td style="padding: 10px 60px;">
        <a href="http://strum.us/" style="text-decoration: none;">
        <p style="line-height: 18px; font-size: 15px; text-align: center; color: #333333;">
          Strum - Audio whiteboarding for Remote teams
        </p>
      </a>
      </td> </tr>
    <tr><td style="padding: 0px 0px 40px 0px;">
        <p style="line-height: 18px; font-size: 12px; text-align: center; color: #333333;">
          <a href="${termsUrl}" style="text-decoration: none; color:355BE4;">Terms and Service </a> | 
          <a href="${privacyUrl}" style="text-decoration: none; color:355BE4;">Privacy policy </a> .
        </p>
      </td> </tr>
  </table>
  </p>
  `,
  inviteMessage: (sessionTitle: string, senderName: string, url: string) => `
  <p style="padding: 60px;">
  <table style="border: 1px solid #dddddd; border-radius: 12px; max-width: 500px; margin: auto;" 
    cellpadding="10" cellspacing="0" width="100%">
    <tr height="100px"><td align="center" style="padding-top: 40px;">
      <a href="${URLs.WEB_URL}">
        <img src="http://resources.strum.us/email/logo.png" alt="Strum" width="180">
      </a>
    </td></tr>
    <tr><td align="center" style="padding: 20px 0px;">

        <div style="width: 100%; margin: auto;">
          <p style="line-height: 20px; font-size: 15px; text-align: center;">
            <b>${senderName}</b><br>has invited you to join the '${sessionTitle}'
          </p>
        </div>

        <a href="${url}">
          <p style="margin: 0px; background-color: #355BE4; border-radius: 48px; color: #FFFFFF; display: inline-block; font-size: 15px; font-weight: bold; text-align: center; text-decoration: none; width: 180px; line-height: 48px; mso-hide: all;">
            Accept Invite
          </p>
        </a>
      </td> </tr>
    <tr><td style="padding: 20px 60px;">
        <a href="${URLs.WEB_URL}" style="text-decoration: none;">
        <p style="line-height: 18px; font-size: 15px; text-align: center; color: #333333;">
          Strum - Audio Whiteboarding for Remote Teams
        </p>
      </a>
      </td> </tr>
    <tr><td style="padding: 0px 0px 40px 0px;">
        <p style="line-height: 18px; font-size: 12px; text-align: center; color: #333333;">
          <a href="${termsUrl}" style="text-decoration: none; color:355BE4;">Terms and Service </a> | 
          <a href="${privacyUrl}" style="text-decoration: none; color:355BE4;">Privacy policy </a> .
        </p>
      </td> </tr>
  </table>
  </p>
  `,
  resetPasswordEmail: (email: string, token: string) => `
  <p style="padding: 40px;">
  <table style="border: 1px solid #dddddd; border-radius: 12px; max-width: 500px; margin: auto;" 
    cellpadding="0" cellspacing="0" width="100%">
    <tr height="100px"><td align="center" style="padding-top: 40px;">
        <a href="http://strum.us/">
          <img src="http://resources.strum.us/email/logo.png" alt="Strum" width="180">
        </a>
    </td></tr>
    <tr><td style="padding: 20px 60px;">
        <div style="width: 100%; margin: auto;">
        <p style="line-height: 20px; font-size: 15px; text-align: center; color: #333333;">
          Hi ${email} now that you've created your account, it's time to create your password. Creating your password will confirm your email address if you haven't done so already. To create your password, click the button below.
        </p>
        </div>
      </td> </tr>
    <tr><td align="center">
        <a href="${URLs.APP_URL + '/setup-password?t=' + token}&&email=${email}">
          <p style="background-color: #355BE4; border-radius: 48px; color: #FFFFFF; display: inline-block; font-size: 15px; font-weight: bold; text-align: center; text-decoration: none; width: 180px; line-height: 48px; mso-hide: all;">
            Reset password
          </p>
          
        </a>
      </td> </tr>
    <tr><td style="padding: 10px 60px;">
        <a href="http://strum.us/" style="text-decoration: none;">
        <p style="line-height: 18px; font-size: 15px; text-align: center; color: #333333;">
          Strum - Audio whiteboarding for Remote teams
        </p>
      </a>
      </td> </tr>
    <tr><td style="padding: 0px 0px 40px 0px;">
        <p style="line-height: 18px; font-size: 12px; text-align: center; color: #333333;">
          <a href="${termsUrl}" style="text-decoration: none; color:355BE4;">Terms and Service </a> | 
          <a href="${privacyUrl}" style="text-decoration: none; color:355BE4;">Privacy policy </a> .
        </p>
      </td> </tr>
  </table>
  </p>
  `,
}

type FullNameType = {
  firstName?: string |undefined
  lastName?: string|undefined
  email?: string|undefined
}
export function fullName(props?: User) {
  if (!props) return ''
  if (props.firstName) {
    if (props.lastName) return props.firstName + ' ' + props.lastName
    return props.firstName
  }
  return props.lastName || props.email
}