import React, { useEffect, useRef, useState } from 'react'

import { start } from 'repl'

export function Dashboard() {
  return (
    <div>
      <Recorder />
    </div>
  )
}

function Recorder() {
  const chunkRef = useRef([])
  const cachingRef = useRef([])
  const recorderRef = useRef<MediaRecorder>(null)
  const localStream = useRef<MediaStream>(null)
  const [audioUrl, setAudioUrl] = useState<string>(null)
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      localStream.current = stream

      recorderRef.current = new MediaRecorder(localStream.current, { mimeType: 'audio/webm' })
      recorderRef.current.onerror = (err) => {
        console.log({ err })
      }
      recorderRef.current.onstop = () => {
        console.log('stop')
      }
      recorderRef.current.ondataavailable = (e: BlobEvent) => {
        e.data.arrayBuffer().then((buffer) => {
          // chunk 10개씩만 보관하여 캐싱
          if (cachingRef.current?.length >= 10) {
            cachingRef.current.shift()
          }
          cachingRef.current.push(buffer)
          chunkRef.current.push(buffer)

          console.log(cachingRef.current)
          console.log(recording, chunkRef.current)
        })
      }
      recorderRef.current.start(1000)
    })
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
    recorderRef.current.stop()
    const resultBlob = new Blob(chunkRef.current, { type: 'audio/mp3' })
    setAudioUrl(URL.createObjectURL(resultBlob))
  }

  return (
    <div>
      <div
        className='px-4 py-2 cursor-pointer m-5 bg-primary text-white max-w-max'
        onClick={handleClick}>
        {recording ? ' stop ' : 'start'}
      </div>

      <div>
        <audio src={audioUrl} controls />
      </div>
    </div>
  )
}
