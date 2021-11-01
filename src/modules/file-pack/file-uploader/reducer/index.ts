import { TypeMap } from '../../reducer'
import  { UploadFilesState } from './types'

// ---

export enum ActionType {
  addUploadFile = 'addUploadFile',
  setUploadPercent = 'setUploadPercent',
  finishUpload = 'finishUpload',
}

type Payload = {
  [ActionType.addUploadFile]: {
    fileKey: string
    displayName: string
  }
  [ActionType.setUploadPercent]: {
    fileKey: string
    percent: number,
  }
  [ActionType.finishUpload]: {
    fileKey: string
    url: string,
  }
}

export type FileUploadActions = TypeMap<Payload>[keyof TypeMap<Payload>]

export function reducer(state: UploadFilesState, action: TypeMap<Payload>[keyof TypeMap<Payload>]): UploadFilesState {
  switch (action.type) {
  case ActionType.addUploadFile: return {
    ...state,
    [action.payload.fileKey]: { percent: 0, url: null, displayName: action.payload.displayName },
  }
  case ActionType.setUploadPercent: {
    const { fileKey, percent } = action.payload
    let file = state[fileKey]
    if (file) {
      file.percent = percent
    } else {
      file = { percent, url: null, displayName: '' }
    }
    return { ...state, [fileKey]: file }
  }
  case ActionType.finishUpload:  {
    const { ...files } = state
    delete files[action.payload.fileKey]
    return { ...files }
  }
  default: return state
  }
}
