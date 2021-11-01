import { FileUploadActions, reducer } from '../reducer'
import React, { createContext, useContext, useReducer } from 'react'
import { UploadFilesState, initState } from '../reducer/types'

type FileUploadActionDispatch = React.Dispatch<FileUploadActions>

export type FileUploadContextType = {
  uploadFilesState: UploadFilesState
  dispatch: FileUploadActionDispatch
}

const FileUploadContext = createContext<FileUploadContextType>({ 
  uploadFilesState: initState(),
  dispatch: () => null,
})

export const FileUploadsProvider: React.FC = ({ children }) => {
  const [uploadFilesState, dispatch] = useReducer(reducer, {})

  return (
    <FileUploadContext.Provider value={{ uploadFilesState, dispatch }}>
      {children}
    </FileUploadContext.Provider>
  )
}

export function useFileUploadContext() {
  return useContext(FileUploadContext)
}
