import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router'

enum Status {
  none = 'none',
  checking = 'checking',
  available = 'available',
  notavailable = 'notavailable',
  downloaded = 'downloaded',
}

type NotificationStatus = {
  status: Status,
  progress: any,
  close: boolean
}

export function AutoUpdateNotification() {
  const [notification, setNotification] = useState<NotificationStatus>({ 
    status: Status.none, 
    progress: 0, 
    close: false
  }) 
  
  const electron = require('electron')

  const handleNotificationStatus = (status: Status) => {
    setNotification({ status: status, progress: 0, close: false})
  }

  useEffect(() => {
    console.log('useEffect: set auto updater event')

    electron.ipcRenderer.on('checking-for-update', () => {
      alert('check for update.')
      console.log('checking-for-update --- notification')
      electron.ipcRenderer.removeAllListeners('checking-for-update')
      handleNotificationStatus(Status.checking)
    })
    
    electron.ipcRenderer.on('update-not-available', () => {
      console.log('update-not-available --- notification')
      electron.ipcRenderer.removeAllListeners('update-not-available')
      handleNotificationStatus(Status.notavailable)
    })

    electron.ipcRenderer.on('update-available', () => {
      console.log('update-available --- notification')
      electron.ipcRenderer.removeAllListeners('update-available')
      handleNotificationStatus(Status.available)
    })

    electron.ipcRenderer.on('update-downloaded', () => {
      console.log('update-downloaded --- notification')
      electron.ipcRenderer.removeAllListeners('update-downloaded')
      handleNotificationStatus(Status.downloaded)
    })

    electron.ipcRenderer.on('download-progress', (event, args) => {
      // const progressObj
      console.log('download-progress --- notification')
      electron.ipcRenderer.removeAllListeners('download-progress')
      // handleNotificationStatus(Status.downloaded)
      // handleProgress()
    })

    electron.ipcRenderer.send('check-update')
  }, [])

  if (notification.status === Status.none || notification.status === Status.notavailable) {
    return null
  }

  let notiContent: any = null
  if (notification.status === Status.available) {
    notiContent = <p className='text-sm text-black'>
        A new update is available. <br/>
        Downloading now... {notification?.progress !== 0 ? notification?.progress + '%' : null}
      </p>
  } else if (notification.status === Status.downloaded) {
    const handleClick = () => {
      electron.ipcRenderer.send('restart-app')
      handleNotificationStatus(Status.none)
    }

    notiContent = <>
      <p className='text-sm text-black '>
        Update Downloaded. It will be installed on restart. Restart now?
      </p>
      <div className='flex flex-row-reverse'>
        <div className='btn btn-xs btn-primary' onClick={handleClick}>
          restart
        </div>
      </div>
    </>
  }
  
  const handleClose = () => {
    setNotification({...notification, close: true})
  }
  
  return (
    <div className={`absolute z-50 p-3 bg-white rounded-lg shadow-lg min-w-max max-w-200 left-3 bottom-3 ${notification?.close ? 'invisible': ''}` } >
      <div className='relative w-full h-full'>
        <div className='pr-6 '>
          {notiContent}
        </div>
        <div 
          className='absolute top-0 right-0 flex flex-row items-center justify-center w-5 h-5 text-black rounded cursor-pointer hover:bg-dim-light hover:bg-opacity-70' 
          onClick={handleClose}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4L14.6 16L8 22.6L9.4 24L16 17.4L22.6 24L24 22.6L17.4 16L24 9.4Z" fill="currentColor"/>
          </svg>

        </div>
      </div>
    </div>
  )
}