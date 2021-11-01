// src/electron.js
const { shell, screen, app, BrowserWindow, globalShortcut, nativeImage, ipcMain, Tray, systemPreferences } = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const path = require('path')
const url = require('url')
const os = require('os')
const ElectronLog = require('electron-log')
const isPackaged = app.isPackaged
const isMac = process.platform === 'darwin'
const DEV_HOST = 'http://localhost:7777'
const AutoLaunch = require('auto-launch')
let forceQuit = false

let mainWindow = null
let trayWindow = null
let captureWins = []
let tray = null

let openUrl = null

// ###########################################################################################
// ###########################################################################################

function initAutoUpdater() {
  log.info('initAutoUpdater')

  if (isPackaged) {
  } else {
    // 개발환경일경우 설정파일이 없어서 에러 index.js와 같은 폴더에 앱업데이트 설정을 넣어둬 해결
    // autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml')
  }

  autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update ..')
    // autoUpdater.setFeedURL(`https://${package.build.publish.bucket}.s3.${package.build.publish.region}.amazonaws.com`)
  })

  autoUpdater.on('update-available', () => {
    log.info('update-available')
    global.autoUpdater2 = 'true'
    if (mainWindow) {
      mainWindow.webContents.send('update-available')
    }
  })

  autoUpdater.on('update-not-available', () => {
    global.autoUpdater3 = 'true'
    log.info('update-not-available')
    if (mainWindow) {
      mainWindow.webContents.send('update-not-available')
    }
  })

  autoUpdater.on('error', (err) => {
    log.info('err')
    global.autoUpdater4 = 'true'
    log.error(err.toString())
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded')

    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded')
    }
  })
  autoUpdater.on('download-progress', (progressObj) => {
  //   let log_message = 'download-progress' + progressObj.bytesPerSecond
  //   log_message = log_message + ' - current ' + progressObj.percent + '%'
  //   log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    log.info('download-progress' + progressObj.percent)
    if (mainWindow) {
      mainWindow.webContents.send('download-progress', { progressObj })
    }
  })

  // ipcMain ------------------------------------------------
  ipcMain.on('app-version', (event) => {
    event.sender.send('app-version', { version: app.getVersion() })
  })

  ipcMain.on('restart-app', () => {
    log.info('restart !!')
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('check-update', () => {
    autoUpdater.checkForUpdates()
  })

  autoUpdater.checkForUpdates()
  global.checkForUpdates = 'true'
}

function initOpenUrl() {
  // log.info('initOpenUrl ', openUrl)
  // if (openUrl) {
  //   mainWindow.webContents.send('submitted-form', openUrl)
  // }
}

// function initSystemAccess() {
//   ipcMain.on('update-media-access', () => {
//     askForMediaAccess().then((result) => {
//       if (result) {
//         mainWindow.webContents.send('media-access-granted')
//       } else {
//         mainWindow.webContents.send('media-access-denied')
//       }
//     })
//   })
// }

// ###########################################################################################
// ###########################################################################################

function toggleTrayWindow() {
  if (trayWindow?.isVisible()) {
    trayWindow?.hide()
  } else {
    setTimeout(() => {
      showBrowserWindow('tray')
      trayWindow?.focus()
    }, 100)
  }
}

const setTrayIconPosition = () => {
  if (os.platform() !== 'darwin') {
    return
  }

  if (!tray) {
    return
  }

  const bounds = tray.getBounds()
  if (!bounds) return
  console.log({ bounds, traywindwo: trayWindow?.getBounds() })

  if (trayWindow) {
    ElectronLog.info(trayWindow.getBounds().width,  trayWindow.getBounds().height,
      bounds.x,
      bounds.y)
    if (os.platform() === 'darwin') {
      trayWindow.setPosition(bounds.x, bounds.y)
    } else {
      trayWindow.setPosition(
        bounds.x - trayWindow.getBounds().width,
        bounds.y - trayWindow.getBounds().height,
      )
    }
  }

  // trayWindow.webContents.send('updateTrayIconPosition')
}

function createTray() {
  // eslint-disable-next-line new-cap
  // const trayImage  = new nativeImage.createFromPath(
  //   path.join(__dirname, '../e-build/tray/white/trayIcon.png'),
  // ).resize({ width: 16, height: 16 })
  // tray = new Tray(trayImage)

  let trayIcon
  if (!isMac) {
    trayIcon = './assets/tray/icon.png'
  } else {
    const isDarkMode = systemPreferences.isDarkMode()
    trayIcon = './assets/tray/black/trayicon.png'
    if (isDarkMode) {
      trayIcon = './assets/tray/icon.png'
    }
  }

  tray = new Tray(path.join(__dirname, trayIcon))

  tray.on('click', function() {
    setTrayIconPosition()
    toggleTrayWindow()
  })

  // init
  // log.info('createTray', tray.getBounds())
  setTrayIconPosition()
}

function createTrayWindow(callback, showOps = false) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const trayBounds = tray?.getBounds()

  trayWindow = new BrowserWindow({
    width: 0,
    height: 0,
    transparent: true,
    frame: false,
    movable: isMac ? false : true,
    resizable: isMac ? false : true,
    enableLargerThanScreen: false,
    hasShadow: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false,
    },
  })

  if (isMac) {
    trayWindow.setAlwaysOnTop(true, 'pop-up-menu')
  }

  ElectronLog.info({ isPackaged })
  if (isPackaged) {
    trayWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../app-build/tray.html'),
      protocol: 'file:',
      slashes: true,
    }))
  } else {
    trayWindow.loadURL(DEV_HOST + '/tray.html')
  }

  trayWindow.webContents.once('dom-ready', () => {
    setTimeout(() => {
      callback?.()
    }, 500)

    trayWindow.show()
  })

  trayWindow.on('closed', () => {
    trayWindow = null
  })

  trayWindow.on('close', (e) => {
    if (process.platform === 'darwin') {
      if (!forceQuit) {
        e.preventDefault()
        app.hide()
      }
    }
  })

  trayWindow.on('blur', (e) => {
    ElectronLog.info('blur', global.activeTrayBlur)
    if (global.activeTrayBlur && process.platform === 'darwin') {
      trayWindow.hide()
    }
  })

  setTrayIconPosition()
}

