import { signout } from '../lib/auth-slice'
import { ENV } from '../lib/env'
import { useAppDispatch } from '../lib/hooks'

const Signout = (): JSX.Element => {
  const dispatch = useAppDispatch()

  const authenticator = ENV.AUTHENTICATOR

  const handleSignout = async (event: React.MouseEvent<HTMLAnchorElement>): Promise<void> => {
    event.preventDefault()
    await authenticator.signoutUser()
    dispatch(signout())
  }

  return (
    <a href="#" onClick={handleSignout}>Signout</a>
  )
}

export default Signout
