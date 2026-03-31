import type { ReactNode } from 'react'
import AppShell from '@/app/components/dashboard/AppShell'

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
