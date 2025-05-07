'use client'

import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser]         = useState<User | null>(null)
  const [message, setMessage]   = useState('')

  // Subscribe to auth changes
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  // Email/password sign-up
  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    setMessage(error?.message ?? 'Check your email for confirmation link.')
  }

  // Email/password sign-in
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMessage(error?.message ?? 'Logged in!')
  }

  // Magic link
  const magicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    setMessage(error?.message ?? 'Magic link sent!')
  }

  // Google sign-in
  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setMessage(error.message)
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  if (user) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Welcome, {user.email}</h1>
        <button onClick={signOut}>Sign out</button>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Supabase Auth Demo</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Password (for email/password)"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <button onClick={signUp}     style={{ width: '100%', marginBottom: 4 }}>Sign Up</button>
      <button onClick={signIn}     style={{ width: '100%', marginBottom: 4 }}>Sign In</button>
      <button onClick={magicLink}  style={{ width: '100%', marginBottom: 4 }}>Send Magic Link</button>
      <button onClick={googleSignIn} style={{ width: '100%', marginBottom: 4 }}>
        Sign In with Google
      </button>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  )
}
