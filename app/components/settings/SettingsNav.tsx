'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/settings/communication', label: 'Communication' },
  { href: '/settings/email', label: 'Email' },
  { href: '/settings/voice', label: 'Voice' },
  { href: '/settings/booking', label: 'Booking' },
  { href: '/settings/team', label: 'Team' },
  { href: '/settings/business', label: 'Business' },
]

export default function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200

              ${isActive
                ? `
                  bg-gray-900 text-white
                  shadow-sm
                  dark:bg-white dark:text-gray-900
                `
                : `
                  text-gray-600 hover:text-gray-900
                  hover:bg-gray-100
                  dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-[#1a2035]
                `
              }
            `}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
