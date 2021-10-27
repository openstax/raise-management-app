import { useMemo } from 'react'
import { ENV } from './env'
import { Configuration, StudiesApi } from '../api'

const getCurrentToken = async (name?: string, scopes?: string[]): Promise<string> => {
  const maybeUser = await ENV.AUTHENTICATOR.getExistingSession()
  if (maybeUser === null) {
    throw new Error('No valid active session with token')
  }
  return maybeUser.idToken
}

export const useStudiesApi = (): StudiesApi => {
  const api = useMemo(() => {
    const configuration = new Configuration({
      basePath: ENV.API_PATH,
      accessToken: getCurrentToken
    })
    return new StudiesApi(configuration)
  }, [])

  return api
}
