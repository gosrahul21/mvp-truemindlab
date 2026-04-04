import { ReactNode } from "react";
import AppShell from "../components/dashboard/AppShell";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        {/* Sidebar Nav */}
        {/* <SettingsSidebar /> */}

        {/* Dynamic Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </AppShell>
  )
}
