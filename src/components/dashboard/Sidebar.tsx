'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  userName?: string
  userRole?: string
}

export function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: '/super-admin/dashboard', label: 'Dashboard', icon: 'grid' },
    { href: '/super-admin/lojas', label: 'Lojas', icon: 'store' },
    { href: '/super-admin/solicitacoes', label: 'Solicitações', icon: 'document' },
    { href: '/super-admin/documentos', label: 'Documentos', icon: 'document' },
  ]

  return (
    <div className="w-64 min-h-screen" style={{ backgroundColor: '#333745' }}>
      <div className="p-6 border-b" style={{ borderColor: '#E8D7F1' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl font-roboto" style={{ backgroundColor: '#D3BCCC', color: '#333745' }}>
            J
          </div>
          <div>
            <div className="font-bold font-roboto" style={{ color: '#E8D7F1' }}>JDS Sales</div>
            <div className="text-sm font-roboto" style={{ color: '#E8D7F1', opacity: 0.8 }}>Admin</div>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-roboto ${
                isActive ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: isActive ? '#D3BCCC' : 'transparent',
                color: isActive ? '#333745' : '#E8D7F1',
              }}
            >
                <span className="text-lg font-roboto">
                {item.icon === 'grid' ? '▦' : item.icon === 'store' ? 'S' : 'D'}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}