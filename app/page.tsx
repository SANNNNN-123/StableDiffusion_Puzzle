"use client"

import { PuzzleGame } from "@/components/puzzle-game"
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <PuzzleGame />
      <Analytics />
    </div>
  )
}

