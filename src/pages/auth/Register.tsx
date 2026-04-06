import { SignUp } from '@clerk/clerk-react'

/** Registration page using Clerk's embedded SignUp component. */
export default function Register() {
  return (
    <div className="flex justify-center">
      <SignUp
        fallbackRedirectUrl="/onboarding"
        signInUrl="/auth/login"
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
