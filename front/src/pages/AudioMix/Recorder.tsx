import React, { useEffect, useRef, useState } from 'react'

export type RecorderType = {
  ready?: boolean
  streamRef?: React.MutableRefObject<MediaStream>
}

export function Recorder(props: RecorderType) {
  const chunkRef = useRef(null)
  const cachingRef = useRef([])
  const recorderRef = useRef<MediaRecorder>(null)
  const [audioUrl, setAudioUrl] = useState<string>(null)
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    recorderRef.current = new MediaRecorder(props.streamRef.current, { mimeType: 'audio/webm' })
    console.log(props.streamRef.current)
    recorderRef.current.onerror = (err) => {
      console.log({ err })
    }
    recorderRef.current.onstop = () => {
      console.log('stop')
    }
    recorderRef.current.ondataavailable = (e: BlobEvent) => {
      e.data.arrayBuffer().then((buffer) => {
        // chunk 5개씩만 보관하여 캐싱
        if (cachingRef.current?.length >= 5) {
          cachingRef.current.shift()
        }
        cachingRef.current.push(buffer)
        if (chunkRef.current) {
          chunkRef.current.push(buffer)
        }

        console.log(cachingRef.current)
        console.log(chunkRef.current)
      })
    }
    recorderRef.current.start(1000)

    return () => {
      if (recorderRef.current.state === 'recording') {
        recorderRef.current.stop()
      }
      props.streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const handleClick = () => {
    if (recording) {
      setRecording(false)
      handleStop()
    } else {
      setRecording(true)
      handleStart()
    }
  }

  const handleStart = () => {
    chunkRef.current = [...cachingRef.current]
  }

  const handleStop = () => {
    console.log(props.streamRef.current, props.streamRef.current.getTracks())
    if (recorderRef.current.state === 'recording') {
      recorderRef.current.stop()
    }
    const resultBlob = new Blob(chunkRef.current, { type: 'audio/mp3' })
    setAudioUrl(URL.createObjectURL(resultBlob))
    chunkRef.current = null
  }

  return (
    <div>
      <div
        className='px-4 py-2 cursor-pointer m-5 border border-primary text-primary max-w-max'
        onClick={handleClick}>
        {recording ? ' stop ' : 'start'}
      </div>

      <div>
        <audio src={audioUrl} controls />
      </div>
    </div>
  )
}
