import React, { useEffect, useState } from 'react'

enum NotiState {
  none = 'none',
  offline = 'offline',
  online = 'online',
}

export function NetworkNotification() {
  const [notification, setNotification] = useState<NotiState>(NotiState.none) 

  useEffect(() => {
    window.onoffline = (e) => {
      console.log('NetworkNotification onoffline')
      setNotification(NotiState.offline)
      window.ononline = () => {
        console.log('NetworkNotification online')
        setNotification(NotiState.online)
      }
    }
  }, [])

  if (notification === NotiState.none) {
    return null
  }

  let notiContent: any = null
  if (notification === NotiState.offline) {
    notiContent = <p className='text-sm text-black'>
        Network is unstable, connect again
      </p>
  } else if (notification === NotiState.online) {
    const handleClick = () => {
      window.location.reload()
      setNotification(NotiState.none)
    }

    notiContent = <>
      <p className='text-sm text-black '>
        Network is unstable, connect again
      </p>
      <div className='flex flex-row-reverse'>
        <div className='btn btn-xs btn-negative' onClick={handleClick}>
          Reload
        </div>
      </div>
    </>
  }
  
  return (
    <div className="absolute z-50 p-3 bg-white rounded shadow-md max-w-200 right-3 top-3">
      {notiContent}
    </div>
  )
}