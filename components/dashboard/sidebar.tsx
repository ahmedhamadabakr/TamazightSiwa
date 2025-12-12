'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3,
  Users,
  MapPin,
  LogOut,
  Menu,
  X,
  Image,
  Star,
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

interface SidebarProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [userRole, setUserRole] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'General Manager'
    setUserRole(storedRole)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
      document.body.style.paddingRight = isMobileMenuOpen
        ? `${window.innerWidth - document.documentElement.clientWidth}px`
        : ''
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/', redirect: true })
    } catch (error) {
      router.push('/')
    }
  }

  const menuItems = useMemo(() => {
    if (!session?.user?.id) return []
    return [
      { href: `/dashboard/${session.user.id}`, label: 'Overview', icon: BarChart3 },
      { href: `/dashboard/${session.user.id}/users`, label: 'Users Management', icon: Users },
      { href: `/dashboard/${session.user.id}/tours`, label: 'Tours Management', icon: MapPin },
      { href: `/dashboard/${session.user.id}/reviews`, label: 'Reviews Management', icon: Star },
      { href: `/dashboard/${session.user.id}/gallery`, label: 'Gallery Management', icon: Image },
    ]
  }, [session])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">Loading Dashboard...</div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-16 bg-white flex items-center justify-between px-4 border-b transition-all duration-300 md:hidden ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-lg font-semibold tracking-tight">
            {menuItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
          </h1>
        </div>
        <div className="w-6" />
      </header>

      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0 md:shadow-none shadow-xl`}
      >
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg group-hover:scale-105 transition">
              TS
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight group-hover:text-blue-700 transition">Tamazight Siwa</h2>
              <p className="text-xs text-gray-500">Dashboard Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm border ${
                  isActive
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-blue-100 text-blue-700 flex items-center justify-center rounded-xl font-bold text-lg">
              {userRole?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{userRole || 'Loading...'}</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-xl transition-all shadow-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 md:ml-64 bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}