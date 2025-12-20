'use client'

import { useEffect } from 'react'

const AsyncCssLoader = () => {
  useEffect(() => {
    import('@/app/globals.css')
    import('@/components/ColorContrastFix.css')
  }, [])

  return null
}

export default AsyncCssLoader