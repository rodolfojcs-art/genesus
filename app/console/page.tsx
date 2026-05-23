'use client'
export const dynamic = 'force-dynamic'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import ChatConsole from '@/components/console/ChatConsole'

export default function ConsolePage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          <ChatConsole />
        </main>
      </div>
    </div>
  )
}
