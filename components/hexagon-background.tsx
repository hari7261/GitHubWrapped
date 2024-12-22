'use client'

import { useEffect, useRef } from 'react'

export function HexagonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawHexagon = (x: number, y: number, size: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        const xPos = x + size * Math.cos(angle)
        const yPos = y + size * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(xPos, yPos)
        } else {
          ctx.lineTo(xPos, yPos)
        }
      }
      ctx.closePath()
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      ctx.lineWidth = 1

      const size = 30
      const cols = Math.ceil(canvas.width / (size * 2)) + 2
      const rows = Math.ceil(canvas.height / (size * 1.7)) + 2
      const offset = Date.now() / 5000

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * size * 2 + (j % 2) * size
          const y = j * size * 1.7
          const wave = Math.sin(x / 50 + offset) * 5
          drawHexagon(x, y + wave, size)
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: 'linear-gradient(to bottom, #000000, #1a1a1a)' }}
    />
  )
}

