import type { ReactNode } from 'react'
import AppShell from '@/app/components/dashboard/AppShell'

export default function BillingLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
