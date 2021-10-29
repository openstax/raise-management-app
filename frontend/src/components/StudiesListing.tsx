import DataTable, { TableColumn, ExpanderComponentProps } from 'react-data-table-component'
import { useEffect, useState } from 'react'
import { Study } from '../api'
import { useStudiesApi } from '../lib/api-config'
import { Refresh, Plus } from './Icons'

const tableColumns: Array<TableColumn<Study>> = [
  {
    name: 'Title',
    selector: row => row.title,
    sortable: true
  },
  {
    name: 'Status',
    selector: row => row.status
  }
]

const StudiesListing = (): JSX.Element => {
  const [studies, setStudies] = useState<Study[]>([])
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
    <div className="w-80 mx-auto">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-secondary">Studies</h2>
        <div>
          <button className="btn btn-outline-success rounded-circle me-2" type="button">
            <Plus />
          </button>
          <button className="btn btn-outline-secondary rounded-circle" type="button" onClick={fetchStudies}>
            <Refresh />
          </button>
        </div>
      </div>
      <DataTable
        data={studies}
        columns={tableColumns}
        defaultSortFieldId={1}
        keyField="id"
        expandableRows={true}
        expandableRowsComponent={ExpandedStudy}
      />
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
