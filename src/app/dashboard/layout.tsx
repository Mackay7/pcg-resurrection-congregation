'use client'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { section:'Main', items:[{ label:'Dashboard', href:'/dashboard', icon:'⊞' }]},
  { section:'People', items:[{ label:'Members', href:'/dashboard/members', icon:'👥' },{ label:'Groups', href:'/dashboard/groups', icon:'🫂' }]},
  { section:'Services', items:[{ label:'Attendance', href:'/dashboard/attendance', icon:'✓' },{ label:'Events', href:'/dashboard/events', icon:'📅' }]},
  { section:'Finance', items:[{ label:'Giving', href:'/dashboard/giving', icon:'♡' }]},
  { section:'Outreach', items:[{ label:'Communications', href:'/dashboard/communications', icon:'✉' },{ label:'Pastoral Report', href:'/dashboard/report', icon:'📄' }]},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'system-ui,sans-serif' }}>
      <nav style={{ width:220, background:'#0F0F0E', display:'flex', flexDirection:'column', flexShrink:0, overflowY:'auto' }}>
        <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
          <div style={{ fontSize:24, marginBottom:10 }}>⛪</div>
          <div style={{ fontSize:14, color:'#fff', lineHeight:1.3, fontWeight:500 }}>PCG, Resurrection<br/>Congregation</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', marginTop:2 }}>Atlanta, Georgia</div>
        </div>
        {NAV.map(g => (
          <div key={g.section}>
            <div style={{ fontSize:10, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.25)', padding:'14px 18px 5px' }}>{g.section}</div>
            {g.items.map(item => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <a key={item.href} href={item.href} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 18px', fontSize:13, textDecoration:'none', color:active?'#fff':'rgba(255,255,255,.55)', background:active?'rgba(255,255,255,.08)':'transparent', borderLeft:`2px solid ${active?'#C9A84C':'transparent'}`, transition:'all .15s' }}>
                  <span style={{ width:18, textAlign:'center' }}>{item.icon}</span>
                  {item.label}
                </a>
              )
            })}
          </div>
        ))}
        <div style={{ marginTop:'auto', padding:'14px 18px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'#C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:500, color:'#0F0F0E', flexShrink:0 }}>PA</div>
          <div>
            <div style={{ fontSize:12, color:'#fff' }}>PCG Admin</div>
            <button onClick={signOut} style={{ fontSize:10, color:'rgba(255,255,255,.35)', background:'none', border:'none', cursor:'pointer', padding:0 }}>Sign out →</button>
          </div>
        </div>
      </nav>
      <main style={{ flex:1, overflowY:'auto', background:'#FAFAF7' }}>{children}</main>
    </div>
  )
}
