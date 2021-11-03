import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

// import { Recorder } from './Recorder'

export function AudioMix() {
  const [devices, setDevices] = useState(null)

  const updateDeviceList = async () => {
    const deviceList = []
    const deviceData = await getDevicesData()
    deviceData.forEach((device) => {
      const [, type, direction] = device.kind.match(/(\w+)(input|output)/i)
      if (direction === 'input' && type === 'audio') {
        deviceList.push({ name: device.label, id: device.deviceId })
      }
    })
    setDevices(deviceList)
  }

  useEffect(() => {
    updateDeviceList()

    navigator.mediaDevices.ondevicechange = (event) => {
      console.log('')
      updateDeviceList()
    }
  }, [])

  return (
    <div>
      <AudioPlayerList devices={devices} />
    </div>
  )
}

type AudioPlayerListProps = {
  devices: DeviceType[]
}

function AudioPlayerList(props: AudioPlayerListProps) {
  const audioStreamRef = useRef<AudioStreamRefType>({})
  const [streams, setStreams] = useState<AudioStreamRefType>({})
  const recordedStream = useRef<MediaStream>(new MediaStream())
  const audioRef = useRef(null)
  const recorderRef = useRef<MediaRecorder>(null)

  const changeStream = () => {

  }
  useLayoutEffect(() => {
    const audioContext = new AudioContext()
    const list = Object.keys(streams)
      ?.filter((id) => streams[id].joined)
      ?.map((id) => streams[id].stream)
    const mixedTrack: MediaStreamTrack = mixAudio(audioContext, list)

    if (recorderRef?.current?.state === 'recording') {
      recorderRef?.current?.pause()
    }
    recordedStream?.current.addTrack(mixedTrack)

    recordedStream.current.getTracks().forEach((track: MediaStreamTrack) => {
      if (track.id !== mixedTrack.id) {
        recordedStream.current.removeTrack(track)
      }
    })

    if (recorderRef?.current?.state === 'paused') {
      recorderRef?.current?.resume()
    }
    audioRef.current.srcObject = recordedStream.current
  }, [streams])

  const mixAudio = (audioContext, streams: MediaStream[]) => {
    const destination = audioContext.createMediaStreamDestination()
    streams.forEach((stream) => {
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(destination)
    })
    const tracks = destination.stream.getAudioTracks()

    return tracks && tracks[0]
  }

  const joinUser = async (deviceId: string) => {
    const oldStream = streams?.[deviceId]?.stream
    oldStream && oldStream?.getTracks().forEach((track) => { track?.stop() })

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: deviceId }, video: false,
    })

    setStreams({
      ...streams,
      [deviceId]: { stream: localStream, joined: true },
    })
  }

  const leaveUser = (deviceId: string) => {
    const oldStream = streams?.[deviceId]?.stream
    oldStream && oldStream?.getTracks().forEach((track) => { track?.stop() })
    setStreams({
      ...streams,
      [deviceId]: { stream: null, joined: false },
    })
  }

  const joinedIds = Object.keys(streams)?.filter((id) => streams[id].joined)
  return (
    <div className={'flex flex-col space-y-2 m-4'}>
      {props?.devices && props.devices?.map((device) => {
        return (
          <AudioPlayer
            device={device}
            key={'device-' + device.id}
            streams={streams}

            joinUser={joinUser}
            leaveUser={leaveUser}
            audioStreamRef={audioStreamRef}
          />
        )
      })}

      <p>joinedUser: <br />{joinedIds?.join(' ')}</p><br />
      recorder <br /><br />
      {
        joinedIds?.length > 0 && <Recorder recorderRef={recorderRef} ready={true} streamRef={recordedStream} />
      }

      player
      <audio controls ref={audioRef} autoPlay muted />
    </div>
  )
}

type AudioPlayerProps = {
  device: DeviceType,
  audioStreamRef: React.MutableRefObject<AudioStreamRefType>
  streams: AudioStreamRefType
  joinUser: (id: string) => void
  leaveUser: (id: string) => void
}

function AudioPlayer(props: AudioPlayerProps) {
  const {
    device, audioStreamRef, streams,
    joinUser, leaveUser,
  } = props

  const handleClick = async () => {
    const joined = !streams?.[device.id]?.joined

    if (joined) {
      joinUser(device.id)
    } else {
      leaveUser(device.id)
    }
  }

  useEffect(() => {
    audioStreamRef.current[device.id] = { stream: null, joined: false }
    // const data = audioStreamRef.current[device.id]
  }, [])

  return (
    <div className={'flex flex-row space-x-1'} >
      <div className={' p-1 w-12 cursor-pointer'} onClick={handleClick}>
        {streams?.[device.id]?.joined ? 'leave' : 'join'}
      </div>
      <div className={'bg-primary text-white p-1'}>
        {device?.name}
      </div>

      <audio controls className='h-9' />
    </div>
  )
}

async function getDevicesData(): Promise<MediaDeviceInfo[]> {
  return await navigator.mediaDevices.enumerateDevices()
}

type DeviceType = {
  name: string, id: string
}

type AudioStreamRefType = {
  [id: string]: {
    stream: MediaStream
    joined: boolean
  }
}

export type RecorderType = {
  ready?: boolean
  streamRef?: React.MutableRefObject<MediaStream>
  recorderRef?: React.MutableRefObject<MediaRecorder>
}

export function Recorder(props: RecorderType) {
  const { recorderRef } = props
  const chunkRef = useRef(null)
  const cachingRef = useRef([])
  const [audioUrl, setAudioUrl] = useState<string>(null)
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    recorderRef.current = new MediaRecorder(props.streamRef.current, { mimeType: 'audio/webm' })
    console.log(props.streamRef.current, recorderRef.current)
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
        className='px-4 py-2 m-5 border cursor-pointer border-primary text-primary max-w-max'
        onClick={handleClick}>
        {recording ? ' stop ' : 'start'}
      </div>

      <div>
        <audio src={audioUrl} controls />
      </div>
    </div>
  )
}
