import { ActionType, reducer } from '../reducer'
import { useEffect, useReducer, useRef } from 'react'

import axios from 'axios'
import { useFileUploadContext } from '../.providers'

const uploadConfig = {
  uploadApiUrl: '',
  timeout: 3000,
}

type FileCallback = (fileKey: string, url: string) => void

export function setupUploader(uploadApiUrl: string) {
  uploadConfig.uploadApiUrl = uploadApiUrl
}

type UploadFunc = () => void

enum UploadItemState {
  queued,
  progressing,
}
type UploadQueueItem = {
  state: UploadItemState
  func: UploadFunc
}

export type UploadFile = {
  key: string
  name: string
  file: any // file for uploading
}

export type UploadResult = {
  fileKey: string
  url: string
  fails: boolean
}

export function useUploadFile() {
  const { uploadFilesState, dispatch } = useFileUploadContext()
  const finishCallback = useRef<FileCallback>(null)
  const uploadQueue = useRef<UploadQueueItem[]>([])

  // console.log({ uploadFilesStateIn: uploadFilesState })

  const addUploadFile = (fileKey: string, displayName: string) => {
    dispatch({ type: ActionType.addUploadFile, payload: { fileKey, displayName } })
  }
  const setUploadPercent = (fileKey: string, percent: number) => {
    dispatch({ type: ActionType.setUploadPercent, payload: { fileKey, percent } })
  }
  const finishUpload = (fileKey: string, url: string) => {
    dispatch({ type: ActionType.finishUpload, payload: { fileKey, url } })
  }

  const onUploadFinished = (callback: FileCallback) => {
    finishCallback.current = callback
  }

  const uploadSingleFile = async (fileKey: string, file: any) => {
    return new Promise<UploadResult>((resolve, reject) => {
      const CancelToken = axios.CancelToken
      let cancel
      const uploadTimeOut = setTimeout(() => {
        cancel && cancel()
      }, uploadConfig.timeout)
      addUploadFile(fileKey, file.name)

      try {
        const formData = new FormData()
        formData.append('file', file, fileKey)

        axios.post(`${uploadConfig.uploadApiUrl}`, formData, {
          headers: {
            'content-type': 'multipart/form-data',
          },
          onUploadProgress: (progress) => {
            if (progress) {
              clearTimeout(uploadTimeOut)
              let status = 'uploading'
              if (progress.loaded === progress.total) {
                status = 'finish'
              }
              const percent = Math.floor(progress.loaded / progress.total * 100)
              // console.log(file.name, { percent, fileKey, progress })
              setUploadPercent(fileKey, percent)
            }
          },
          maxContentLength: Infinity,
          cancelToken: new CancelToken((c) => {
            cancel = c
            // console.log('TODO: cancel')
          }),
        }).then((result) => {
          const { url } = result.data
          // console.log('upload successed:', { url })
          finishUpload(fileKey, url)
          finishCallback?.current?.(fileKey, url)
          resolve({ fileKey, url, fails: false })
        }).catch((err) => {
          reject(err)
        })
      } catch (err) {
        // console.log('upload file error:', err)
        cancel()
        reject(err)
      }
    })
  }

  const uploadFiles = async (files: UploadFile[]) => {
    const result: UploadResult[] = []
    for (const file of files) {
      const { fileKey, url, fails } = await uploadSingleFile(file.name, file.file)
      result.push({ fileKey, url, fails })
    }
    return result
  }

  return {
    uploadFilesState,
    uploadFiles,
    uploadSingleFile,
    onUploadFinished,
  }
}
