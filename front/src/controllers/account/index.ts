import { LocalToken } from '@strum/common'
import { URLs } from '../../config/url'
import axios from 'axios'

// export async function tokenSignIn(token: string) {
//   await requestTokenAuth(token)
//   initializeTokenLink()
// }

export async function updateTokenByAuthenticate() {
  const prevToken = await LocalToken.getToken()
  // const res = await axios.post(`${URLs.API_URL}/account/tokenSignin`, { token: prevToken })
  const res = await axios.post(`${URLs.API_URL}/account/tokenSignin?token=${prevToken}`)
  const resdata = res.data
  let loggined = false
  if (resdata) {
    const { result, id } = resdata
    if (result !== 'authenticated') {
      loggined = true
      console.log('token auth error', { prevToken, result, id })
      LocalToken.setToken('')
      return null
    }
  }
  // setTimeout(() => {
  //   if (process.env.IS_ELECTRON) {
  //     const { ipcRenderer } = require('electron')
  //     ipcRenderer.send('set-login-user', {
  //       login: loggined,
  //       from: 'main',
  //     })
  //   }
  // }, 1000)
  return prevToken
}

// DEPRECATED:
export function googleSignIn() {
  if (process.env.IS_ELECTRON) {
    const electron = require('electron')
    const shell = electron?.remote?.shell
    shell?.openExternal(`${URLs.API_URL}/auth/google?from=web`)
  } else {
    window.location.assign(`${URLs.API_URL}/auth/google?from=native`)
  }
}

// export function useAccount() {
//   const { user, userRes } = useUserDetail({})
//   console.log('useAccount', { user, userRes })
//   return user
//   // return {
//   //   accountId: 'UU3R3M1I2Y',
//   //   email: 'franco@west.com',
//   // }
// }
