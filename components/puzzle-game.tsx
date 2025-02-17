"use client"

import { useEffect, useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Shuffle, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Tile {
  id: number
  currentPos: number
}

interface FrameProps {
  children: ReactNode
  variant?: "default" | "left"
}

function Frame({ children, variant = "default" }: FrameProps) {
  return (
    <div className={`inline-block bg-[#ddc] border-[2vmin] rounded-sm p-6 shadow-[inset_0_0_5px_0_rgba(0,0,0,0.25),0_5px_10px_0_rgba(0,0,0,0.25)] text-center relative 
      before:content-[''] before:absolute before:-inset-2 before:rounded-sm before:shadow-[inset_0_2px_5px_0_rgba(0,0,0,0.25)] 
      after:content-[''] after:absolute after:-inset-2.5 after:rounded-sm after:shadow-[0_2px_5px_0_rgba(0,0,0,0.25)]
      ${variant === "left" ? 
        "border-l-[#eee] border-r-white border-t-[#eee] border-b-[#ddd] rotate-90 origin-left" : 
        "border-[#eee] border-b-white border-t-[#ddd]"
      }`}>
      {children}
    </div>
  )
}

export function PuzzleGame() {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
  const [moves, setMoves] = useState(0)
  const [gridSize, setGridSize] = useState(3)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const getImageUrl = (size: number) => {
    const newIndex = (currentImageIndex + 1) % 4
    setCurrentImageIndex(newIndex)
    
    switch (size) {
      case 2:
        return `/test${5 + newIndex}.png` // Rotates through test5-8
      case 3:
        return `/test${1 + newIndex}.png` // Rotates through test1-4
      case 4:
        return `/test9.png`
      default:
        return '/test1.png'
    }
  }

  const [imageUrl, setImageUrl] = useState('/test3.png')

  const initializeTiles = () => {
    const totalTiles = gridSize * gridSize
    const newTiles = Array.from({ length: totalTiles }, (_, index) => ({
      id: index,
      currentPos: index,
    }))
    shuffleTiles(newTiles)
    setMoves(0)
    setImageUrl(getImageUrl(gridSize))
  }

  const shuffleTiles = (tilesArray: Tile[] = tiles) => {
    const newTiles = [...tilesArray]
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newTiles[i].currentPos, newTiles[j].currentPos] = [newTiles[j].currentPos, newTiles[i].currentPos]
    }
    setTiles(newTiles)
    setIsComplete(false)
    setSelectedTile(null)
    setMoves(0)
  }

  const handleTileClick = (clickedTile: Tile) => {
    if (!selectedTile) {
      setSelectedTile(clickedTile)
    } else {
      const newTiles = tiles.map((tile) => ({
        ...tile,
        currentPos:
          tile.id === selectedTile.id
            ? clickedTile.currentPos
            : tile.id === clickedTile.id
              ? selectedTile.currentPos
              : tile.currentPos,
      }))

      setTiles(newTiles)
      setSelectedTile(null)
      setMoves((prev) => prev + 1)
      checkCompletion(newTiles)
    }
  }

  const checkCompletion = (currentTiles: Tile[]) => {
    const isComplete = currentTiles.every((tile) => tile.currentPos === tile.id)
    setIsComplete(isComplete)
    if (isComplete) {
      toast.success(
        <div className="text-center">
          <div className="text-xl font-bold mb-1">🎉 Congratulations! 🎉</div>
        </div>,
        {
          duration: 1000,
          className: "puzzle-completion-toast",
          position: "top-center",
          style: {
            background: "white",
            border: "2px solid #4CAF50",
            borderRadius: "12px",
            padding: "16px",
            maxWidth: "300px",
            margin: "0 auto",
            transform: "translateY(200px)",
          },
        },
      )
    }
  }

  useEffect(() => {
    initializeTiles()
  }, [gridSize])

  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="font-['Playfair_Display'] text-3xl mb-2 text-center">
        Stable-Diffusion Puzzle
      </h1>

      <div className="relative">
        <Frame>
          <div className="relative w-[300px] h-[300px] bg-gray-200 rounded shadow-inner overflow-hidden">
            {tiles.map((tile) => {
              const row = Math.floor(tile.currentPos / gridSize)
              const col = tile.currentPos % gridSize
              const originalRow = Math.floor(tile.id / gridSize)
              const originalCol = tile.id % gridSize
              const isSelected = selectedTile?.id === tile.id

              return (
                <div
                  key={tile.id}
                  className={`absolute cursor-pointer transition-all duration-200 ease-in-out hover:brightness-110 hover:scale-[1.02] ${
                    isSelected ? "ring-4 ring-blue-500 ring-opacity-75 shadow-lg scale-[0.95]" : ""
                  } border-1 border-t-[#ccb] border-r-[#eed] border-b-[#ffe] border-l-[#eed]`}
                  style={{
                    width: `${100 / gridSize}%`,
                    height: `${100 / gridSize}%`,
                    top: `${row * (100 / gridSize)}%`,
                    left: `${col * (100 / gridSize)}%`,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: `${gridSize * 100}%`,
                    backgroundPosition: `${originalCol * (100 / (gridSize - 1))}% ${originalRow * (100 / (gridSize - 1))}%`,
                    zIndex: isSelected ? 10 : 1,
                  }}
                  onClick={() => handleTileClick(tile)}
                />
              )
            })}
          </div>
        </Frame>
      </div>

      <div className="flex items-center gap-4">
        <Select value={gridSize.toString()} onValueChange={(value) => setGridSize(Number(value))}>
          <SelectTrigger className="w-[100px] bg-white">
            <SelectValue placeholder="Grid Size" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="2" className="text-center">2x2</SelectItem>
            <SelectItem value="3" className="text-center">3x3</SelectItem>
            <SelectItem value="4" className="text-center">4x4</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => shuffleTiles()} className="flex items-center gap-2" variant="outline">
          <Shuffle className="w-4 h-4" />
          Shuffle
        </Button>
        <Button onClick={initializeTiles} className="flex items-center gap-2" variant="default">
          <RotateCcw className="w-4 h-4" />
          New Game
        </Button>
      </div>

      {/* Updated Museum Label */}
      <div className="mt-1 max-w-[350px] p-3 bg-white border border-[#e0e0e0] shadow-sm">
        <h2 className="font-['Playfair_Display'] text-xl mb-1 text-[#333]">
          <a href="https://zuhairsan.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:underline">
            Zuhair Aziz
          </a>
        </h2>
        <div className="font-['Lato'] text-xs text-[#666] italic mb-3">
          ControlNet Illusion Puzzle (2025)
        </div>
        <p className="font-['Lato'] text-xs leading-relaxed text-[#444]">
          Stable Diffusion with ControlNet—Crafting visual illusions by manipulating latent space with structural control.
        </p>
      </div>
    </div>
  )
}

