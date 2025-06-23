"use client"

import { useEffect, useRef, useState } from "react"
import type { ViewFormat } from "./DiagramFormatSelector"

interface ERRendererProps {
  code: string
  viewFormat?: ViewFormat
  className?: string
}

export default function ERRenderer({ code, viewFormat = "png", className = "" }: ERRendererProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  // const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!elementRef.current || !code) return

      try {
        console.log("Renderizando código DOT con d3-graphviz:", code)

        // Importar d3-graphviz dinámicamente
        const { graphviz } = await import("d3-graphviz")

        // Limpiar el contenedor
        elementRef.current.innerHTML = ""

        // Limpiar el código DOT (remover escapes si los hay)
        let dotCode = code
        if (typeof dotCode === "string") {
          dotCode = dotCode.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim()
        }

        console.log("Código DOT limpio:", dotCode)

        // Verificar que el código DOT sea válido
        if (!dotCode || (!dotCode.includes("graph") && !dotCode.includes("digraph"))) {
          throw new Error("El código recibido no parece ser un diagrama DOT válido")
        }

        // Crear un div temporal para el renderizado SVG
        const svgDiv = document.createElement("div")
        svgDiv.style.display = viewFormat === "svg" ? "block" : "none"
        elementRef.current.appendChild(svgDiv)

        // Crear canvas para PNG
        const canvas = document.createElement("canvas")
        canvas.style.display = viewFormat === "png" ? "block" : "none"
        canvas.style.maxWidth = "100%"
        canvas.style.height = "auto"
        canvas.style.backgroundColor = "white"
        canvas.style.border = "1px solid #e0e0e0"
        canvas.style.borderRadius = "8px"
        canvas.style.padding = "20px"
        canvas.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"
        elementRef.current.appendChild(canvas)

        // Renderizar el diagrama con d3-graphviz
        graphviz(svgDiv)
          .renderDot(dotCode)
          .on("end", () => {
            console.log("Diagrama ER renderizado exitosamente")

            const svgElement = svgDiv.querySelector("svg")
            if (svgElement) {
              // Estilos para SVG
              svgElement.style.maxWidth = "100%"
              svgElement.style.height = "auto"
              svgElement.style.display = "block"
              svgElement.style.margin = "0 auto"
              svgElement.style.backgroundColor = "white"
              svgElement.style.border = "1px solid #e0e0e0"
              svgElement.style.borderRadius = "8px"
              svgElement.style.padding = "20px"
              svgElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"

              // Convertir a PNG si es necesario
              if (viewFormat === "png") {
                convertSVGtoPNG(svgElement, canvas)
              }
            }
          })
      } catch (error) {
        console.error("Error rendering ER diagram:", error)
        console.error("Código que causó el error:", code)

        if (elementRef.current) {
          elementRef.current.innerHTML = `
            <div class="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
              <p class="font-medium">Error al renderizar el diagrama ER</p>
              <p class="text-sm mt-1">${error instanceof Error ? error.message : "Error desconocido"}</p>
              <div class="mt-3">
                <p class="text-xs font-medium mb-2">Posibles soluciones:</p>
                <ul class="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li>Instala d3-graphviz: <code class="bg-gray-200 px-1 rounded">npm install d3-graphviz</code></li>
                  <li>Verifica que el código DOT sea válido</li>
                  <li>Revisa la consola para más detalles del error</li>
                </ul>
              </div>
              <details class="mt-3">
                <summary class="text-xs cursor-pointer hover:text-red-700 font-medium">Ver código DOT recibido</summary>
                <pre class="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-32 whitespace-pre-wrap font-mono">${code}</pre>
              </details>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [code, viewFormat])

  const convertSVGtoPNG = (svgElement: SVGElement, canvas: HTMLCanvasElement) => {
    setIsConverting(true)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Configurar el canvas con el tamaño de la imagen
      canvas.width = img.width || 800
      canvas.height = img.height || 600

      // Fondo blanco para PNG
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar la imagen SVG
      ctx.drawImage(img, 0, 0)

      URL.revokeObjectURL(url)
      setIsConverting(false)
    }

    img.onerror = () => {
      console.error("Error al convertir SVG a PNG")
      setIsConverting(false)
      URL.revokeObjectURL(url)
    }

    img.src = url
  }

  return (
    <div className={`er-container ${className}`}>
      {isConverting && viewFormat === "png" && (
        <div className="mb-2 text-xs text-blue-600 flex items-center gap-1">
          <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Convirtiendo a PNG...
        </div>
      )}
      <div ref={elementRef} className="w-full" />
    </div>
  )
}
