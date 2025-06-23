"use client"
import { Trash2, Save } from "lucide-react"
import { DIAGRAM_TYPES, type DiagramType } from "../types/diagram-types"
import DiagramRenderer from "./DiagramRenderer"
import DiagramFormatSelector, { type ViewFormat } from "./DiagramFormatSelector"
import DiagramExportSelector, { type ExportFormat } from "./DiagramExportSelector"
import { useExport } from "../hooks/useExport"

interface DiagramAreaProps {
  selectedDiagramType: DiagramType
  mermaidCode: string | null
  error: string | null
  onClearDiagram: () => void
  viewFormat: ViewFormat
  onViewFormatChange: (format: ViewFormat) => void
}

export default function DiagramArea({
  selectedDiagramType,
  mermaidCode,
  error,
  onClearDiagram,
  viewFormat,
  onViewFormatChange,
}: DiagramAreaProps) {
  const currentDiagramConfig = DIAGRAM_TYPES.find((type) => type.id === selectedDiagramType)!
  const { isExporting, exportDiagram } = useExport()

  const handleExport = (format: ExportFormat) => {
    if (mermaidCode) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, "-")
      const filename = `${selectedDiagramType}-diagram-${timestamp}`
      exportDiagram(mermaidCode, selectedDiagramType, format, filename)
    }
  }

  const handleSave = () => {
    // Placeholder para funcionalidad de guardar
    alert("Funcionalidad de guardar estará disponible próximamente")
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">
              {currentDiagramConfig.icon} {currentDiagramConfig.name}
            </h3>
            {mermaidCode && (
              <>
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  ✓ Diagrama {selectedDiagramType.toUpperCase()} generado
                </span>
                <DiagramFormatSelector selectedFormat={viewFormat} onFormatChange={onViewFormatChange} />
              </>
            )}
          </div>

          {mermaidCode && (
            <div className="flex items-center space-x-2">
              <DiagramExportSelector onExport={handleExport} isExporting={isExporting} />

              <button
                onClick={handleSave}
                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                title="Guardar diagrama (próximamente)"
              >
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </button>

              <button
                onClick={onClearDiagram}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Limpiar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Área de visualización */}
      <div className="flex-1 bg-white overflow-auto">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Error al generar diagrama {selectedDiagramType.toUpperCase()}</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {mermaidCode ? (
          <div className="p-6">
            <DiagramRenderer
              code={mermaidCode}
              diagramType={selectedDiagramType}
              viewFormat={viewFormat}
              className="w-full"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">{currentDiagramConfig.icon}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tu diagrama aparecerá aquí</h3>
              <p className="text-gray-500 mb-4">
                Escribe tu código JSON en el panel izquierdo y presiona 'Generar {currentDiagramConfig.name}'
              </p>

              {/* Ejemplo de JSON */}
              <div className="text-left bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Ejemplo para {currentDiagramConfig.name}:</p>
                <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
                  {currentDiagramConfig.placeholder}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
