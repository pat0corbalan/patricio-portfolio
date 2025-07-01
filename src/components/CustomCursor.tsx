import { useEffect, useState } from 'react'

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detectar si es dispositivo táctil (móvil/tablet)
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (isTouchDevice) return // No hacer nada si es táctil

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', updatePosition)
    const interactiveElements = document.querySelectorAll('a, button, input, textarea')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [isTouchDevice])

  if (isTouchDevice) return null // No renderizar cursor en móviles

  return (
    <div
      className={`fixed pointer-events-none z-50 rounded-full bg-purple-400/70 dark:bg-purple-600/70 transition-all duration-150 ease-out ${
        isHovering ? 'w-12 h-12 scale-125' : 'w-8 h-8'
      }`}
      style={{ transform: `translate(${position.x - (isHovering ? 24 : 16)}px, ${position.y - (isHovering ? 24 : 16)}px)` }}
    />
  )
}

export default CustomCursor
