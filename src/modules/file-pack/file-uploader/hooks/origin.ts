// import { ActionType, reducer } from '../reducer'
// import { useEffect, useReducer, useRef } from 'react'

// import axios from 'axios'

// const uploadConfig = {
//   uploadApiUrl: '',
//   timeout: 3000,
// }

// type FileCallback = (fileKey: string, url: string) => void

// export function setupUploader(uploadApiUrl: string) {
//   uploadConfig.uploadApiUrl = uploadApiUrl
// }

// type UploadFunc = () => void

// enum UploadItemState {
//   queued,
//   progressing,
// }
// type UploadQueueItem = {
//   state: UploadItemState
//   func: UploadFunc
// }

// export function useUploadFile() {
//   const [uploadFilesState, dispatch] = useReducer(reducer, {})
//   const finishCallback = useRef<FileCallback>(null)
//   const uploadQueue = useRef<UploadQueueItem[]>([])
//   const schedulerId = useRef(null)

//   // scheduler for upload queue
//   const startScheduler = () => {
//     if (schedulerId.current) return

//     // create new schedule
//     schedulerId.current = setInterval(async () => {
//       if (uploadQueue.current.length === 0) {
//         clearInterval(schedulerId.current)
//         schedulerId.current = null
//         return
//       }

//       const item = uploadQueue.current[0]
//       if (item.state === UploadItemState.progressing) return
//       await item.func()
//       uploadQueue.current.pop()
//     }, 500)
//   }

//   const addUploadFile = (fileKey: string, displayName: string) => {
//     dispatch({ type: ActionType.addUploadFile, payload: { fileKey, displayName } })
//   }
//   const setUploadPercent = (fileKey: string, percent: number) => {
//     console.log({ fileKey, percent })
//     dispatch({ type: ActionType.setUploadPercent, payload: { fileKey, percent } })
//   }
//   const finishUpload = (fileKey: string, url: string) => {
//     dispatch({ type: ActionType.finishUpload, payload: { fileKey, url } })
//   }

//   const onUploadFinished = (callback: FileCallback) => {
//     finishCallback.current = callback
//   }

//   const uploadFile = async (fileKey: string, file: any) => {
//     // init scheduler
//     startScheduler()

//     // push upload function into upload queue
//     return new Promise<string>((resolve, reject) => {
//       uploadQueue.current.push({
//         state: UploadItemState.queued,
//         func: async () => {
//           const CancelToken = axios.CancelToken
//           let cancel
//           const uploadTimeOut = setTimeout(() => {
//             cancel && cancel()
//           }, uploadConfig.timeout)
//           addUploadFile(fileKey, file.name)

//           try {
//             const formData = new FormData()
//             formData.append('file', file, file.name)

//             const result = await axios.post(`${uploadConfig.uploadApiUrl}`, formData, {
//               headers: {
//                 'content-type': 'multipart/form-data',
//               },
//               onUploadProgress: (progress) => {
//                 if (progress) {
//                   clearTimeout(uploadTimeOut)
//                   let status = 'uploading'
//                   if (progress.loaded === progress.total) {
//                     status = 'finish'
//                   }
//                   const percent = Math.floor(progress.loaded / progress.total * 100)
//                   // console.log(file.name, { percent, fileKey, progress })
//                   setUploadPercent(fileKey, percent)
//                 }
//               },
//               maxContentLength: Infinity,
//               cancelToken: new CancelToken((c) => {
//                 cancel = c
//                 console.log('TODO: cancel')
//               }),
//             })

//             const { url } = result.data
//             console.log('upload successed:', { url })
//             finishUpload(fileKey, url)
//           finishCallback?.current?.(fileKey, url)
//           resolve(url)
//           // return { url }
//           } catch (err) {
//             console.log('upload file error:', err)
//             cancel()
//             reject(err)
//           }
//         },
//       })
//     })
//   }

//   return {
//     uploadFilesState,
//     uploadFile,
//     onUploadFinished,
//   }
// }