global.activeTrayBlur = true

ipcMain.on('tray-window-blur-event', (e, args) => {
  global.activeTrayBlur = args.active
})

// ###########################################################################################
// ###########################################################################################

function createMainWindow(callback, showOps = false) {
  ElectronLog.info('createMainWindow', { showOps, callback })
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      // nodeIntegration: false, // is default value after Electron v5
      // contextIsolation: true, // protect against prototype pollution
      // enableRemoteModule: false, // turn off remote
    },
    icon: path.join(__dirname, '../e-build/icon.png'),
    alwaysOnTop: false,
    hasShadow: true,
    show: true,
  })
  if (isPackaged) {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../app-build/app.html'),
      protocol: 'file:',
      slashes: true,
    }))
  } else {
    mainWindow.loadURL(DEV_HOST + '/app.html')
  }

  // Auto Launch setting
  const autoLaunch = new AutoLaunch({
    name: 'issuenote',
  })
  autoLaunch.enable()
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable()
  })

  mainWindow.webContents.once('dom-ready', () => {
    setTimeout(() => {
      callback?.()
    }, 500)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', (e) => {
    if (process.platform === 'darwin') {
      if (!forceQuit) {
        e.preventDefault()
        mainWindow.hide()
      }
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    if (!isPackaged) {
      initAutoUpdater()

      return
    }
    initAutoUpdater()
    // ElectronLog.info('is packaged? yes')
    // initOpenUrl()
    // initSystemAccess()
  })
}

ipcMain.on('restart-app', (e) => {
  app.relaunch()
  app.exit()
})

ipcMain.on('close-tray-window', (e) => {
  console.log('Got called to close the app')
  e.preventDefault()
  // toggleTrayWindow()
  trayWindow.hide()
})

ipcMain.on('close-main-window', (e) => {
  e.preventDefault()
  mainWindow.hide()
})

ipcMain.on('open-main-window', (event) => {
  // mainWindow.show()
  showBrowserWindow('main')
})

ipcMain.on('open-router', (event, args) => {
  // const { activeNoteId, blobUrl, extension } = args
  const { path, options } = args

  // let moreOptions = {}
  // if (path === '/notesource') {
  //   moreOptions = args?.activeNoteId || global?.activeNoteId
  //   console.log(moreOptions, args?.activeNoteId, global?.activeNoteId)
  // }
  ElectronLog.info({ args })

  const callback = () => {
    mainWindow.webContents.send('open-router', {  path, options: { ...options, activeNoteId: global.activeNoteId } })
  }
  showBrowserWindow('main', true, callback)
  mainWindow.show()

  // close captureWindow
  if (captureWins) {
    captureWins.forEach((win) => {
      win.close()
      captureWins = []
    })
  }
})

ipcMain.on('open-tray-router', (event, args) => {
  const { path, options } = args

  const callback = () => {
    trayWindow.webContents.send('open-tray-router', {  path, options: { ...options, userId: global?.userId } })
  }

  showBrowserWindow('tray', true, callback)
  trayWindow.focus()

  // close captureWindow
  if (captureWins) {
    captureWins.forEach((win) => {
      win.close()
      captureWins = []
    })
  }
})

