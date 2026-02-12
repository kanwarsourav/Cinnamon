import React from 'react'

export default function Slide({ children, bg = 'bg-white' }) {
  return (
    <section className={`h-screen flex items-center justify-center ${bg}`}>
      {children}
    </section>
  )
}
