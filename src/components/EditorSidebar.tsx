"use client"
import { useState } from "react"
import {
  Code,
  Settings,
  FileText,
  Upload,
  Clipboard,
  Github,
  Play,
  Trash2,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { DIAGRAM_TYPES, type DiagramType } from "../types/diagram-types"
import { useAuth } from "../contexts/AuthContext"
import { useFileOperations } from "../hooks/useFileOperations"
import TokenInfo from "./TokenInfo"

interface EditorSidebarProps {
  selectedDiagramType: DiagramType
  onDiagramTypeChange: (type: DiagramType) => void
  jsonCode: string
  onJsonCodeChange: (code: string) => void
  onGenerate: () => void
  onClear: () => void
  isGenerating: boolean
}

interface UploadStatus {
  type: "success" | "error" | null
  message: string
}

export default function EditorSidebar({
  selectedDiagramType,
  onDiagramTypeChange,
  jsonCode,
  onJsonCodeChange,
  onGenerate,
  onClear,
  isGenerating,
}: EditorSidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ type: null, message: "" })
  const { isAuthenticated, token } = useAuth()
// elimina 'user' si no lo usas


  // Obtener la configuración del tipo seleccionado
  const currentDiagramConfig = DIAGRAM_TYPES.find((type) => type.id === selectedDiagramType)!

  const {
    githubUrl,
    setGithubUrl,
    isLoadingFromGithub,
    fileInputRef,
    getAcceptedFileTypes,
    handleFileUpload,
    handlePasteFromClipboard,
    handleLoadFromGithub,
  } = useFileOperations(selectedDiagramType, onJsonCodeChange, setUploadStatus)

  const handleDiagramTypeChange = (newType: DiagramType) => {
    const newConfig = DIAGRAM_TYPES.find((type) => type.id === newType)!
    onDiagramTypeChange(newType)
    onJsonCodeChange(newConfig.placeholder)
    setIsDropdownOpen(false)
    setUploadStatus({ type: null, message: "" })
  }

  const handleClear = () => {
    onJsonCodeChange("")
    onClear()
    setUploadStatus({ type: null, message: "" })
  }

  const isValidJson = () => {
    try {
      JSON.parse(jsonCode)
      return true
    } catch {
      return false
    }
  }

  // Determinar si el botón debe estar deshabilitado
  const isButtonDisabled = isGenerating || !jsonCode.trim() || !isValidJson() || !currentDiagramConfig.enabled

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Diagram Generator</h2>
        <p className="text-sm text-gray-600 mt-1">Convierte tu JSON en diagramas visuales</p>

        {/* Selector de tipo de diagrama */}
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de diagrama</label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center">
                <span className="mr-2">{currentDiagramConfig.icon}</span>
                <span>{currentDiagramConfig.name}</span>
                {!currentDiagramConfig.enabled && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Próximamente</span>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {DIAGRAM_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleDiagramTypeChange(type.id)}
                    disabled={!type.enabled}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                      selectedDiagramType === type.id ? "bg-blue-50 text-blue-700" : ""
                    } ${!type.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{type.icon}</span>
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                    {!type.enabled && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Próximamente</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estado de autenticación - Solo mostrar cuando esté autenticado */}
        {isAuthenticated && token && (
          <div className="mt-3">
            <TokenInfo />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 border-b-2 border-blue-500">
          <Code className="w-4 h-4 mr-2" />
          JSON Editor
        </button>
        <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
          <Settings className="w-4 h-4 mr-2" />
          Config
        </button>
        <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
          <FileText className="w-4 h-4 mr-2" />
          Docs
        </button>
      </div>

      {/* Editor de código */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Código JSON</label>
            <div className="flex items-center space-x-1">
              {isValidJson() ? (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">✓ JSON válido</span>
              ) : (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">✗ JSON inválido</span>
              )}
            </div>
          </div>

          {/* Estado de upload */}
          {uploadStatus.type && (
            <div
              className={`mb-3 p-2 rounded-lg text-xs flex items-center ${
                uploadStatus.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {uploadStatus.type === "success" ? (
                <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
          )}

          <textarea
            value={jsonCode}
            onChange={(e) => onJsonCodeChange(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Escribe tu código JSON aquí...

Ejemplo para ${currentDiagramConfig.name}:`}
          />

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2 mt-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept={getAcceptedFileTypes()}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              title={`Subir archivo ${getAcceptedFileTypes()}`}
            >
              <Upload className="w-3 h-3 mr-1" />
              Subir archivo
            </button>

            <button
              onClick={handlePasteFromClipboard}
              className="flex items-center px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Pegar desde portapapeles"
            >
              <Clipboard className="w-3 h-3 mr-1" />
              Pegar
            </button>

            <button
              onClick={handleClear}
              className="flex items-center px-3 py-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              title="Limpiar todo el contenido"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Limpiar
            </button>

            <button
              onClick={() => onJsonCodeChange(currentDiagramConfig.placeholder)}
              className="flex items-center px-3 py-2 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
              title="Cargar ejemplo"
            >
              <Code className="w-3 h-3 mr-1" />
              Ejemplo
            </button>
          </div>

          {/* Información de tipos de archivo aceptados */}
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Archivos aceptados:</span>{" "}
            {getAcceptedFileTypes().replace(/\./g, "").toUpperCase()}
            <span className="ml-2">• Máximo: 1MB</span>
          </div>

          {/* Carga desde GitHub */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Cargar desde GitHub</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://raw.githubusercontent.com/..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleLoadFromGithub}
                disabled={isLoadingFromGithub || !githubUrl.trim()}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
                title="Cargar archivo desde GitHub"
              >
                <Github className="w-4 h-4 mr-1" />
                {isLoadingFromGithub ? "..." : "Cargar"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Usa URLs de GitHub raw para mejores resultados</p>
          </div>
        </div>

        {/* Botón Generar - SIEMPRE HABILITADO (excepto por validaciones básicas) */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onGenerate}
            disabled={isButtonDisabled}
            className="w-full px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            {isGenerating ? "Generando diagrama..." : `Generar ${currentDiagramConfig.name}`}
          </button>

          {/* Mensajes de ayuda */}
          {!currentDiagramConfig.enabled && (
            <p className="text-xs text-yellow-600 mt-2 text-center">
              <span className="font-medium">{currentDiagramConfig.name}</span> estará disponible próximamente
            </p>
          )}

          {!isValidJson() && jsonCode.trim() && (
            <p className="text-xs text-red-500 mt-2 text-center">El JSON debe ser válido para generar el diagrama</p>
          )}

          {!jsonCode.trim() && (
            <p className="text-xs text-gray-500 mt-2 text-center">Escribe tu código JSON para generar el diagrama</p>
          )}
        </div>
      </div>
    </div>
  )
}
