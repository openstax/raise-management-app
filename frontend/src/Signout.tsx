import { signout } from './auth-slice'
import { signoutUser } from './aws-cognito'
import { useAppDispatch } from './hooks'

const Signout = (): JSX.Element => {
  const dispatch = useAppDispatch()

  const handleSignout = async (event: React.MouseEvent<HTMLAnchorElement>): Promise<void> => {
    event.preventDefault()
    await signoutUser()
    dispatch(signout())
  }

  return (
    <a href="#" onClick={handleSignout}>Signout</a>
  )
}

export default Signout
