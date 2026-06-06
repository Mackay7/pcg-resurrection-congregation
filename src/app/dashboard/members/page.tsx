import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SearchParams { q?: string; status?: string }

export default async function MembersPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, status } = searchParams
  let members: any[] = []
  let total = 0
  let error = ''

  try {
    members = await prisma.member.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(q && { OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ]}),
      },
      include: {
        household: { select: { name: true } },
        groupMemberships: { include: { group: { select: { name: true } } } },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    })
    total = await prisma.member.count()
  } catch (e: any) {
    error = e.message
  }

  const statusStyle: Record<string, [string, string]> = {
    ACTIVE: ['#EAF3DE', '#2D6A4F'],
    VISITOR: ['#FEF3DC', '#9A5C00'],
    INACTIVE: ['#F4F3EE', '#6B6B64'],
    DECEASED: ['#FDEAEA', '#8B2020'],
  }

  const inp: React.CSSProperties = {
    padding: '8px 12px', border: '1px solid #E8E7DF',
    borderRadius: 8, fontSize: 13, color: '#1C1C1A',
    background: '#fff', outline: 'none',
  }

  return (
    <div style={{ padding: '24px 28px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: '#1C1C1A' }}>Members</h1>
          <p style={{ fontSize: 13, color: '#6B6B64', marginTop: 3 }}>
            {error ? 'Database connection error' : `${members.length} shown · ${total} total · PCG, Resurrection Congregation`}
          </p>
        </div>
        <button style={{ padding: '8px 16px', borderRadius: 8, background: '#0F0F0E', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
          + Add member
        </button>
      </div>

      {error && (
        <div style={{ background: '#FDEAEA', border: '1px solid #f5c6c6', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#8B2020', marginBottom: 16 }}>
          Database error: {error}
        </div>
      )}

      <form style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input name="q" defaultValue={q} placeholder="Search name or email…" style={{ ...inp, flex: 1, minWidth: 180 }} />
        <select name="status" defaultValue={status ?? ''} style={inp}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="VISITOR">Visitor</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0F0F0E', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Search
        </button>
        {(q || status) && (
          <Link href="/dashboard/members" style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E8E7DF', background: '#fff', color: '#6B6B64', fontSize: 13, textDecoration: 'none' }}>
            Clear
          </Link>
        )}
      </form>

      <div style={{ background: '#fff', border: '1px solid #E8E7DF', borderRadius: 12, overflow: 'hidden' }}>
        {members.length === 0 && !error ? (
          <p style={{ padding: 40, textAlign: 'center', color: '#6B6B64', fontSize: 13 }}>
            {total === 0 ? 'No members yet. Run npm run db:seed to add demo data.' : 'No members match your search.'}
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E8E7DF' }}>
                {['Member', 'Email', 'Phone', 'Status', 'Household', 'Groups', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.07em', color: '#6B6B64' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(m => {
                const [bg, fg] = statusStyle[m.status] ?? ['#F4F3EE', '#6B6B64']
                const groups = m.groupMemberships.map((gm: any) => gm.group.name)
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #F4F3EE', cursor: 'pointer' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F4F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, flexShrink: 0, color: '#6B6B64' }}>
                          {m.firstName[0]}{m.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{m.firstName} {m.lastName}</div>
                          <div style={{ fontSize: 11, color: '#6B6B64' }}>{m.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#6B6B64' }}>{m.email ?? '—'}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#6B6B64' }}>{m.phone ?? '—'}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: bg, color: fg, fontWeight: 500 }}>
                        {m.status[0] + m.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#6B6B64' }}>{m.household?.name ?? '—'}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#6B6B64' }}>
                      {groups.slice(0, 2).join(', ')}{groups.length > 2 ? ` +${groups.length - 2}` : ''}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <Link href={`/dashboard/members/${m.id}`} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid #E8E7DF', color: '#1C1C1A', textDecoration: 'none' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
