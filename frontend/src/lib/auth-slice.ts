import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export enum AuthState {
  Unknown = 'Unknown',
  NotSignedIn = 'NotSignedIn',
  SignedIn = 'SignedIn'
}

interface SigninPayload {
  username: string
  usergroups: string[]
}

interface AuthSliceState {
  authState: AuthState
  username: string
  usergroups: string[]
  isAdmin: boolean
  isResearcher: boolean
}

const initialState: AuthSliceState = {
  authState: AuthState.Unknown,
  username: '',
  usergroups: [],
  isAdmin: false,
  isResearcher: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    signin: (state, action: PayloadAction<SigninPayload>) => {
      const usergroups = action.payload.usergroups
      return {
        authState: AuthState.SignedIn,
        username: action.payload.username,
        usergroups: usergroups,
        isAdmin: usergroups.includes('admin'),
        isResearcher: usergroups.includes('researcher')
      }
    },
    signout: (state) => {
      return { ...initialState, authState: AuthState.NotSignedIn }
    }
  }
})

export const { signin, signout } = authSlice.actions
export const selectAuthState = (state: RootState): AuthState => state.auth.authState
export const selectIsAdmin = (state: RootState): boolean => state.auth.isAdmin
export const selectIsResearcher = (state: RootState): boolean => state.auth.isResearcher

export default authSlice.reducer
