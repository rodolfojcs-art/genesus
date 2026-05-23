'use client'
import { useEffect } from 'react'
import { useGenesusStore } from '@/stores/genesus-store'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useGenesusStore.persist.rehydrate()
  }, [])
  return <>{children}</>
}
