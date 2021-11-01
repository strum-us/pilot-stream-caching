import { useEffect, useRef }  from 'react'

import { UploadResult } from '../hooks'
import { getBaseName } from '@strum/common'
import { useFileDrop } from '../../filedrop/hooks'
import { useUploadFile } from '..'

type UploadBeganListener = (files: any[]) => void
type UploadAllFisnishedListener = (result: UploadResult[]) => void

export function useSmartFileUpload() {
  const { dropedFiles, setOnDropFiles } = useFileDrop()
  const { uploadFiles, uploadFilesState, onUploadFinished } = useUploadFile()
  const onBeginListener = useRef<UploadBeganListener>(null)
  const onUploadAllFinishedListener = useRef<UploadAllFisnishedListener>(null)

  const onUploadBegan = (listener: UploadBeganListener) => {
    onBeginListener.current = listener
  }
  const onUploadAllFinished = (listener: UploadAllFisnishedListener) => {
    onUploadAllFinishedListener.current = listener
  }

  useEffect(() => {
    setOnDropFiles(async (files) => {
      // console.log('setOnDropFiles: editor ?', editor)
      // if (editor) { return }
      let result: UploadResult[]
      try {
        // console.log('start uploading', { files })
        onBeginListener.current && onBeginListener.current(files)

        // files.forEach((file) => console.log({ file }))
        var ext = (filename: string) => filename.split('.').pop()

        result = await uploadFiles(files.map((file) => ({ file, key: file.key, name: file.key + '.' + ext(file.name), fails: file.fails })))
        // console.log('file uploaded completed')
      } catch (err) {
        result = await uploadFiles(files.map((file) => ({ file, key: file.key, name: file.key + '.' + ext(file.name), fails: file.fails })))
      }
      onUploadAllFinishedListener.current && onUploadAllFinishedListener.current(result)
    })
  }, [])

  // const dropFilesUploads = dropedFiles.map((file) => {
  //   const uploadState = uploadFilesState[file.key]
  //   return {
  //     key: file.key,
  //     name: getBaseName(file.path),
  //     size: file.size,
  //     percent: uploadState?.percent,
  //     url: uploadState?.url,
  //     // appendFileClip: file.appendFileClip,
  //   }
  // })

  const fileStates = Object.keys(uploadFilesState).map((key) => {
    const file = dropedFiles.find((file) => file.key === key)
    return {
      ...uploadFilesState[key],
      name: getBaseName(file?.path),
      size: file?.size,
      key,
    }
  })

  return {
    // uploadFilesState,
    // dropFilesUploads,
    uploadFiles,
    fileStates,
    onUploadBegan,
    onUploadFinished,
    onUploadAllFinished,
  }
}
