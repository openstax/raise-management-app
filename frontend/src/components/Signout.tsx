import { signout } from '../lib/auth-slice'
import { ENV } from '../lib/env'
import { useAppDispatch } from '../lib/hooks'

const Signout = (): JSX.Element => {
  const dispatch = useAppDispatch()

  const authenticator = ENV.AUTHENTICATOR

  const handleSignout = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    await authenticator.signoutUser()
    dispatch(signout())
  }

  return (
    <button className="btn btn-outline-warning" type="button" onClick={handleSignout}>Signout</button>
  )
}

export default Signout
