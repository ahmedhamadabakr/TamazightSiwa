"use client"

import React from "react"
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion"

type AnyProps = Record<string, any>

// استخدام LazyMotion wrapper لتقليل حجم الحزمة
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}

// استخدام m بدلاً من motion لتقليل الحجم
export const MotionDiv = m.div
export const MotionH1 = m.h1
export const MotionH2 = m.h2
export const MotionP = m.p
export const MotionTr = m.tr
export const MotionTd = m.td
export const MotionSpan = m.span
export const MotionUl = m.ul
export const MotionLi = m.li

// تصدير AnimatePresence مباشرة
export { AnimatePresence }
