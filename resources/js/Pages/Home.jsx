import React from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '../Layouts/AppLayout'

import ScrollSlides from '../Components/ScrollSlides'
import Slide from '../Components/Slide'

import Hero from '../Components/Hero'
import FutureSlide from '../Components/FutureSlide'
// import InvestmentSlide from '../Components/InvestmentSlide'

export default function Home() {
  return (
    <AppLayout>
      <Head title="Home" />

      <ScrollSlides>
        <Slide>
          <Hero />
        </Slide>

        <Slide bg="bg-gray-50">
          <FutureSlide />
        </Slide>

        <Slide>
          {/* <InvestmentSlide /> */}
        </Slide>

        <Slide bg="bg-gray-100">
          <h2 className="text-5xl font-bold">Protection</h2>
        </Slide>

        <Slide bg="bg-black text-white">
          <h2 className="text-5xl font-bold">Get Started</h2>
        </Slide>
      </ScrollSlides>
    </AppLayout>
  )
}
