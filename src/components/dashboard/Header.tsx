'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  userEmail?: string
  userName?: string
}

export function Header({ userEmail, userName }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg font-roboto text-sm transition-colors"
          style={{ backgroundColor: '#D3BCCC', color: '#333745' }}
        >
          Sair
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-roboto" style={{ backgroundColor: '#D3BCCC', color: '#333745' }}>
            {getInitials(userName, userEmail)}
          </div>
          <div>
            <div className="text-sm font-semibold font-roboto" style={{ color: '#333745' }}>
              {userName || 'Admin'}
            </div>
            <div className="text-xs font-roboto" style={{ color: '#333745', opacity: 0.7 }}>
              {userEmail}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}