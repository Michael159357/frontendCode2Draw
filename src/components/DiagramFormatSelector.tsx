"use client"

import { useState } from "react"
import { ImageIcon, FileImage, ChevronDown } from "lucide-react"

export type ViewFormat = "png" | "svg"

interface DiagramFormatSelectorProps {
  selectedFormat: ViewFormat
  onFormatChange: (format: ViewFormat) => void
}

export default function DiagramFormatSelector({ selectedFormat, onFormatChange }: DiagramFormatSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const viewFormats = [
    {
      id: "png" as ViewFormat,
      name: "PNG",
      icon: <ImageIcon className="w-4 h-4" />,
      description: "Vista como imagen",
    },
    {
      id: "svg" as ViewFormat,
      name: "SVG",
      icon: <FileImage className="w-4 h-4" />,
      description: "Vista vectorial",
    },
  ]

  const currentFormat = viewFormats.find((format) => format.id === selectedFormat)!

  const handleFormatChange = (format: ViewFormat) => {
    onFormatChange(format)
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        title={`Mostrar como ${currentFormat.name}`}
      >
        {currentFormat.icon}
        <span>Mostrar en {currentFormat.name}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[180px]">
          {viewFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => handleFormatChange(format.id)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                selectedFormat === format.id ? "bg-blue-50 text-blue-700" : ""
              }`}
            >
              {format.icon}
              <div>
                <div className="font-medium">{format.name}</div>
                <div className="text-xs text-gray-500">{format.description}</div>
              </div>
              {selectedFormat === format.id && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
