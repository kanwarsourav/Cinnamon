import React, { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { Observer } from "gsap/all"

gsap.registerPlugin(Observer)

export default function ScrollSlides({ children }) {
  const slidesRef = useRef([])
  const animating = useRef(false)
  const currentIndex = useRef(0)
  const observerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const slidesArray = React.Children.toArray(children)
  const slidesCount = slidesArray.length

  // 🔥 MAIN SLIDE FUNCTION (USED EVERYWHERE)
  const goToSlide = (index) => {
    if (animating.current) return
    if (index < 0 || index >= slidesCount) return
    if (index === currentIndex.current) return

    animating.current = true

    const direction = index > currentIndex.current ? 1 : -1
    const currentSlide = slidesRef.current[currentIndex.current]
    const nextSlide = slidesRef.current[index]

    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: "power4.inOut" },
      onComplete: () => {
        currentIndex.current = index
        setActiveIndex(index)
        animating.current = false
      }
    })

    if (direction === 1) {
      // Scroll DOWN
      gsap.set(nextSlide, { y: "100%", zIndex: slidesCount + 1 })
      tl.to(currentSlide, { scale: 0.96 }, 0)
      tl.to(nextSlide, { y: 0 }, 0)
    } else {
      // Scroll UP
      gsap.set(nextSlide, { y: "-100%", zIndex: slidesCount + 1 })
      tl.to(currentSlide, { y: "100%" }, 0)
      tl.to(nextSlide, { y: 0 }, 0)
    }
  }

  useEffect(() => {
    slidesRef.current = slidesRef.current.slice(0, slidesCount)

    // Initial state
    slidesRef.current.forEach((slide, i) => {
      gsap.set(slide, {
        y: i === 0 ? 0 : "100%",
        scale: 1,
        zIndex: slidesCount - i
      })
    })

    observerRef.current = Observer.create({
      target: window,
      type: "wheel,touch",
      onDown: () => goToSlide(currentIndex.current + 1),
      onUp: () => goToSlide(currentIndex.current - 1),
      tolerance: 10,
      preventDefault: true
    })

    return () => {
      observerRef.current && observerRef.current.kill()
    }

  }, [slidesCount])

  return (
    <div className="h-screen overflow-hidden relative bg-white">
      {slidesArray.map((slide, i) => (
        <div
          key={i}
          ref={(el) => (slidesRef.current[i] = el)}
          className="h-screen w-full absolute top-0 left-0"
        >
          {slide}
        </div>
      ))}

      {/* RIGHT SIDE DOTS */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {slidesArray.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "bg-black scale-125"
                : "bg-gray-400 hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  )
}