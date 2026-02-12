import React, { useRef, useState } from 'react'

export default function ScrollSlides({ children }) {
  const containerRef = useRef(null)
  const isAnimating = useRef(false)
  const delayTimeout = useRef(null)

  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  const slidesArray = React.Children.toArray(children)
  const slidesCount = slidesArray.length

  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)

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
        {slidesArray}
      </div>

      {/* Dots Navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {slidesArray.map((child, i) => {

          // 🔥 Get INNER component name (inside <Slide>)
          const innerComponent = child.props?.children

          const componentName =
            innerComponent?.type?.displayName ||
            innerComponent?.type?.name ||
            `Slide ${i + 1}`

          return (
            <div key={i} className="relative flex items-center group">
              
              {/* Tooltip */}
              <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md shadow-lg">
                {componentName}
              </div>

              {/* Dot */}
              <button
                onClick={() => scrollToSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? 'bg-black scale-125'
                    : 'bg-gray-400 hover:scale-110'
                }`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
