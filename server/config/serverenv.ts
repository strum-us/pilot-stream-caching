export const whitelist = ['https://video-call-api.strum.us', 'https://issuenote.app', 'https://strum.us', 'http://localhost:3002', 'http://localhost:4000', 'http://localhost:5028', 'http://localhost:7777']
export const serviceName = 'Strum'
export const apiServerAddress = 'https://video-call-api.strum.us'
export const mailingRepEmail = 'info@strum.us'
export const feedbackRecipient = 'feedback.strum@gmail.com'
export const copywrite = 'ⓒ2021 Strum Technology Corp.'
export const termsUrl = 'https://strum.us/terms'
export const privacyUrl = 'https://strum.us/privacy'
export const Configs = {
  ENABLE_GUEST_AUTO_LOGIN: false,
}

const prodURls = {
  API_URL: 'https://video-call-api.strum.us',
  // slackbot: 같은 서버에 있기 때문에 localhost로 연결
  // SLACK_API_URL: 'https://video-call-api.strum.us/slackbot',
  SLACK_API_URL: 'http://localhost:3005',
  APP_URL: 'https://app.issuenote.app',
  WEB_URL: 'https://issuenote.app',
}

const devURls = {
  API_URL: 'http://localhost:3005',
  SLACK_API_URL: 'http://localhost:3006',
  APP_URL: 'http://localhost:5028',
  WEB_URL: 'https://issuenote.app',
}

export const URLs = (process.env.NODE_ENV === 'production') ? prodURls : devURls

export const MailService = {
  serviceName: 'Issuenote',
  invitationTitle: (senderName: string) => `[${MailService.serviceName}] ${senderName}`,
  invitationUrl: 'https://issuenote.app/downloadapp',
}

export const googleAuthScope: string[] = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  // 'https://www.googleapis.com/auth/contacts.other.readonly',
]
// export const tempSignIn: any = {}

// google oauth
export const googleSignInCallbackURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5028/auth/google/callback'
  : 'https://video-call-api.strum.us/quda/api/auth/google/callback'

export const clientDomain = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5028/oauth' // for devmode need to put '#', but in product, need to remove '#'
  : 'https://video-call-api.strum.us/quda/api/oauth'
