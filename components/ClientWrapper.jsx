'use client'

import { useEffect, useState } from 'react'
import GlobalHazardAlerts from './GlobalHazardAlerts'

const ClientWrapper = ({ children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      <GlobalHazardAlerts />
      {children}
    </>
  )
}

export default ClientWrapper