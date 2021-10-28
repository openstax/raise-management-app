import {
  CognitoUserPool, CognitoUser, CognitoUserSession, AuthenticationDetails
} from 'amazon-cognito-identity-js'
import { AuthenticatedUser } from './auth'
import { ENV } from './env'

const COGNITO_PAYLOAD_USERNAME_KEY = 'cognito:username'

function getUserPool(): CognitoUserPool {
  return new CognitoUserPool({
    UserPoolId: ENV.COGNITO_USER_POOL_ID,
    ClientId: ENV.COGNITO_CLIENT_ID
  })
}

function getAuthenticedUserFromSession(session: CognitoUserSession): AuthenticatedUser {
  const idToken = session.getIdToken()
  const username = idToken.payload[COGNITO_PAYLOAD_USERNAME_KEY] as string
  return {
    username: username,
    idToken: idToken.getJwtToken()
  }
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

  return await new Promise((resolve, reject) => {
    const authSuccess = (session: CognitoUserSession): void => {
      resolve(getAuthenticedUserFromSession(session))
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

export async function getExistingSession(): Promise<AuthenticatedUser | null> {
  const userPool = getUserPool()

  const currentUser = userPool.getCurrentUser()

  if (currentUser == null) {
    return null
  }

  return await new Promise((resolve, reject) => {
    const restoreSession = (err: Error | null, session: CognitoUserSession | null): void => {
      if (err !== null) {
        reject(new Error(err.message))
      }
      if (session !== null) {
        resolve(getAuthenticedUserFromSession(session))
      }
      resolve(null)
    }

    currentUser.getSession(restoreSession)
  })
}
