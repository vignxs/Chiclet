"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TypewriterEffectProps {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}

export const TypewriterEffect = ({ words, className, cursorClassName }: TypewriterEffectProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const word = words[currentWordIndex].text

    const timer = setTimeout(() => {
      // If deleting, remove a character
      if (isDeleting) {
        setCurrentText((prev) => prev.substring(0, prev.length - 1))
        setTypingSpeed(75) // Faster when deleting

        // When fully deleted, move to next word
        if (currentText === "") {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
          setTypingSpeed(150)
        }
      }
      // If typing, add a character
      else {
        setCurrentText(word.substring(0, currentText.length + 1))
        setTypingSpeed(150)

        // When fully typed, pause then start deleting
        if (currentText === word) {
          setTypingSpeed(2000) // Pause at the end
          setIsDeleting(true)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [currentText, currentWordIndex, isDeleting, typingSpeed, words])

  return (
    <div className={cn("inline-flex", className)}>
      <span className="relative inline-block leading-none">
        {words.map((word, idx) => {
          const isCurrentWord = idx === currentWordIndex

          return (
            <span key={idx} className={cn("absolute top-0 left-0 opacity-0 mx-3", isCurrentWord && "opacity-100", word.className)}>
              {isCurrentWord ? currentText : word.text}
            </span>
          )
        })}
      </span>
      <span className={cn("ml-1 inline-block h-[1em] w-[4px] animate-blink bg-black", cursorClassName)} />
    </div>
  )
}
