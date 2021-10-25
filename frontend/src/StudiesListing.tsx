import { useEffect, useState } from 'react'
import { Study } from './api'
import { useStudiesApi } from './api-config'

const StudiesListing = (): JSX.Element => {
  const [studies, setStudies] = useState<Study[]>()
  const studiesApi = useStudiesApi()

  const fetchStudies = async (): Promise<void> => {
    const studies = await studiesApi.listStudiesStudiesGet()
    setStudies(studies)
  }

  useEffect(() => {
    fetchStudies().catch((error: Error) => { console.log(error.message) })
  }, [])

  return (
    <div>
      <a href="#" onClick={fetchStudies}>Refresh</a>
      {JSON.stringify(studies)}
    </div>
  )
}

export default StudiesListing
