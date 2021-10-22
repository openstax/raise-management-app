// NOTE: Just adding the dev cognito details directly for now. Later when we
// have multiple pools for different environments, we can use a mechanism like
// Vite env to set different values.
export const ENV = {
  AWS_REGION: 'us-east-1',
  COGNITO_USER_POOL_ID: 'us-east-1_bpBEyr8Xh',
  COGNITO_CLIENT_ID: '65g2uk6gdjjlbn3qasvb09qff6'
}

Object.freeze(ENV)
