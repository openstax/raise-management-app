import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'

interface SigninValues {
  username: string
  password: string
}

const SigninForm = (): JSX.Element => {
  const initialValues: SigninValues = {
    username: '',
    password: ''
  }

  const schema = Yup.object({
    username: Yup.string().required('Please enter username'),
    password: Yup.string().required('Please enter password')
  })

  const handleSubmit = async (values: SigninValues, actions: FormikHelpers<SigninValues>): Promise<void> => {
    // TODO: Implement handler
    actions.resetForm()
  }

  return (
    <div>
      <h1>Sign in</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Field name="username" type="text" placeholder="Username" />
          <ErrorMessage name="username" />
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" />
          <button type="submit">Log in</button>
        </Form>
      </Formik>
    </div>
  )
}

export default SigninForm
