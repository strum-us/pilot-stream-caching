import React, { useEffect, useRef, useState } from 'react'

import { Recorder } from './Recorder'

export function Dashboard() {
  const [ready, setReady] = useState(false)
  const loacalStreamRef = useRef<MediaStream>(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      loacalStreamRef.current = stream
    })
  }, [])

  return (
    <div>
      <div
        className='px-4 py-2 cursor-pointer m-5 bg-primary text-white max-w-max'
        onClick={() => setReady(!ready)}
      >
        {ready ? 'leave' : 'join'}
      </div>
      {
        ready && <Recorder ready={ready} streamRef={loacalStreamRef} />
      }
    </div>
  )
}
