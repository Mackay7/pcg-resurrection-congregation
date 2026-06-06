import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const fmt = (c: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(c / 100)

export default async function DashboardPage() {
  let memberCount = 0, activeCount = 0, visitorCount = 0
  let monthlyGiving = 0, todayAttendance = 0
  let recentDonations: any[] = []
  let recentAttendance: any[] = []
  let dbConnected = false

  try {
    const [mc, ac, vc] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.member.count({ where: { status: 'VISITOR' } }),
    ])
    memberCount = mc; activeCount = ac; visitorCount = vc

    const giving = await prisma.donation.aggregate({
      where: { status: 'COMPLETED', donatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _sum: { amountCents: true },
    })
    monthlyGiving = giving._sum.amountCents ?? 0

    todayAttendance = await prisma.attendance.count({
      where: { checkedInAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    })

    recentDonations = await prisma.donation.findMany({
      take: 5, orderBy: { donatedAt: 'desc' }, where: { status: 'COMPLETED' },
      include: { member: { select: { firstName: true, lastName: true } }, fund: { select: { name: true } } },
    })

    recentAttendance = await prisma.attendance.findMany({
      take: 5, orderBy: { checkedInAt: 'desc' },
      include: { member: { select: { firstName: true, lastName: true } } },
    })
    dbConnected = true
  } catch (_e) {}

  return (
    <div style={{ padding: '24px 28px 40px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontFamily: 'Georgia,serif', color: '#1C1C1A' }}>Good morning, Pastor</h1>
        <p style={{ fontSize: 13, color: '#6B6B64', marginTop: 3 }}>PCG, Resurrection Congregation · Atlanta, GA</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total members', value: dbConnected ? memberCount : '—', sub: dbConnected ? `${activeCount} active · ${visitorCount} visitors` : 'Connecting…', color: '#2D6A4F', bg: '#EAF3DE' },
          { label: "Today's attendance", value: dbConnected ? todayAttendance : '—', sub: 'Start check-in below', color: '#1B4F8C', bg: '#E8F0FB' },
          { label: 'Giving this month', value: dbConnected ? (monthlyGiving ? fmt(monthlyGiving) : '$0') : '—', sub: 'Across all funds', color: '#9A5C00', bg: '#FBF6E9' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #E8E7DF', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontFamily: 'Georgia,serif' }}>Recent check-ins</h2>
            <Link href="/dashboard/attendance" style={{ fontSize: 12, color: '#6B6B64', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentAttendance.length === 0 ? (
            <p style={{ fontSize: 13, color: '#6B6B64', textAlign: 'center', padding: '20px 0' }}>No check-ins yet today</p>
          ) : recentAttendance.map((a: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F4F3EE' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F4F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>
                {a.member?.firstName?.[0]}{a.member?.lastName?.[0]}
              </div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{a.member?.firstName} {a.member?.lastName}</div></div>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#EAF3DE', color: '#2D6A4F', fontWeight: 500 }}>✓ In</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E8E7DF', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontFamily: 'Georgia,serif' }}>Recent donations</h2>
            <Link href="/dashboard/giving" style={{ fontSize: 12, color: '#6B6B64', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentDonations.length === 0 ? (
            <p style={{ fontSize: 13, color: '#6B6B64', textAlign: 'center', padding: '20px 0' }}>No donations recorded yet</p>
          ) : recentDonations.map((d: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F4F3EE' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F4F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>
                {d.member?.firstName?.[0] ?? '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{d.member ? `${d.member.firstName} ${d.member.lastName}` : 'Anonymous'}</div>
                <div style={{ fontSize: 11, color: '#6B6B64' }}>{d.fund.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{fmt(d.amountCents)}</div>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: d.isRecurring ? '#E8F0FB' : '#F4F3EE', color: d.isRecurring ? '#1B4F8C' : '#6B6B64', fontWeight: 500 }}>
                  {d.isRecurring ? 'Recurring' : 'One-time'}
                </span>
              </div>
            </div>
          ))}
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
