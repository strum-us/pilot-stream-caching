import * as dotenv from 'dotenv'

import { DemographyAction, GACategory, GAFeatureAction, GAFiletalkAction, GAFiletalkCategory, GASettlementAction } from './EventConstant'

import { URLs } from 'src/config/url'

// dotenv.config()

// const GA_TRACK_ID = process.env.GA_TRACK_ID
// const GA_SEND = process.env.GA_SEND

export const loadGA = () => {
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r
    i[r] = i[r] || function() {
      (i[r].q = i[r].q || []).push(arguments)
    }
    i[r].l = 1 * Date.now()
    a = s.createElement(o)
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

  ga('create', URLs.GA.GA_TRACK_ID, 'auto')
  URLs.GA.GA_SEND !== true && ga('set', 'sendHitTask', null)
}

export const gaEvent = (
  category: string | GACategory| GAFiletalkCategory,
  action: string | GAFeatureAction | GASettlementAction | DemographyAction | GAFiletalkAction,
  label?: any,
) => {
  window.ga && ga('send', 'event', category, action, label || '')
}

export const gaPage = (pathname: string): void => {
  window.ga && ga('send', {
    hitType: 'pageview',
    page: pathname,
  })
}
