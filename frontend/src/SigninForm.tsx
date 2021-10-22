import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { authenticateUser } from './aws-cognito'

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
    try {
      await authenticateUser(values.username, values.password)
      console.log('Successful login')
    } catch (error: any) {
      console.log(error.message)
    }
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
        { ({ isSubmitting }) => (
          <Form>
            <Field name="username" type="text" placeholder="Username" disabled={isSubmitting} />
            <ErrorMessage name="username" />
            <Field name="password" type="password" placeholder="Password" disabled={isSubmitting} />
            <ErrorMessage name="password" />
            <button type="submit" disabled={isSubmitting}>Log in</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SigninForm
