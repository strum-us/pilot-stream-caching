import React, { useEffect, useState } from 'react'

export function AudioMix() {
  const [devices, setDevices] = useState(null)

  useEffect(() => {
    getDevicesData().then((devices) => {
      const deviceList = []
      devices.forEach((device) => {
        const option = document.createElement('option')
        option.value = device.deviceId
        option.text = device.label

        const [, type, direction] = device.kind.match(/(\w+)(input|output)/i)
        if (direction === 'input' && type === 'audio') {
          deviceList.push({ name: device.label, id: device.deviceId })
        }
      })

      setDevices(deviceList)
    })
  }, [])
  return (
    <div>
      <AudioPlayerList devices={devices} />
    </div>
  )
}

type AudioPlayerListType = {
  devices: { name: string, id: string }[]
}

function AudioPlayerList(props: AudioPlayerListType) {
  console.log({ props })

  return (
    <div className={'flex flex-col space-y-2'}>
      {props?.devices && props.devices?.map((device) => {
        return (
          <div className={'flex flex-row'} key={'device-' + device.id}>
            <div className={'bg-primary text-white p-1'}>
              {device?.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

async function getDevicesData(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices()

  return devices
}
