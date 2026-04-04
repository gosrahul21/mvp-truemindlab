'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Database, 
  Bot, 
  Mail, 
  Users
} from 'lucide-react'

const navItems = [
  { href: '/settings/knowledge', label: 'Knowledge Base', icon: Database },
  { href: '/settings/agents', label: 'AI Agents', icon: Bot },
  { href: '/settings/communication', label: 'Communication', icon: Mail },
  { href: '/settings/team', label: 'Team & Access', icon: Users }
]

export default function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full sticky z-100 top-0 flex-shrink-0 rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
      {/* <div className="mb-4 hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3">
          Configuration
        </p>
      </div> */}
      <nav className="space-x-1.5 flex ">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition
                ${isActive
                  ? 'bg-[#0f172a] border-2 text-white shadow-sm dark:border-gray-400 dark:text-gray-100'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#11192d] dark:hover:text-gray-100'
                }
              `}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
