import { Redirect, useLocation } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { signin, signout, selectAuthState, AuthState } from '../lib/auth-slice'
import { ENV } from '../lib/env'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const SigninBox = styled.div.attrs({
  className: 'd-flex flex-column align-items-center mx-auto border border-2 border-info'
})`
  margin-top: 100px;
  max-width: 500px;
  padding: 40px;
  border-radius: 1rem;
`

interface SigninValues {
  username: string
  password: string
}

const SigninForm = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const authState = useAppSelector(selectAuthState)
  const location = useLocation< { from: { pathname: string } } | undefined >()
  const [loginError, setLoginError] = useState<string>('')

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
      setLoginError('')
      const user = await authenticator.authenticateUser(values.username, values.password)
      dispatch(signin({ username: user.username }))
    } catch (error: any) {
      setLoginError(error.message)
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
      checkForSession().catch((error: Error) => { setLoginError(error.message) })
    }
  }, [authState])

  if (authState === AuthState.SignedIn) {
    const { from } = location.state ?? { from: { pathname: '/studies' } }
    return (<Redirect to={from} />)
  }

  return (
    <SigninBox>
      <h1 className="text-secondary mb-3">Sign in</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        { ({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <Field className="form-control" id="username" name="username" type="text" placeholder="Username" disabled={isSubmitting} />
              <ErrorMessage className="text-danger" component="div" name="username" />
            </div>
            <div className="mb-3">
              <Field className="form-control" id="password" name="password" type="password" placeholder="Password" disabled={isSubmitting} />
              <ErrorMessage className="text-danger" component="div" name="password" />
            </div>
            <div className="mb-3">
              <button className="btn btn-info d-block mx-auto w-100" type="submit" disabled={isSubmitting}>Submit</button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="text-danger">{loginError}</div>
    </SigninBox>
  )
}

export default SigninForm
