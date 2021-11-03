import { BrowserRouter, HashRouter, useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import { AppFrame } from './AppFrame'
import { AutoUpdateNotification } from './AutoUpdateNotification'
// import { AutoUpdateNotification } from './AutoUpdateNotification'
import { NetworkNotification } from './NetworkNotification'
import Routes from './Routes'

export default function Root() {
  console.log({ isElectron })
  return (
    <React.StrictMode>
      {/* <div>open-router: {history?.location?.pathname} </div> */}
      <Router>
        {/* <ElectronGateway> */}
        {isElectron
          ? <AutoUpdateNotification />
          : null
        }
        {/* </ElectronGateway> */}
        {/* <NetworkNotification/> */}
        <AppFrame>
          <Routes />
        </AppFrame>
      </Router>
    </React.StrictMode>
  )
}

export const isElectron = process.env.IS_ELECTRON
function Router({ children }) {
  if (isElectron) {
    return (
      <HashRouter>
        {children}
      </HashRouter>
    )
  }

  return (
    <HashRouter>
      {children}
    </HashRouter>
  )
}