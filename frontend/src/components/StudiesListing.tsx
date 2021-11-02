import DataTable, { TableColumn, ExpanderComponentProps } from 'react-data-table-component'
import { useEffect, useState, useMemo } from 'react'
import { Study, StudyStatusValues } from '../api'
import { useStudiesApi, getApiErrorMessage } from '../lib/api-config'
import { Refresh, Plus } from './Icons'
import { selectIsResearcher, selectIsAdmin } from '../lib/auth-slice'
import { useAppSelector } from '../lib/hooks'
import { useHistory } from 'react-router-dom'

const StudiesListing = (): JSX.Element => {
  const [studies, setStudies] = useState<Study[]>([])
  const [currentError, setCurrentError] = useState<string>('')
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const studiesApi = useStudiesApi()
  const userIsResearcher = useAppSelector(selectIsResearcher)
  const userIsAdmin = useAppSelector(selectIsAdmin)
  const history = useHistory()

  const fetchStudies = async (): Promise<void> => {
    try {
      setCurrentError('')
      setCurrentMessage('Fetching studies...')
      const studies = await studiesApi.listStudiesStudiesGet()
      setStudies(studies)
    } catch (error: any) {
      setCurrentError(await getApiErrorMessage(error))
    } finally {
      setCurrentMessage('')
    }
  }

  const updateStudyStatus = (study: Study, status: StudyStatusValues): () => Promise<void> => {
    return async (): Promise<void> => {
      try {
        setCurrentError('')
        setCurrentMessage('Updating...')
        const updatedStudy = await studiesApi.updateStudyStatusStudiesStudyIdStatusPut({
          studyId: study.id,
          studyStatus: {
            status: status
          }
        })
        setStudies(currentStudies => currentStudies.map(
          currStudy => currStudy.id === updatedStudy.id ? updatedStudy : currStudy
        ))
      } catch (error: any) {
        setCurrentError(await getApiErrorMessage(error))
      } finally {
        setCurrentMessage('')
      }
    }
  }

  useEffect(() => {
    fetchStudies().catch(
      (error: any) => { setCurrentError(String(error)) }
    ).finally(
      () => { setIsInitialized(true) }
    )
  }, [])

  const tableColumns: Array<TableColumn<Study>> = useMemo(() => {
    const result: Array<TableColumn<Study>> = []

    if (userIsAdmin) {
      result.push({
        name: 'Owner username',
        selector: row => row.owner,
        sortable: true
      })
    }
    result.push({
      name: 'Title',
      selector: row => row.title,
      sortable: true
    })
    result.push({
      name: 'Status',
      selector: row => row.status
    })
    if (userIsAdmin) {
      result.push({
        name: 'Manage',
        cell: (row) => (
          <div>
            <button
              className="btn btn-success me-3"
              onClick={updateStudyStatus(row, StudyStatusValues.Approved)}
            >
              Approve
            </button>
            <button
              className="btn btn-danger"
              onClick={updateStudyStatus(row, StudyStatusValues.Denied)}
            >
              Deny
            </button>
          </div>
        )
      })
    }

    return result
  }, [])

  if (!isInitialized) {
    return (
      <div className="text-center">Loading studies data...</div>
    )
  }

  let maybeNewButton = null
  if (userIsResearcher) {
    maybeNewButton = (
      <button
        className="btn btn-outline-success rounded-circle me-2"
        type="button"
        onClick={() => history.push('/studies/new')}
      >
        <Plus />
      </button>
    )
  }

  return (
    <div className="w-80 mx-auto">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-secondary">Studies</h2>
        <div>
          {maybeNewButton}
          <button className="btn btn-outline-secondary rounded-circle" type="button" onClick={fetchStudies}>
            <Refresh />
          </button>
        </div>
      </div>
      <div className="text-danger text-center fw-bold">{currentError}</div>
      <DataTable
        data={studies}
        columns={tableColumns}
        defaultSortFieldId={1}
        keyField="id"
        expandableRows={true}
        expandableRowsComponent={ExpandedStudy}
      />
      <div className="text-primary text-center fw-bold">{currentMessage}</div>
    </div>
  )
}

const ExpandedStudy = ({ data }: ExpanderComponentProps<Study>): JSX.Element => {
  return (
    <div className="mt-3">
      <p><span className="fw-bold">Description:</span> {data.description}</p>
      <p><span className="fw-bold">Qualtrics URL:</span> {data._configuration.url}</p>
      <p><span className="fw-bold">Qualtrics Secret:</span> {data._configuration.secret}</p>
    </div>
  )
}

export default StudiesListing
