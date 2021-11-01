import { useHistory } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { useStudiesApi } from '../lib/api-config'

interface StudyValues {
  title: string
  description: string
  qualtricsUrl: string
  qualtricsSecret: string
}

const StudyForm = (): JSX.Element => {
  const history = useHistory()
  const studiesApi = useStudiesApi()
  const [formError, setformError] = useState<string>('')

  const initialValues: StudyValues = {
    title: '',
    description: '',
    qualtricsUrl: '',
    qualtricsSecret: ''
  }

  const schema = Yup.object({
    title: Yup.string().required('Please enter a study title'),
    description: Yup.string().required('Please enter a study description'),
    qualtricsUrl: Yup.string().url('Value must be a valid URL').required('Please enter a Qualtrics URL for the study'),
    qualtricsSecret: Yup.string().required('Please provide secret for SSO token')
  })

  const handleSubmit = async (values: StudyValues): Promise<void> => {
    try {
      const newStudy = {
        title: values.title,
        description: values.description,
        _configuration: {
          url: values.qualtricsUrl,
          secret: values.qualtricsSecret
        }
      }

      setformError('')
      await studiesApi.createStudyStudiesPost({ studyCreate: newStudy })
      history.goBack()
    } catch (error: any) {
      const errorMsg = (error instanceof Response) ? (await error.json()).detail : String(error)
      setformError(errorMsg)
    }
  }

  const onCancel = (): void => {
    history.goBack()
  }

  return (
    <div className="w-80 mx-auto">
      <h1 className="text-secondary mb-5">Create a study</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        { ({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label className="form-label fw-bold" htmlFor="title">Study title</label>
              <Field className="form-control" id="title" name="title" type="text" disabled={isSubmitting} />
              <ErrorMessage className="text-danger" component="div" name="title" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold" htmlFor="description">Study description</label>
              <Field className="form-control" id="description" name="description" as="textarea" rows="5" disabled={isSubmitting} />
              <ErrorMessage className="text-danger" component="div" name="description" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold" htmlFor="qualtricsUrl">Study Qualtrics URL</label>
              <Field className="form-control" id="qualtricsUrl" name="qualtricsUrl" type="url" disabled={isSubmitting} />
              <ErrorMessage className="text-danger" component="div" name="qualtricsUrl" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold" htmlFor="qualtricsSecret">Study Qualtrics secret</label>
              <Field className="form-control" id="qualtricsSecret" name="qualtricsSecret" type="text" disabled={isSubmitting} />
              <ErrorMessage className="text-danger" component="div" name="qualtricsSecret" />
            </div>
            <div className="text-end">
              <button className="btn btn-outline-warning me-3" type="button" disabled={isSubmitting} onClick={onCancel}>Cancel</button>
              <button className="btn btn-outline-success" type="submit" disabled={isSubmitting}>Submit</button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="text-danger">{formError}</div>
    </div>
  )
}

export default StudyForm
