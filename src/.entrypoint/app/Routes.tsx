import { Route, Switch } from 'react-router-dom'

import { Admin } from '../../pages/Admin'
import { ApolloApp } from './App'
import { AudioMix } from '../../pages/AudioMix'
import { Auth } from '../../pages/Auth'
import { Dashboard } from '../../pages/Dashboard'

export const routes = {
  Auth: '/auth',
  Dashboard: '/',
  AudioMix: '/mix',
  Admin: '/admin',
  NotFound: '/404',
}


const Routes = () => {
  return (
    <ApolloApp>
      <Switch>
        <Route path={routes.Auth} component={Auth} />
        <Route exact path={routes.Dashboard} component={Dashboard} />
        <Route exact path={routes.AudioMix} component={AudioMix} />
        <Route exact path={routes.Admin} component={Admin} />
      </Switch>
    </ApolloApp>
  )
}

export default Routes
