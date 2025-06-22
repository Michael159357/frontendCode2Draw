"use client"

import { useState } from "react"
import { Code, Settings, FileText, Maximize2, Search, ZoomIn, Maximize } from "lucide-react"

export default function Home() {
  const [code, setCode] = useState(`flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]`)

  const [selectedDiagram, setSelectedDiagram] = useState("Flow")

  const diagramTypes = [
    "Flow",
    "Sequence",
    "Class",
    "State",
    "ER",
    "Gantt",
    "User Journey",
    "Git",
    "Pie",
    "Mindmap",
    "ZenUML",
    "QuadrantChart",
    "XYChart",
    "Block",
    "Packet",
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar izquierdo */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 border-b-2 border-blue-500">
            <Code className="w-4 h-4 mr-2" />
            Code
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
          <div className="p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Escribe tu código de diagrama aquí..."
            />
          </div>

          {/* Sample Diagrams */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Sample Diagrams</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {diagramTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedDiagram(type)}
                  className={`px-3 py-2 text-xs rounded-lg border ${
                    selectedDiagram === type
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal del diagrama */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar superior */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Preview</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Maximize className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Área de visualización del diagrama */}
        <div className="flex-1 bg-white p-8 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-96 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <div className="text-gray-500">
                  <Code className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Tu diagrama aparecerá aquí</p>
                  <p className="text-xs text-gray-400 mt-1">Escribe código Mermaid en el panel izquierdo</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Ejemplo de código Mermaid cargado. Modifica el código para ver los cambios.
              </p>
            </div>
          </div>
        </div>

        {/* Footer con versión */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">v11.6.0</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
