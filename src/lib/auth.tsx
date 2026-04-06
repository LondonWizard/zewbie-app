import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react'
import { createContext, useContext, type ReactNode } from 'react'

interface AuthContextValue {
  token: string | null
  userId: string | null
  email: string | null
  firstName: string | null
  isAuthenticated: boolean
  isLoaded: boolean
  getToken: () => Promise<string | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Wraps Clerk's auth hooks into a unified interface
 * used throughout the app for auth state and token retrieval.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId, getToken, signOut } = useClerkAuth()
  const { user } = useUser()

  const value: AuthContextValue = {
    token: null,
    userId: userId ?? null,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    firstName: user?.firstName ?? null,
    isAuthenticated: !!isSignedIn,
    isLoaded,
    getToken: () => getToken(),
    logout: () => { signOut() },
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/** Access auth state and actions. Must be used within a ClerkProvider + AuthProvider. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
