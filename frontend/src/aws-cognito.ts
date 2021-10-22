import {
  CognitoUserPool, CognitoUser, CognitoUserSession, AuthenticationDetails
} from 'amazon-cognito-identity-js'
import { ENV } from './env'

const COGNITO_PAYLOAD_USERNAME_KEY = 'cognito:username'

interface AuthenticatedUser {
  username: string
}

function getUserPool(): CognitoUserPool {
  return new CognitoUserPool({
    UserPoolId: ENV.COGNITO_USER_POOL_ID,
    ClientId: ENV.COGNITO_CLIENT_ID
  })
}

export async function signoutUser(): Promise<void> {
  const userPool = getUserPool()

  const currentUser = userPool.getCurrentUser()

  if (currentUser == null) {
    return
  }

  return await new Promise(function (resolve) {
    const signoutComplete = (): void => {
      resolve()
    }
    currentUser.signOut(signoutComplete)
  })
}

export async function authenticateUser(username: string, password: string): Promise<AuthenticatedUser> {
  const userPool = getUserPool()

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  })

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })

  return await new Promise(function (resolve, reject) {
    const authSuccess = (session: CognitoUserSession): void => {
      const idToken = session.getIdToken()
      const username = idToken.payload[COGNITO_PAYLOAD_USERNAME_KEY] as string
      resolve({
        username: username
      })
    }

    const authFail = (err: any): void => {
      reject(new Error(err.message))
    }

    cognitoUser.authenticateUser(
      authenticationDetails,
      {
        onSuccess: authSuccess,
        onFailure: authFail
      }
    )
  })
}
