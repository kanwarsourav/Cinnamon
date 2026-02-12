import React from 'react'

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">
      <h2 className="text-4xl font-extrabold mb-4">
        Grow Your Wealth with Confidence
      </h2>

      <p className="max-w-2xl text-gray-600 mb-8">
        Cinnamon Wealth helps you plan, invest, and secure your financial
        future with smart, transparent strategies.
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-3 bg-black text-white rounded-lg">
          Get Started
        </button>
        <button className="px-6 py-3 border border-black rounded-lg">
          Learn More
        </button>
      </div>
    </section>
  )
}
