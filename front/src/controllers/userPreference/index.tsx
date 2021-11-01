import { FeedbackNoteListingOptions, FeedbackSourceListingOptions } from 'src/graphql-types'
import { PopupModal, safeReadJson, safeWriteJson } from '@strum/common'
import React, { SetStateAction, createContext, useContext, useEffect, useState } from 'react'

import { mergeDeep } from './mergeDeep'

export type SourcePreference = {
  selectedIssue: number
}

type SourcePreferenceMap = {
  [key: number]: SourcePreference
}

export type NotePreference = {
  selectedSourceId: number
  sources: SourcePreferenceMap
}

type NotePreferenceMap = {
  [key: string]: NotePreference
}

export type PreferenceState = {
  dashboardTab?: DashboardTab
  showSourceList?: boolean
  showNoteList?: boolean
  noteListingOptions?: FeedbackNoteListingOptions
  sourceListingOptions?: FeedbackSourceListingOptions
  // lastNoteId: string
  sourceViewStyle?: 'Editing' | 'Flow'
  workspaceMode?: 'Stats' | 'Kanban' | 'Workspace' | 'Shares'
  lastSourceId?: number
  notes?: NotePreferenceMap
}

type UserPreferenceContextType = {
  project?: any
  preference?: PreferenceState
  setPreference?: (value: SetStateAction<PreferenceState>) => void
}

const UserPreferenceContext = createContext<UserPreferenceContextType>({
  project: null,
  preference: null,
  setPreference: null,
})

export enum DashboardTab {
  search,
  updates,
  settings,
  projects,
  library,
  account,
}

const initValues = () => {
  const init: PreferenceState = {
    noteListingOptions: {
      offset: 0, limit: 50, includeNumberOfSources: true, includeLastSource: true, orderBy: 'createdAt', order: 'DESC',
    },
    sourceListingOptions: {
      offset: 0, limit: 50, order: 'ASC', includeIssues: true, includeCreator: true,
    },
    sourceViewStyle: 'Flow',
    workspaceMode: 'Kanban',
  }
  const defaultValues = {
    noteListingOptions: { orderBy: 'createdAt', order: 'DESC'  },
    sourceListingOptions: {
      offset: 0, limit: 50, order: 'ASC', orderBy: 'order', includeIssues: true, includeCreator: true, referenceSourceId: null,
    },
  }
  // const values:PreferenceState = { ...init, ...(safeReadJson<PreferenceState>('user-preference')), ...defaultValues }
  const values:PreferenceState = mergeDeep(mergeDeep(init, (safeReadJson<PreferenceState>('user-preference'))), defaultValues)
  if (!values.noteListingOptions) {
    values.noteListingOptions = init.noteListingOptions
  }
  return values
}
const intialalValues = initValues()

export function UserPreferenceProvider({ children }) {
  const [dashboardTab, setDashboardTab] = useState(DashboardTab.library)
  const [curProject, setProject] = useState(null)

  const [preference, setPreference_] = useState<PreferenceState>(intialalValues)

  const setPreference = (value: PreferenceState) => {
    setPreference_(value)
    safeWriteJson<PreferenceState>('user-preference', value)
  }

  // useEffect(() => {
  //   return () => {
  //     safeWriteJson<PreferenceState>('user-preference', preference)
  //   }
  // })

  return (
    <UserPreferenceContext.Provider
      value={{
        project: {
          dashboardTab,
          setDashboardTab,
          curProject,
          setProject,
        },
        preference,
        setPreference,
      }}>
      {children}
    </UserPreferenceContext.Provider>
  )
}

export const useUserPreferenceContext = () => useContext(UserPreferenceContext)
