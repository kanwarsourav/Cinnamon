import React from 'react'
// import Navbar from '@/Components/Navbar'
// import Footer from '@/Components/Footer'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  )
}
