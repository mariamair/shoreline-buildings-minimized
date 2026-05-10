/**
 * Defines the sign in and sign out buttons.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { signIn, signOut } from '@/auth'

export function SignInButtonGoogle() {
  return (
    <form action={async () => { 
      'use server'
      await signIn('google', { redirectTo: '/dashboard' }) 
    }}>
      <button type="submit">Sign in with Google</button>
    </form>
  )
}

export function SignOutButton() {
  return (
    <form action={async () => { 
      'use server'
      await signOut({ redirectTo: '/' }) 
    }}>
      <button type="submit">Sign out</button>
    </form>
  )
}
