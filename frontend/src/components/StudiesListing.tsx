import { useEffect, useState } from 'react'
import { Study } from '../api'
import { useStudiesApi } from '../lib/api-config'

const StudiesListing = (): JSX.Element => {
  const [studies, setStudies] = useState<Study[]>()
  const studiesApi = useStudiesApi()

  const fetchStudies = async (): Promise<void> => {
    try {
      const studies = await studiesApi.listStudiesStudiesGet()
      setStudies(studies)
    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStudies().catch((error: any) => { console.log(error) })
  }, [])

  return (
    <div>
      <a href="#" onClick={fetchStudies}>Refresh</a>
      {JSON.stringify(studies)}
    </div>
  )
}

export default StudiesListing
