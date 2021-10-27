import { Redirect, useLocation } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { signin, signout, selectAuthState, AuthState } from '../lib/auth-slice'
import { ENV } from '../lib/env'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { useEffect } from 'react'

interface SigninValues {
  username: string
  password: string
}

const SigninForm = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const authState = useAppSelector(selectAuthState)
  const location = useLocation< { from: { pathname: string } } | undefined >()

  const authenticator = ENV.AUTHENTICATOR

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
      const user = await authenticator.authenticateUser(values.username, values.password)
      dispatch(signin({ username: user.username }))
      console.log('Successful login')
    } catch (error: any) {
      console.log(error.message)
      actions.resetForm()
    }
  }

  useEffect(() => {
    if (authState === AuthState.Unknown) {
      const checkForSession = async (): Promise<void> => {
        const maybeUser = await authenticator.getExistingSession()
        if (maybeUser !== null) {
          dispatch(signin({ username: maybeUser.username }))
        } else {
          dispatch(signout())
        }
      }
      checkForSession().catch((error: Error) => { console.log(error.message) })
    }
  }, [authState])

  if (authState === AuthState.SignedIn) {
    const { from } = location.state ?? { from: { pathname: '/studies' } }
    return (<Redirect to={from} />)
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
