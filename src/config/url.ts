import * as dotenv from 'dotenv'

dotenv.config()

// console.log(process.env)
export const WEB_URL = process.env.WEB_URL

const SeoulProductionAWSURLs = {
  API_URL: 'https://api.issuenote.app/quda',
  GRAPHQL_URL: 'https://api.issuenote.app/quda/graphql',
  SUBSCRIPTION_URL: 'wss://api.issuenote.app/quda/subscription',
  FILE_UPLOAD_URL: 'https://api.issuenote.app/strum-upload',

  DOWNLOAD_URL: 'https://download.issuenote.app',

  LIVESESSION_API_URL: 'https://api.strum.us/live-session',
  LIVESESSION_GRAPHQL_URL: 'https://api.strum.us/live-session/graphql',
  LIVESESSION_SUBSCRIPTION_URL: 'wss://api.strum.us/live-session/subscription',

  SLACKBOT_API_URL: 'https://api.strum.us/slackbot',

  VIDEO_CALL_URL: 'wss://video-call-api.strum.us',
  SCREEN_SHARE_URL: 'wss://video-call-api.strum.us',
  LIVEACTION_URL: 'wss://video-call-api.strum.us',

  APP_URL: 'https://issuenote.app',

  GA: {
    SERVICE_TITLE: 'QUDA',
    GA_TRACK_ID: 'UA-171515846-2',
    GA_SEND: true,
    PIXEL_ID: 628073784458320,
    PIXEL_SEND: true,
  },
}

const DevelopmentLocalURLs = {
  API_URL: 'http://localhost:3030',
  GRAPHQL_URL: 'http://localhost:3030/graphql',
  SUBSCRIPTION_URL: 'ws://localhost:3030/subscription',
  // FILE_UPLOAD_URL: 'http://localhost:8000',
  FILE_UPLOAD_URL: 'https://api.issuenote.app/strum-upload',

  DOWNLOAD_URL: 'https://download.issuenote.app',

  LIVESESSION_API_URL: 'http://localhost:3004',
  LIVESESSION_GRAPHQL_URL: 'http://localhost:3004/graphql',
  LIVESESSION_SUBSCRIPTION_URL: 'ws://localhost:3004/subscription',
  SLACKBOT_API_URL: 'http://localhost:3005',

  VIDEO_CALL_URL: 'wss://video-call-api.strum.us',
  LIVEACTION_URL: 'wss://video-call-api.strum.us',
  SCREEN_SHARE_URL: 'wss://video-call-api.strum.us',
  // VIDEO_CALL_URL: 'http://localhost:8001',
  // LIVEACTION_URL: 'http://localhost:8001',
  // SCREEN_SHARE_URL: 'http://localhost:8001',

  APP_URL: 'http://localhost:5028',
  GA: {
    SERVICE_TITLE: 'QUDA',
    GA_TRACK_ID: 'UA-171515846-9',
    GA_SEND: true,
    PIXEL_ID: 628073784458320,
    PIXEL_SEND: true,
  },
}

const URLs = process.env.NODE_ENV === 'development' ? DevelopmentLocalURLs : SeoulProductionAWSURLs

export { URLs }
