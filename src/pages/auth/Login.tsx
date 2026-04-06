import { SignIn } from '@clerk/clerk-react'

/** Login page using Clerk's embedded SignIn component. */
export default function Login() {
  return (
    <div className="flex justify-center">
      <SignIn
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/auth/register"
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'shadow-none border-0',
          },
        }}
      />
    </div>
  )
}
