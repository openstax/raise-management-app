import { useMemo } from 'react'
import { ENV } from './env'
import { Configuration, StudiesApi } from './api'

export const useStudiesApi = (): StudiesApi => {
  const api = useMemo(() => {
    const configuration = new Configuration({
      basePath: ENV.API_PATH
    })
    return new StudiesApi(configuration)
  }, [])

  return api
}
