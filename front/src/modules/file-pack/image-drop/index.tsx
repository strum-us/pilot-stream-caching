import { Condition, RelativeFull, relative } from '@strum/common'
import React, { createContext, useContext, useRef, useState } from 'react'

import { FileOverBox } from './FileOverBox'
import ReactDropzone from 'react-dropzone'
import shortid from 'short-uuid'
import styled from 'styled-components'

// import { useActiveFile } from '@modules/live-session/controllers/activeFiles'
// import { useEditorEvent } from '@modules/live-session/controllers/editorEvent'

const translator = shortid()

type Props = {
  children?
  className?: string
}

type DropedFile = {
  key: string
  path: string
  size: number
}

type ImageDropState = DropedFile[]
type Listener = (files: any[]) => void

export type ImageDropContextType = {
  dropedFiles: ImageDropState
  clearDropedFiles?: () => void
  setOnDropFiles?: (listener: Listener) => void
}

const ImageDropContext = createContext<ImageDropContextType>({
  dropedFiles: [],
})

export default function ImageDropProvider(props: Props) {
  const [isFileOver, setIsFileOver] = useState(false)
  const [dropedFiles, setDropedFiles] = useState<ImageDropState>([])
  const listenerDropFiles = useRef(null)
  // const editorEvent = useEditorEvent()
  // const { activeFileState: { currentFileId } } = useActiveFile()

  const onDrop = async (acceptedFiles: File[]) => {
    // console.log('onDrop', { acceptedFiles })
    setIsFileOver(false)

    // TODO: doc editor에서 고처야함 by isaac 2021-8-19
    // acceptedFiles.forEach((file) => {
    //   editorEvent.setFileClip(currentFileId, file, null, null)
    // })
  }

  const onDragEnter = () => {
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
    <ImageDropContext.Provider value={{ dropedFiles, clearDropedFiles, setOnDropFiles }}>
      <ReactDropzone
        onDragLeave={onDragLeave}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        noClick={true}
        accept={['.jpg', '.png', '.jpeg', '.gif']}
        maxSize={1024 * 1024 * 100}
        multiple={true}
      >
        {({ getRootProps, getInputProps }) => (
          <DropzoneContainer className={props.className} {...getRootProps({ className: 'dropzone' })}>
            <Condition value={isFileOver}>
              <FileOverBox/>
            </Condition>
            <DropzoneInput {...getInputProps()}/>
            <InnerContainer isFileOver={isFileOver}>
              { props.children }
            </InnerContainer>
          </DropzoneContainer>
        )}
      </ReactDropzone>
    </ImageDropContext.Provider>
  )
}

export function useImageDropContext() {
  return useContext(ImageDropContext)
}

const InnerContainer = styled(RelativeFull)`
  ${(props) => props.isFileOver ? 'opacity: 0.3;' : ''}
`

const DropzoneInput = styled.input`
`
const DropzoneContainer = styled.div`
${relative.position}
width: 100%;
`
