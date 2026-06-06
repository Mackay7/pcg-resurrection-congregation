import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Page() {
  const name = 'giving'.charAt(0).toUpperCase() + 'giving'.slice(1)
  return (
    <div style={{ padding: '24px 28px' }}>
      <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1C1C1A', marginBottom: 8 }}>{name}</h1>
      <p style={{ fontSize: 13, color: '#6B6B64', marginBottom: 24 }}>PCG, Resurrection Congregation · Atlanta, GA</p>
      <div style={{ background: '#fff', border: '1px solid #E8E7DF', borderRadius: 12, padding: 32, textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: '#1C1C1A', marginBottom: 8 }}>Connect your database to see live data</p>
        <p style={{ fontSize: 13, color: '#6B6B64', marginBottom: 20 }}>
          Add your DATABASE_URL and other environment variables in Vercel, then redeploy.
        </p>
        <Link href="/dashboard" style={{ padding: '9px 20px', borderRadius: 8, background: '#0F0F0E', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}
