import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import './App.css'

const BASE_NAME = 'dimamurugov'

const PHRASES = [
  'www.dimamurugov.ru',
  'vk.com/dimamurugov',
  'telegram: @dimamurugov',
  'github.com/dimamurugov',
  'instagram: @dimamurugov',
  'dimamurugov@gmail.com',
]

const PHRASE_DURATION = 2800

function splitPhrase(phrase) {
  const index = phrase.indexOf(BASE_NAME)

  if (index === -1) {
    return { prefix: phrase, base: BASE_NAME, suffix: '' }
  }

  const prefix = phrase.slice(0, index)
  const suffix = phrase.slice(index + BASE_NAME.length)

  return { prefix, base: BASE_NAME, suffix }
}

function App() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isStepPaused, setIsStepPaused] = useState(false)
  const lineRef = useRef(null)
  const prefixRef = useRef(null)
  const baseRef = useRef(null)
  const suffixRef = useRef(null)
  const baseXRef = useRef(null)
  const hoverRef = useRef(false)
  const animationsRef = useRef([])

  useLayoutEffect(() => {
    if (!lineRef.current) return

    const runningAnimations = []

    if (prefixRef.current) {
      const prefixAnimation = animate(prefixRef.current, {
        keyframes: [
          { opacity: 0, translateY: -30, duration: 0 },
          { opacity: 1, translateY: 0, duration: 350, ease: 'outQuad' },
          { opacity: 1, translateY: 0, duration: 950, ease: 'linear' },
          { opacity: 0, translateY: 30, duration: 350, ease: 'inQuad' },
        ],
      })
      runningAnimations.push(prefixAnimation)
    }

    if (suffixRef.current) {
      const suffixAnimation = animate(suffixRef.current, {
        keyframes: [
          { opacity: 0, translateY: -30, duration: 0 },
          { opacity: 1, translateY: 0, duration: 350, ease: 'outQuad' },
          { opacity: 1, translateY: 0, duration: 950, ease: 'linear' },
          { opacity: 0, translateY: 30, duration: 350, ease: 'inQuad' },
        ],
      })
      runningAnimations.push(suffixAnimation)
    }

    if (baseRef.current) {
      const currentX = prefixRef.current ? prefixRef.current.offsetWidth : 0
      const previousX = baseXRef.current
      const hasPreviousPosition = previousX !== null
      const deltaX = hasPreviousPosition ? previousX - currentX : 0
      if (!hasPreviousPosition) {
        baseXRef.current = currentX
        baseRef.current.style.transform = 'translateX(0px) translateY(0px)'
      } else {
        if (Math.abs(deltaX) > 0.5) {
          const baseAnimation = animate(baseRef.current, {
            translateX: [deltaX, 0],
            duration: 500,
            ease: 'inOutQuad',
          })
          runningAnimations.push(baseAnimation)
        } else {
          baseRef.current.style.transform = 'translateX(0px) translateY(0px)'
        }
        baseXRef.current = currentX
      }
    }

    animationsRef.current = runningAnimations

    return () => {
      runningAnimations.forEach((animation) => animation.pause())
      animationsRef.current = []
    }
  }, [phraseIndex])

  useEffect(() => {
    if (isStepPaused) return undefined

    const timer = setTimeout(() => {
      if (hoverRef.current) {
        setIsStepPaused(true)
        return
      }

      setPhraseIndex((prev) => (prev + 1) % PHRASES.length)
    }, PHRASE_DURATION)

    return () => clearTimeout(timer)
  }, [phraseIndex, isStepPaused])

  const handleMouseEnter = () => {
    hoverRef.current = true
    setIsStepPaused(true)
    animationsRef.current.forEach((animation) => animation.pause())

    if (prefixRef.current) {
      prefixRef.current.style.opacity = '1'
      prefixRef.current.style.transform = 'translateY(0px)'
    }
    if (suffixRef.current) {
      suffixRef.current.style.opacity = '1'
      suffixRef.current.style.transform = 'translateY(0px)'
    }
    if (baseRef.current) {
      baseRef.current.style.transform = 'translateX(0px) translateY(0px)'
    }
  }

  const handleMouseLeave = () => {
    hoverRef.current = false

    if (isStepPaused) {
      setIsStepPaused(false)
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length)
    }
  }

  const currentPhrase = PHRASES[phraseIndex]
  const { prefix, base, suffix } = splitPhrase(currentPhrase)

  return (
    <main className="app">
      <div className="app__content" ref={lineRef}>
        <h1
          className="app__title"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            ref={prefixRef}
            className="app__part app__part--prefix"
          >
            {prefix}
          </span>
          <span
            ref={baseRef}
            className="app__part app__part--base"
          >
            {base}
          </span>
          <span
            ref={suffixRef}
            className="app__part app__part--suffix"
          >
            {suffix}
          </span>
        </h1>
      </div>
    </main>
  )
}

export default App
