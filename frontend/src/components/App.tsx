import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SigninForm from './SigninForm'
import Header from './Header'
import PrivateRoute from './PrivateRoute'
import StudiesListing from './StudiesListing'
import StudyForm from './StudyForm'

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <SigninForm />
        </Route>
        <PrivateRoute exact path="/studies">
          <Header />
          <StudiesListing />
        </PrivateRoute>
        <PrivateRoute exact path="/studies/new">
          <Header />
          <StudyForm />
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export default App
