'use client'

import { useEffect, useRef } from 'react'

interface ContributionGraphProps {
  data: {
    date: string
    count: number
  }[]
}

export function ContributionGraph({ data }: ContributionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const cellSize = 10
    const cellGap = 2
    const startX = 30
    const startY = 20

    // Draw month labels with glow effect
    ctx.fillStyle = '#E5E7EB'
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
    ctx.shadowBlur = 5
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach((month, index) => {
      ctx.fillText(month, startX + index * (cellSize + cellGap) * 4.3, 10)
    })

    // Draw day labels with glow effect
    const days = ['Mon', 'Wed', 'Fri']
    days.forEach((day, index) => {
      ctx.fillText(day, 2, startY + (index * 2 + 1) * (cellSize + cellGap))
    })

    // Reset shadow for contribution cells
    ctx.shadowBlur = 0

    // Draw contribution cells with glow effect
    data.forEach((day, index) => {
      const col = Math.floor(index / 7)
      const row = index % 7
      const x = startX + col * (cellSize + cellGap)
      const y = startY + row * (cellSize + cellGap)
      
      const color = getContributionColor(day.count)
      
      // Add glow effect
      if (day.count > 0) {
        ctx.shadowColor = color
        ctx.shadowBlur = 8
      } else {
        ctx.shadowBlur = 0
      }
      
      ctx.fillStyle = color
      ctx.fillRect(x, y, cellSize, cellSize)
    })

  }, [data])

  function getContributionColor(count: number): string {
    if (count === 0) return '#1F2937'
    if (count < 5) return '#4ADE80'
    if (count < 10) return '#22C55E'
    if (count < 15) return '#16A34A'
    return '#15803D'
  }

  return (
    <canvas
      ref={canvasRef}
      height={120}
      className="w-full"
    />
  )
}

