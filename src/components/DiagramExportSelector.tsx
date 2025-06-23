"use client"
import { useState } from "react"
import { Download, FileImage, ImageIcon, FileText, ChevronDown } from "lucide-react"

export type ExportFormat = "png" | "svg" | "pdf"

interface DiagramExportSelectorProps {
  onExport: (format: ExportFormat) => void
  isExporting?: boolean
}

export default function DiagramExportSelector({ onExport, isExporting = false }: DiagramExportSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const exportFormats = [
    {
      id: "png" as ExportFormat,
      name: "PNG",
      icon: <ImageIcon className="w-4 h-4" />,
      description: "Imagen de alta calidad",
    },
    {
      id: "svg" as ExportFormat,
      name: "SVG",
      icon: <FileImage className="w-4 h-4" />,
      description: "Vector escalable",
    },
    {
      id: "pdf" as ExportFormat,
      name: "PDF",
      icon: <FileText className="w-4 h-4" />,
      description: "Documento portable",
    },
  ]

  const handleExport = (format: ExportFormat) => {
    onExport(format)
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Exportar diagrama"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? "Exportando..." : "Exportar"}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isDropdownOpen && !isExporting && (
        <div className="absolute z-10 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[180px]">
          {exportFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => handleExport(format.id)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
            >
              {format.icon}
              <div>
                <div className="font-medium">{format.name}</div>
                <div className="text-xs text-gray-500">{format.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