// deprecated - use open router by isaac
// ipcMain.on('open-capture-image', (event, arg) => {
//   const { img, activeNoteId } = arg
//   // ipcMain.send('open-image-log', { img })
//   ElectronLog.info('open capture', { activeNoteId })
//   if (activeNoteId) {
//     mainWindow.webContents.send('open-image-issue', { img, activeNoteId })
//     mainWindow.show()
//   }

//   // close captureWindow
//   if (captureWins) {
//     captureWins.forEach((win) => {
//       win.close()
//       captureWins = []
//     })
//   }
// })

async function getMediaAccessStatus() {
  const microphone = await systemPreferences.getMediaAccessStatus('microphone')
  const camera = await systemPreferences.getMediaAccessStatus('camera')
  const screen = await systemPreferences.getMediaAccessStatus('screen')

  ElectronLog.info({ microphone, camera, screen })
  return { microphone, camera, screen }
}

ipcMain.on('get-media-access-status', async (e) => {
  ElectronLog.info('get-media-access-status')
  const result = await getMediaAccessStatus()
  ElectronLog.info({ result })

  e.returnValue = { ...result, restart: false }
})

ipcMain.on('ask-media-access', async (e, args) => {
  const { type } = args
  let restart = false
  ElectronLog.info({ type })
  if (!type) {
    return
  }

  let askResult = false
  if (type === 'screen') {
    const access = await systemPreferences.getMediaAccessStatus('screen')
    askResult = access === 'granted'
  } else {
    askResult = await systemPreferences.askForMediaAccess(type)
  }

  ElectronLog.info(!askResult)
  if (!askResult) {
    restart = true
    let category = ''
    switch (type) {
    case 'screen':
      category = 'ScreenCapture'
      break
    case 'microphone':
      category = 'Microphone'
      break
    case 'camera':
      category = 'Camera'
      break
    }

    const url = 'x-apple.systempreferences:com.apple.preference.security?Privacy_' + category
    await shell.openExternal(url)
  }

  ElectronLog.info({ type, askResult })
  const result = await getMediaAccessStatus()
  trayWindow.webContents.send('media-access-status-result', { ...result, restart })
  // return result
  if (type === 'microphone') {
    e.returnValue = result.microphone
  } else if (type === 'camera') {
    e.returnValue = result.camera
  } else {
    e.returnValue = result.screen
  }
})

ipcMain.on('resize-tray-window', (event, args) => {
  try {
    trayWindow && trayWindow.setSize(args.w, args.h)
    ElectronLog.info('resize-tray-window ', args)
  } catch (err) {
    // console.log('ipcMain.on resize-tray-window err', arg, err)
  }
})

// ###########################################################################################
// ###########################################################################################

const captureScreen = (type) => {
  if (captureWins.length) {
    return
  }

  const screenIds = {}
  const displays = screen.getAllDisplays()
  captureWins = displays.map((display) => {
    const captureWin = new BrowserWindow({
      // window fullscreen
      fullscreen: os.platform() === 'win32' || undefined,
      width: display.bounds.width,
      height: display.bounds.height,
      x: display.bounds.x,
      y: display.bounds.y,
      transparent: true,
      frame: false,
      // skipTaskbar: true,
      // autoHideMenuBar: true,
      movable: false,
      resizable: false,
      enableLargerThanScreen: true,
      hasShadow: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    })
    screenIds[captureWin.id] = display.id
    ElectronLog.info(screenIds)

    captureWin.setAlwaysOnTop(true, 'screen-saver')

    captureWin.setVisibleOnAllWorkspaces(true)
    captureWin.setFullScreenable(false)

    // if (!isPackaged) {
    //   captureWin.webContents.openDevTools()
    // }

    const fileName = type === 'capture' ? 'capture.html' : 'record.html'
    ElectronLog.info({ fileName })
    if (isPackaged) {
      captureWin.loadURL(url.format({
        pathname: path.join(__dirname, `../app-build/${fileName}`),
        protocol: 'file:',
        slashes: true,
      }))
    } else {
      captureWin.loadURL(`${DEV_HOST}/${fileName}`)
    }

    const { x, y } = screen.getCursorScreenPoint()
    if (x >= display.bounds.x && x <= display.bounds.x + display.bounds.width && y >= display.bounds.y && y <= display.bounds.y + display.bounds.height) {
      captureWin.focus()
    } else {
      captureWin.blur()
    }

    captureWin.on('closed', () => {
      const index = captureWins.indexOf(captureWin)
      if (index !== -1) {
        captureWins.splice(index, 1)
      }
      captureWins.forEach((win) => win.close())
      captureWins = []
    })

    return captureWin
  })

  global.screenIds = JSON.stringify(screenIds)
}

