const IS_LOCAL = window.location.hostname === 'localhost'
const API_PATH = IS_LOCAL ? 'http://localhost:8000' : '/api'

// NOTE: Just adding the dev cognito details directly for now. Later when we
// have multiple pools for different environments, we can use a mechanism like
// Vite env to set different values.
export const ENV = {
  AWS_REGION: 'us-east-1',
  COGNITO_USER_POOL_ID: 'us-east-1_bpBEyr8Xh',
  COGNITO_CLIENT_ID: '65g2uk6gdjjlbn3qasvb09qff6',
  API_PATH: API_PATH
}

Object.freeze(ENV)
