// components/ui/DropdownMenu.tsx
'use client'

import { useState, ReactNode } from 'react'

type DropdownMenuProps = {
  trigger: ReactNode
  items: { label: string; onClick: () => void }[]
}

export default function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#1a2035] transition"
      >
        {trigger}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-lg dark:border-gray-800/50 dark:bg-[#11192d]/80 z-50">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a2035] transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
