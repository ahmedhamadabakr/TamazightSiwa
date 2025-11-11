"use client"

import React from "react"

type AnyProps = Record<string, any>

function stripMotionProps<P extends AnyProps>(props: P): P {
  const {
    initial,
    animate,
    exit,
    whileInView,
    whileHover,
    whileTap,
    transition,
    viewport,
    variants,
    layout,
    layoutId,
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    ...rest
  } = props as AnyProps
  return rest as P
}

function createMotionFallback<T extends keyof JSX.IntrinsicElements>(tag: T) {
  return function MotionFallback(props: AnyProps) {
    const [MotionTag, setMotionTag] = React.useState<React.ComponentType<AnyProps> | null>(null)

    React.useEffect(() => {
      let mounted = true
      ;(async () => {
        try {
          const { motion } = await import("framer-motion")
          if (mounted) {
            const comp = (motion as AnyProps)[tag]
            setMotionTag(() => comp)
          }
        } catch {
          // ignore if framer-motion cannot be loaded
        }
      })()
      return () => { mounted = false }
    }, [])

    if (MotionTag) {
      return <MotionTag {...props} />
    }
    // Server and first client paint: render plain element without motion-only props
    const PlainTag = tag as any
    return <PlainTag {...stripMotionProps(props)} />
  }
}

// Common motion wrappers — add tags as needed to avoid importing framer-motion at module load
export const MotionDiv = createMotionFallback("div")
export const MotionH1 = createMotionFallback("h1")
export const MotionH2 = createMotionFallback("h2")
export const MotionP = createMotionFallback("p")
export const MotionTr = createMotionFallback("tr")
export const MotionTd = createMotionFallback("td")
export const MotionSpan = createMotionFallback("span")
export const MotionUl = createMotionFallback("ul")
export const MotionLi = createMotionFallback("li")

// AnimatePresence fallback — loads AnimatePresence dynamically. If not available, renders children directly.
export function AnimatePresenceFallback({ children, ...props }: AnyProps) {
  const [AnimatePresence, setAnimatePresence] = React.useState<any | null>(null)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const mod = await import("framer-motion")
        if (mounted) setAnimatePresence(() => mod.AnimatePresence)
      } catch {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  if (AnimatePresence) {
    const AP = AnimatePresence
    return <AP {...props}>{children}</AP>
  }
  return <>{children}</>
}
