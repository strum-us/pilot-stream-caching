import { Condition, RelativeFull, relative } from '@strum/common'
import { FileType, getFileType } from './FileTypes'
import React, { createContext, useContext, useRef, useState } from 'react'
import ReactDropzone, { DropEvent } from 'react-dropzone'

import { FileOverBox } from './FileOverBox'
import shortid from 'short-uuid'
import styled from 'styled-components'

const translator = shortid()

type Props = {
  children?
  className?: string
}

type Point = {
  x: number
  y: number
}

type DropedFile = {
  key: string
  path: string
  size: number
  appendFileClip: boolean
  point: Point
}

type FileDropState = DropedFile[]
type Listener = (files: any[]) => void

export type FileDropContextType = {
  dropedFiles: FileDropState
  clearDropedFiles?: () => void
  setOnDropFiles?: (listener: Listener) => void
  onDrop?: (acceptedFiles: any, appendFileClip: boolean) => Promise<void>
}

const FileDropContext = createContext<FileDropContextType>({
  dropedFiles: [],
})

enum RejectCode {
  notSupported = 'notSupported',
  tooLarge = 'tooLarge'
}

/*
  function useLiveSesisonFileDropUpload(sessionId)
  1. listenerDropFiles ref에 리스너 등록,
  2. useSmartFileUpload: { onUploadBegan, onUploadFinished, onUploadAllFinished }
    리스너 등록하는 hooks
  -> 현재 provider 감싼 component에서 무조건 호출해서 리스너 Set 해줘야함
*/

export default function FileDropProvider(props: Props) {
  // const { editor } = props
  const [isFileOver, setIsFileOver] = useState(false)
  const [dropedFiles, setDropedFiles] = useState<FileDropState>([])
  const listenerDropFiles = useRef(null)
  const [rejectedFiles, setRejectedFiles] = useState<File[]>([])
  const dropPoint = useRef(null)

  const onDrop = async (acceptedFiles, appendFileClip: boolean) => {
    setIsFileOver(false)
    const rejected = []
    const accepted = []

    acceptedFiles?.forEach((file) => {
      const type = getFileType(file.name)
      const isAccept = [FileType.image, FileType.pdf].includes(type)
      // console.log('file drop ---', file.name, isAccept, type)
      if (isAccept) {
        file.key = `${translator.new()}`
        file.appendFileClip = appendFileClip
        file.point = dropPoint.current
        accepted.push(file)
      } else {
        rejected.push(file)
      }
    })

    const addedFiles = accepted?.map((file) => ({
      key: file.key,
      path: file.path,
      size: file.size,
      appendFileClip: appendFileClip,
      point: dropPoint.current,
    }))

    setDropedFiles([...dropedFiles, ...addedFiles])
    listenerDropFiles?.current(accepted)
    setRejectedFiles(rejected)
    dropPoint.current = null
  }

  const onDragEnter = (e) => {
    setIsFileOver(true)
  }

  const onDragLeave = () => {
    if (isFileOver) {
      setIsFileOver(false)
    }
  }

  const clearDropedFiles = () => {
    setDropedFiles([])
  }

  const setOnDropFiles = (listener: Listener) => {
    listenerDropFiles.current = listener
  }

  return (
    <FileDropContext.Provider value={{ onDrop, dropedFiles, clearDropedFiles, setOnDropFiles }}>
      <ReactDropzone
        onDragLeave={onDragLeave}
        onDragEnter={onDragEnter}
        onDrop={(acceptedFiles, _, event) => {
          const e = event as MouseEvent
          dropPoint.current = { x: e.clientX, y: e.clientY }
          onDrop(acceptedFiles, true)
        }}
        noClick={true}
        accept={'image/*, application/pdf'}
        maxSize={1024 * 1024 * 100}
        maxFiles={10}
        multiple={true}
      >
        {({ getRootProps, getInputProps, fileRejections }) => (
          <DropzoneContainer className={props.className} {...getRootProps({ className: 'dropzone' })}>
            <Condition value={isFileOver}>
              <FileOverBox />
            </Condition>
            {/* TODO: rejectfiles를 하위에서 띄울 수 있도록 유도해야함 by isaac 2021-8-17 */}
            {/* <RejectFiles fileRejections={fileRejections} notSupportedFormat={rejectedFiles}/> */}
            <DropzoneInput {...getInputProps()}/>
            <InnerContainer isFileOver={isFileOver}>
              { props.children }
            </InnerContainer>
          </DropzoneContainer>
        )}
      </ReactDropzone>
    </FileDropContext.Provider>
  )
}

export function useFileDropContext() {
  return useContext(FileDropContext)
}

const InnerContainer = styled(RelativeFull)`
  ${(props) => props.isFileOver ? 'opacity: 0.3;' : ''}
  width: 100%;
`

const DropzoneInput = styled.input`
`
const DropzoneContainer = styled.div`
  ${relative.position}
  min-height: 0px;
  height: 100%;
`
