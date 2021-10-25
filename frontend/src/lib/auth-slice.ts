import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export enum AuthState {
  Unknown = 'Unknown',
  NotSignedIn = 'NotSignedIn',
  SignedIn = 'SignedIn'
}

interface SigninPayload {
  username: string
}

const initialState = {
  authState: AuthState.Unknown,
  username: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    signin: (state, action: PayloadAction<SigninPayload>) => {
      return { authState: AuthState.SignedIn, ...action.payload }
    },
    signout: (state) => {
      return { ...initialState, authState: AuthState.NotSignedIn }
    }
  }
})

export const { signin, signout } = authSlice.actions
export const selectAuthState = (state: RootState): AuthState => state.auth.authState

export default authSlice.reducer
