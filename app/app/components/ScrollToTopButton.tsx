"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export  function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
      
        <Button 
         className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white hover:bg-purple-700  "
          onClick={scrollToTop}>
           Sign In
        </Button>
      
     
  )
}