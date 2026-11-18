import { SignIn, SignUp, useAuth } from '@clerk/clerk-react'
import { Navigate, useSearchParams } from 'react-router-dom'

export default function Login() {
  const [params] = useSearchParams()
  const { isLoaded, isSignedIn } = useAuth()
  const isSignUp = params.get('mode') === 'signup'
 const returnPages = {
  checkout: '/place-order',
  orders: '/orders',
}

const from = params.get('from')
const destination = returnPages[from] ?? '/'
const returnQuery = returnPages[from] ? `&from=${from}` : ''
const signInUrl = returnPages[from] ? `/login?from=${from}` : '/login'
const signUpUrl = `/login?mode=signup${returnQuery}`

  if (!isLoaded) return <p role="status" className="py-10">Loading sign-in…</p>
  if (isSignedIn) return <Navigate to={destination} replace />

  return (
    <section className="flex flex-col items-center py-12">
      <h1 className="mb-6 text-3xl">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h1>

      {isSignUp ? (
        <SignUp routing="hash" signInUrl={signInUrl} forceRedirectUrl={destination} />
      ) : (
        <SignIn routing="hash" signUpUrl={signUpUrl} forceRedirectUrl={destination} />
      )}
    </section>
  )
}