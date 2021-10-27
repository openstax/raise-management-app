import * as awsCognitoAuth from './aws-cognito'
import * as fakeAuth from './fake-auth'

export interface AuthenticatedUser {
  username: string
  idToken: string
}

export interface Authenticator {
  authenticateUser: (username: string, password: string) => Promise<AuthenticatedUser>
  signoutUser: () => Promise<void>
  getExistingSession: () => Promise<AuthenticatedUser | null>
}

export const CognitoAuthenticator: Authenticator = {
  authenticateUser: awsCognitoAuth.authenticateUser,
  signoutUser: awsCognitoAuth.signoutUser,
  getExistingSession: awsCognitoAuth.getExistingSession
}

export const FakeAuthenticator: Authenticator = {
  authenticateUser: fakeAuth.authenticateUser,
  signoutUser: fakeAuth.signoutUser,
  getExistingSession: fakeAuth.getExistingSession
}