ipcMain.on('close-capture-windows', (e) => {
  if (captureWins.length > 0) {
    captureWins.forEach((win) => win.close())
    captureWins = []
  }
})

ipcMain.on('set-active-note-id', (e, args) => {
  const { noteId, from } = args
  global.activeNoteId = noteId
  if (from !== 'tray') {
    trayWindow.webContents.send('on-active-note-id', { activeNoteId: args.noteId })
  }
  if (from !== 'main') {
    // mainWindow.webContents.send('on-active-note-id', { activeNoteId: args.noteId })
  }
})

ipcMain.on('set-login-user', (e, args) => {
  ElectronLog.info('set-login-user', { args })
  const { login, from } = args
  global.login = login
  if (from === 'main') {
    const callback = () => {
      trayWindow.webContents.send('on-login-update', { login, from })
    }
    // showBrowserWindow('tray', false, callback)
  }
  if (from === 'tray') {
    const callback = () => {
      mainWindow.webContents.send('on-login-update', { login, from })
    }
    // showBrowserWindow('main', false, callback)
  }
  // trayWindow.show()
  // mainWindow.hide()
})

const captureInit = () => {
  globalShortcut.register('CmdOrCtrl+Shift+D', (e) => {
    // ElectronLog.info('global.login', global.login)
    // if (!global.login) return - 일단 로그인 상태가 제대로 안되어서 동작하지 않기에 잠시 풀어둠
    captureScreen('capture')
  })

  globalShortcut.register('CmdOrCtrl+Shift+E', (e) => {
    // ElectronLog.info('global.login', global.login)
    // if (!global.login) return
    captureScreen('record')
  })

  ipcMain.on('capture-screen', (e, { type = 'start', screenId } = {}) => {
    if (type === 'start') {
      trayWindow?.hide()
      mainWindow?.hide()
      captureScreen('capture')
    } else if (type === 'select') {
      captureWins.forEach((win) => win.webContents.send('capture-screen', { type: 'select', screenId }))
    }
  })

  ipcMain.on('record-screen', (e, args) => {
    const { mic } = args
    ElectronLog.info({ mic })
    global.recordOption = { mic: mic }
    trayWindow?.hide()
    mainWindow?.hide()
    captureScreen('record')
  })
}

// ###########################################################################################
// ###########################################################################################
// ###########################################################################################
// ###########################################################################################

app.setAsDefaultProtocolClient('issuenote')
app.on('before-quit', () => {
  forceQuit = true
})

app.on('open-url', function(event, url) {
  event.preventDefault()
  const params = url.split('://')[1]
  log.info('open-url event: ' + url + ' ' + params)

  openUrl = params
  if (trayWindow) {
    initOpenUrl()
  }
  // trayWindow?.webContents?.executeJavaScript(`tokenAuth("${params}")`)
})

function showBrowserWindow(windowName, showOps = true, callback = () => {}) {
  if (windowName === 'main') {
    if (mainWindow === null) {
      createMainWindow(callback, showOps)
    } else {
      callback && callback()
      mainWindow.show()
    }
  } else if (windowName === 'tray') {
    if (trayWindow === null) {
      createTrayWindow(callback, showOps)
    } else {
      callback && callback()
      trayWindow.show()
    }
  }
}

app.on('activate', async () => {
  showBrowserWindow('main', false)
  showBrowserWindow('tray')
  // if (trayWindow === null) {
  //   setTimeout(() => {
  //     createTrayWindow()
  //   }, 100)
  // }

  const { camera, screen, microphone } = await getMediaAccessStatus()
  if (camera !== 'granted' || microphone !== 'granted' || screen !== 'granted') {
    mainWindow.show()
  }
})

app.on('ready', async () => {
  showBrowserWindow('main', false)
  showBrowserWindow('tray')
  // if (mainWindow === null) {
  //   createMainWindow()
  // }
  // if (trayWindow === null) {
  //   setTimeout(() => {
  //     createTrayWindow()
  //   }, 100)
  // }

  const { camera, screen, microphone } = await getMediaAccessStatus()
  if (camera !== 'granted' || microphone !== 'granted' || screen !== 'granted') {
    mainWindow.show()
  }
})

// browserWindow에 대한 포커스가 발생했을 때
app.on('browser-window-focus', () => {
  // app.setBadgeCount(1)
})

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready-to-show', () => {
  if (trayWindow) {
    trayWindow.show()
    trayWindow.focus()
  }
})

app.whenReady().then(() => {
  log.info('when ready')
  captureInit()
  createTray()
})
