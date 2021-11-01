// import { Condition, RelativeFull } from '@strum/common'
// import React, { createContext, useContext, useRef, useState } from 'react'

// import { FileOverBox } from './FileOverBox'
// import ReactDropzone from 'react-dropzone'
// import shortid from 'short-uuid'
// import styled from 'styled-components'

// const translator = shortid()

// type Props = {
//   children?
//   className?: string
// }

// type DropedFile = {
//   key: string
//   path: string
//   size: number
// }

// type FileDropState = DropedFile[]
// type Listener = (files: any[]) => void

// export type FileDropContextType = {
//   dropedFiles: FileDropState
//   clearDropedFiles?: () => void
//   setOnDropFiles?: (listener: Listener) => void
//   onDrop?: (acceptedFiles: any) => Promise<void>
// }

// const FileDropContext = createContext<FileDropContextType>({
//   dropedFiles: [],
// })

// export default function FileDropProvider(props: Props) {
//   const [isFileOver, setIsFileOver] = useState(false)
//   const [dropedFiles, setDropedFiles] = useState<FileDropState>([])
//   const listenerDropFiles = useRef(null)

//   const onDrop = async (acceptedFiles) => {
//     setIsFileOver(false)
//     acceptedFiles.forEach((file) => {
//       file.key = `${translator.new()}`
//     })
//     const addedFiles = acceptedFiles.map((file) => ({ key: file.key, path: file.path, size: file.size }))
//     setDropedFiles([...dropedFiles, ...addedFiles])
//     listenerDropFiles?.current(acceptedFiles)
//   }

//   const onDragEnter = () => {
//     setIsFileOver(true)
//   }

//   const onDragLeave = () => {
//     if (isFileOver) {
//       setIsFileOver(false)
//     }
//   }

//   const clearDropedFiles = () => {
//     setDropedFiles([])
//   }

//   const setOnDropFiles = (listener: Listener) => {
//     listenerDropFiles.current = listener
//   }

//   return (
//     <FileDropContext.Provider value={{ onDrop, dropedFiles, clearDropedFiles, setOnDropFiles }}>
//       <ReactDropzone
//         onDragLeave={onDragLeave}
//         onDragEnter={onDragEnter}
//         onDrop={onDrop}
//         noClick={true}
//         accept={['image/*', 'application/pdf']}
//         maxSize={1024 * 1024 * 100}
//         multiple={true}
//       >
//         {({ getRootProps, getInputProps }) => (
//           <RelativeFull className={props.className} {...getRootProps({ className: 'dropzone' })}>
//             <Condition value={isFileOver}>
//               <FileOverBox/>
//             </Condition>
//             <DropzoneInput {...getInputProps()}/>
//             <InnerContainer isFileOver={isFileOver}>
//               { props.children }
//             </InnerContainer>
//           </RelativeFull>
//         )}
//       </ReactDropzone>
//     </FileDropContext.Provider>
//   )
// }

// export function useFileDropContext() {
//   return useContext(FileDropContext)
// }

// const InnerContainer = styled(RelativeFull)`
//   ${(props) => props.isFileOver ? 'opacity: 0.3;' : ''}
// `

// const DropzoneInput = styled.input`
// `
