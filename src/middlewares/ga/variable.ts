import { GACategory, GAFeatureAction, gaEvent } from '.'

import { GASettlementAction } from './EventConstant'

export const variableAnalyticsData = {
  startTrackTime: null,
  settlementTrigger: '',
}

export function endTrackMemberAnalytics() {
  const trackTime = variableAnalyticsData.startTrackTime
    ? Math.floor((Date.now() - variableAnalyticsData.startTrackTime) / 1000 % 60)
    : ''

  gaEvent(
    GACategory.Feature,
    GAFeatureAction.TrackMemberEnd,
    trackTime,
  )
}

export function startTrackMemberAnalytics() {
  variableAnalyticsData.startTrackTime = Date.now()
  gaEvent(
    GACategory.Feature,
    GAFeatureAction.TrackMemberStart,
    variableAnalyticsData.startTrackTime,
  )
}

export function setSettlementTriggerAnalytics(trigger: string) {
  variableAnalyticsData.settlementTrigger = trigger
}

export function settlementAnalytics(action: GASettlementAction, label: string) {
  gaEvent(
    GACategory.Settlement,
    action,
    variableAnalyticsData.settlementTrigger + ' > ' + label,
  )
}
