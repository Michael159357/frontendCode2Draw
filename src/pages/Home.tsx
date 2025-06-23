"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDiagram } from "../hooks/useDiagram"
import { useAuth } from "../contexts/AuthContext"
import { DIAGRAM_TYPES, type DiagramType } from "../types/diagram-types"
import EditorSidebar from "../components/EditorSidebar"
import DiagramArea from "../components/DiagramArea"
import type { ViewFormat } from "../components/DiagramFormatSelector"

export default function Home() {
  const [selectedDiagramType, setSelectedDiagramType] = useState<DiagramType>("json")
  const [jsonCode, setJsonCode] = useState(
    DIAGRAM_TYPES.find((type) => type.id === selectedDiagramType)?.placeholder || "",
  )
  const [viewFormat, setViewFormat] = useState<ViewFormat>("png")

  const { mermaidCode, isGenerating, error, generate, clearDiagram } = useDiagram()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleDiagramTypeChange = (newType: DiagramType) => {
    setSelectedDiagramType(newType)
    clearDiagram()
  }

  const handleGenerate = () => {
    const currentDiagramConfig = DIAGRAM_TYPES.find((type) => type.id === selectedDiagramType)!

    console.log("🎯 Botón generar presionado")
    console.log("Tipo seleccionado:", selectedDiagramType)
    console.log("Usuario autenticado:", isAuthenticated)

    // ✅ REDIRECCIÓN DIRECTA SIN CONFIRMACIÓN
    if (!isAuthenticated) {
      console.log("🚫 Usuario no autenticado, redirigiendo a login...")
      navigate("/login")
      return
    }

    // ✅ VERIFICAR QUE EL TIPO ESTÉ HABILITADO
    if (!currentDiagramConfig.enabled) {
      alert(`El tipo de diagrama "${currentDiagramConfig.name}" aún no está disponible.`)
      return
    }

    // ✅ GENERAR DIAGRAMA
    console.log("✅ Generando diagrama...")
    generate(jsonCode, selectedDiagramType)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <EditorSidebar
        selectedDiagramType={selectedDiagramType}
        onDiagramTypeChange={handleDiagramTypeChange}
        jsonCode={jsonCode}
        onJsonCodeChange={setJsonCode}
        onGenerate={handleGenerate}
        onClear={clearDiagram}
        isGenerating={isGenerating}
      />
      <DiagramArea
        selectedDiagramType={selectedDiagramType}
        mermaidCode={mermaidCode}
        error={error}
        onClearDiagram={clearDiagram}
        viewFormat={viewFormat}
        onViewFormatChange={setViewFormat}
      />
    </div>
  )
}
