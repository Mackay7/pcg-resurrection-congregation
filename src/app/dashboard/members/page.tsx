export const dynamic = 'force-dynamic'
import Link from 'next/link'

export default function MembersPage() {
  return (
    <div style={{ padding: '24px 28px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1C1C1A' }}>Members</h1>
          <p style={{ fontSize: 13, color: '#6B6B64', marginTop: 3 }}>PCG, Resurrection Congregation · Atlanta, GA</p>
        </div>
        <button style={{ padding: '8px 16px', borderRadius: 8, background: '#0F0F0E', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
          + Add member
        </button>
      </div>
      <div style={{ background: '#fff', border: '1px solid #E8E7DF', borderRadius: 12, padding: 40, textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: '#1C1C1A', marginBottom: 8 }}>Connect your database to see members</p>
        <p style={{ fontSize: 13, color: '#6B6B64', marginBottom: 20 }}>
          Add your <strong>DATABASE_URL</strong> from Supabase in Vercel environment variables, then redeploy.
        </p>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ padding: '9px 18px', borderRadius: 8, background: '#0F0F0E', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
          Get database URL from Supabase →
        </a>
      </div>
    </div>
  )
}
