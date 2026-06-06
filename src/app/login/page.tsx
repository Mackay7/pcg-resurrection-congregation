'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Incorrect email or password.'); setLoading(false); return }
    router.push('/dashboard'); router.refresh()
  }

  const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid #e0e0e0', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }

  return (
    <main style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAF7', padding:20 }}>
      <div style={{ width:'100%', maxWidth:400, background:'#fff', border:'1px solid #E8E7DF', borderRadius:16, padding:'36px 32px' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:'#0F0F0E', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:24 }}>⛪</div>
          <h1 style={{ fontSize:18, fontFamily:'Georgia,serif', fontWeight:500, color:'#1C1C1A' }}>PCG, Resurrection Congregation</h1>
          <p style={{ fontSize:13, color:'#6B6B64', marginTop:4 }}>Staff & admin portal · Atlanta, GA</p>
        </div>
        {error && <div style={{ background:'#FDEAEA', border:'1px solid #f5c6c6', borderRadius:8, padding:'10px 12px', fontSize:13, color:'#8B2020', marginBottom:16 }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div><label style={{ fontSize:12, fontWeight:500, color:'#3A3A36', display:'block', marginBottom:4 }}>Email address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@pcgresurrection.org" required style={inp} /></div>
          <div><label style={{ fontSize:12, fontWeight:500, color:'#3A3A36', display:'block', marginBottom:4 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required style={inp} /></div>
          <button type="submit" disabled={loading} style={{ marginTop:6, padding:'11px 16px', borderRadius:8, border:'none', background:loading?'#555':'#0F0F0E', color:'#fff', fontSize:14, fontWeight:500, cursor:loading?'not-allowed':'pointer' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={{ fontSize:11, color:'#6B6B64', textAlign:'center', marginTop:24 }}>Staff access only · Contact your administrator to request access</p>
      </div>
    </main>
  )
}
