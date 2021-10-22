import { Redirect, Route, RouteProps } from 'react-router-dom'
import { selectAuthState, AuthState } from './auth-slice'
import { useAppSelector } from './hooks'

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }): JSX.Element => {
  const authState = useAppSelector(selectAuthState)

  return (
    <Route
      {...rest}
      render={({ location }) =>
        (authState === AuthState.SignedIn)
          ? (children)
          : (<Redirect to={{ pathname: '/', state: { from: location } }} />)
      }
    />
  )
}

export default PrivateRoute
