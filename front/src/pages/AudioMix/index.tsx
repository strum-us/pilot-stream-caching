import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Recorder } from '../Dashboard/Recorder'

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

  useLayoutEffect(() => {
    const audioContext = new AudioContext()
    const list = Object.keys(streams)
      ?.filter((id) => streams[id].joined)
      ?.map((id) => streams[id].stream)
    console.log({ list })
    const mixedTrack = mixAudio(audioContext, list)

    recordedStream.current.getTracks().forEach((track: MediaStreamTrack) => {
      recordedStream.current.removeTrack(track)
    })

    recordedStream?.current.addTrack(mixedTrack)
    audioRef.current.srcObject = recordedStream.current
  }, [streams])

  // const replaceTrack = (recorder: MediaRecorder) => {
  //   recorder.stream.rep
  // }

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
        joinedIds?.length > 0 && <Recorder ready={true} streamRef={recordedStream} />
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
