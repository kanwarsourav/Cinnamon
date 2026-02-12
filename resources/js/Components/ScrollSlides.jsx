import React, { useRef, useState } from 'react'

export default function ScrollSlides({ children }) {
  const containerRef = useRef(null)
  const isAnimating = useRef(false)
  const delayTimeout = useRef(null)

  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  const slidesCount = React.Children.count(children)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToSlide = (index) => {
    if (index < 0 || index >= slidesCount) return

    isAnimating.current = true
    setActiveIndex(index)

    containerRef.current.style.transform = `translateY(-${index * 100}vh)`

    setTimeout(() => {
      isAnimating.current = false
    }, 800)
  }

  // 🖱 Desktop scroll
  const handleWheel = (e) => {
    if (isAnimating.current) return

    const direction = e.deltaY > 0 ? 1 : -1

    clearTimeout(delayTimeout.current)

    delayTimeout.current = setTimeout(() => {
      scrollToSlide(activeIndex + direction)
    }, 200)
  }

  // 📱 Touch start
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  // 📱 Touch move
  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY
  }

  // 📱 Touch end
  const handleTouchEnd = () => {
    if (isAnimating.current) return

    const distance = touchStartY.current - touchEndY.current

    // Minimum swipe distance
    if (Math.abs(distance) < 50) return

    const direction = distance > 0 ? 1 : -1
    scrollToSlide(activeIndex + direction)
  }

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen overflow-hidden"
    >
      {/* Slides Wrapper */}
      <div
        ref={containerRef}
        className="transition-transform duration-700 ease-in-out"
      >
        {children}
      </div>

      {/* Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {[...Array(slidesCount)].map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? 'bg-black scale-125'
                : 'bg-gray-400 hover:scale-110'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
