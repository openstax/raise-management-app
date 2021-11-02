import { AuthenticatedUser } from './auth'

const FAKE_AUTH_LOCAL_STORAGE_KEY = 'FakeAuthUsername'

function usernameToGroups(username: string): string[] {
  const usergroups = []

  if (username.includes('admin')) {
    usergroups.push('admin')
  }

  if (username.includes('researcher')) {
    usergroups.push('researcher')
  }

  return usergroups
}

function generateFakeJwtToken(username: string, usergroups: string[]): string {
  const header = btoa(JSON.stringify({}))
  const signature = btoa('notarealsignature')

  const payload = btoa(JSON.stringify({
    token_use: 'id',
    'cognito:username': username,
    'cognito:groups': usergroups
  }))
  const token = `${header}.${payload}.${signature}`

  return token
}

export async function signoutUser(): Promise<void> {
  localStorage.removeItem(FAKE_AUTH_LOCAL_STORAGE_KEY)
}

export async function authenticateUser(username: string, password: string): Promise<AuthenticatedUser> {
  // For fake auth, we'll simply check for username to equal password
  if (username !== password) {
    throw new Error('Incorrect username or password')
  }

  const usergroups = usernameToGroups(username)

  localStorage.setItem(FAKE_AUTH_LOCAL_STORAGE_KEY, username)
  return {
    username: username,
    usergroups: usergroups,
    idToken: generateFakeJwtToken(username, usergroups)
  }
}

export async function getExistingSession(): Promise<AuthenticatedUser | null> {
  const maybeUser = localStorage.getItem(FAKE_AUTH_LOCAL_STORAGE_KEY)

  if (maybeUser === null) {
    return null
  }

  const usergroups = usernameToGroups(maybeUser)

  return {
    username: maybeUser,
    usergroups: usergroups,
    idToken: generateFakeJwtToken(maybeUser, usergroups)
  }
}
