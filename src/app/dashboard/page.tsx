export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div style={{ padding: '24px 28px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontFamily: 'Georgia,serif', color: '#1C1C1A' }}>Good morning, Pastor</h1>
        <p style={{ fontSize: 13, color: '#6B6B64', marginTop: 3 }}>PCG, Resurrection Congregation · Atlanta, GA</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total members', value: '—', sub: 'Connect database to load', color: '#2D6A4F', bg: '#EAF3DE' },
          { label: "Today's attendance", value: '—', sub: 'Start check-in below', color: '#1B4F8C', bg: '#E8F0FB' },
          { label: 'Giving this month', value: '—', sub: 'Across all funds', color: '#9A5C00', bg: '#FBF6E9' },
          { label: 'Platform status', value: 'Live ✓', sub: 'PCG Resurrection Congregation', color: '#2D6A4F', bg: '#EAF3DE' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #E8E7DF', borderRadius: 10, padding: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: s.bg, marginBottom: 10 }} />
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 26, fontWeight: 500, color: '#1C1C1A' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#6B6B64', marginTop: 3 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: s.color, marginTop: 5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8E7DF', borderRadius: 12, padding: 24, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⛪</div>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: '#1C1C1A', marginBottom: 8 }}>
          PCG, Resurrection Congregation
        </h2>
        <p style={{ fontSize: 13, color: '#6B6B64', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
          Your platform is live. Add your Supabase and Stripe credentials in Vercel to connect your congregation data.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ padding: '9px 18px', borderRadius: 8, background: '#0F0F0E', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Open Supabase →
          </a>
          <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #E8E7DF', background: '#fff', color: '#1C1C1A', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Open Vercel settings →
          </a>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8E7DF', borderRadius: 12, padding: 18 }}>
        <h2 style={{ fontSize: 16, fontFamily: 'Georgia,serif', marginBottom: 14 }}>Quick actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
          {([
            ['Members', '/dashboard/members', '#EAF3DE'],
            ['Attendance', '/dashboard/attendance', '#E8F0FB'],
            ['Giving', '/dashboard/giving', '#FBF6E9'],
            ['Communications', '/dashboard/communications', '#FDEAEA'],
            ['Report', '/dashboard/report', '#F4F3EE'],
          ] as [string, string, string][]).map(([label, href, bg]) => (
            <Link key={href} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 10px', borderRadius: 8, border: '1px solid #E8E7DF', background: '#fff', textDecoration: 'none', textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: bg }} />
              <span style={{ fontSize: 12, color: '#1C1C1A', fontWeight: 500 }}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
