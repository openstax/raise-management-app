const IS_LOCAL = window.location.hostname === 'localhost'
const API_PATH = IS_LOCAL ? 'http://localhost:8000' : '/api'

export const ENV = {
  COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
  COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
  API_PATH: API_PATH
}

Object.freeze(ENV)
