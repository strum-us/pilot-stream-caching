import { Route, Switch } from 'react-router-dom'

import { Admin } from '@pages/Admin'
import {ApolloApp} from './App'
import { Auth } from '@pages/Auth'
import { Dashboard } from '@pages/Dashboard'

export const routes = {
  Auth: '/auth',
  Dashboard: '/',
  Admin: '/admin',
  NotFound: '/404',
}


const Routes = () => {
  return (
    <ApolloApp>
      <Switch>
        <Route path={routes.Auth} component={Auth} />
        <Route exact path={routes.Dashboard} component={Dashboard} />
        <Route exact path={routes.Admin} component={Admin} />
      </Switch>
    </ApolloApp>
  )
}

export default Routes
