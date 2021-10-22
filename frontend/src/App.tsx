import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SigninForm from './SigninForm'
import Signout from './Signout'
import PrivateRoute from './PrivateRoute'

const App = (): JSX.Element => {
  return (
    <Router>
      <Signout />
      <Switch>
        <Route exact path="/">
          <SigninForm />
        </Route>
        <PrivateRoute exact path="/studies">
          <h1>Studies</h1>
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default App
