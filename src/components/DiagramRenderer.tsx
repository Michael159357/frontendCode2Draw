"use client"
import MermaidRenderer from "./MermaidRenderer"
import ERRenderer from "./ERRenderer"
import type { DiagramType } from "../types/diagram-types"

type ViewFormat = "png" | "svg"

interface DiagramRendererProps {
  code: string
  diagramType: DiagramType
  viewFormat: ViewFormat
  className?: string
}

export default function DiagramRenderer({ code, diagramType, viewFormat, className = "" }: DiagramRendererProps) {
  // Remover el estado local de viewFormat ya que ahora viene como prop
  // const [viewFormat, setViewFormat] = useState<ViewFormat>("png")
  // const handleFormatChange = (format: ViewFormat) => {
  //   setViewFormat(format)
  // }

  return (
    <div className={className}>
      {/* Header simplificado sin selector */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          {diagramType === "er" ? (
            <>
              <span className="text-blue-600">🔗</span>
              <span className="text-sm text-blue-700">
                Diagrama ER con d3-graphviz • Mostrando en {viewFormat.toUpperCase()}
              </span>
            </>
          ) : (
            <>
              <span className="text-green-600">📊</span>
              <span className="text-sm text-green-700">
                Diagrama con Mermaid.js • Mostrando en {viewFormat.toUpperCase()}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Renderizado del diagrama */}
      {diagramType === "er" ? (
        <ERRenderer code={code} viewFormat={viewFormat} />
      ) : (
        <MermaidRenderer code={code} viewFormat={viewFormat} />
      )}
    </div>
  )
}
