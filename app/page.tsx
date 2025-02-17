"use client"

import { PuzzleGame } from "@/components/puzzle-game"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Stable-Diffusion Puzzle</h1>
      <PuzzleGame/>
    </div>
  )
}

