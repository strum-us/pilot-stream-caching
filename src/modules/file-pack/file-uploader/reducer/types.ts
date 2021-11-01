
export type UploadFileState = {
  percent: number
  displayName: string
  url: string
}

export type UploadFilesState = {
  [key: string]: UploadFileState
}

export function initState(): UploadFilesState {
  return {}
}
