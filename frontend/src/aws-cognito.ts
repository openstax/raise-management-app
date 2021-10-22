import {
  CognitoUserPool, CognitoUser, CognitoUserSession, AuthenticationDetails
} from 'amazon-cognito-identity-js'
import { ENV } from './env'

export async function authenticateUser(username: string, password: string): Promise<CognitoUserSession> {
  const userPool = new CognitoUserPool({
    UserPoolId: ENV.COGNITO_USER_POOL_ID,
    ClientId: ENV.COGNITO_CLIENT_ID
  })

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
      resolve(session)
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
