import { Authenticator, CognitoAuthenticator, FakeAuthenticator } from './auth'

const IS_LOCAL = window.location.hostname === 'localhost'
const API_PATH = IS_LOCAL ? 'http://localhost:8000' : '/api'
const ENABLE_FAKE_AUTH = import.meta.env.VITE_FAKE_AUTH_MODE === '1'
const AUTHENTICATOR: Authenticator = ENABLE_FAKE_AUTH ? FakeAuthenticator : CognitoAuthenticator

export const ENV = {
  COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
  COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
  API_PATH: API_PATH,
  AUTHENTICATOR: AUTHENTICATOR
}

Object.freeze(ENV)
