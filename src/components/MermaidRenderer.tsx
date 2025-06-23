"use client"

import { useEffect, useRef, useState } from "react"
import type { ViewFormat } from "./DiagramFormatSelector"

interface MermaidRendererProps {
  code: string
  viewFormat?: ViewFormat
  className?: string
}

export default function MermaidRenderer({ code, viewFormat = "png", className = "" }: MermaidRendererProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!elementRef.current || !code) return

      try {
        console.log("Renderizando código Mermaid:", code)

        // Importar Mermaid dinámicamente
        const mermaid = (await import("mermaid")).default

        // Configurar Mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "Arial, sans-serif",
          class: {
            useMaxWidth: true,
          },
          flowchart: {
            useMaxWidth: true,
          },
        })

        // Limpiar el contenedor
        elementRef.current.innerHTML = ""

        // Generar ID único
        const id = `mermaid-${Date.now()}`

        // Validar que el código no sea un JSON de error
        if (code.includes("statusCode") && code.includes("error")) {
          throw new Error("El backend devolvió un error en lugar de código Mermaid")
        }

        // Renderizar el diagrama
        const { svg } = await mermaid.render(id, code)

        if (viewFormat === "svg") {
          // Mostrar SVG directamente
          elementRef.current.innerHTML = svg

          const svgElement = elementRef.current.querySelector("svg")
          if (svgElement) {
            svgElement.style.maxWidth = "100%"
            svgElement.style.height = "auto"
          }
        } else {
          // Convertir a PNG
          setIsConverting(true)

          // Crear un div temporal para el SVG
          const tempDiv = document.createElement("div")
          tempDiv.innerHTML = svg
          const svgElement = tempDiv.querySelector("svg")

          if (svgElement) {
            // Crear canvas para PNG
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")

            if (ctx) {
              const svgData = new XMLSerializer().serializeToString(svgElement)
              const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
              const url = URL.createObjectURL(svgBlob)

              const img = new Image()
              img.crossOrigin = "anonymous"

              img.onload = () => {
                canvas.width = img.width || 800
                canvas.height = img.height || 600

                // Fondo blanco para PNG
                ctx.fillStyle = "white"
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // Dibujar la imagen SVG
                ctx.drawImage(img, 0, 0)

                // Estilos para el canvas
                canvas.style.maxWidth = "100%"
                canvas.style.height = "auto"
                canvas.style.display = "block"
                canvas.style.margin = "0 auto"

                // Agregar el canvas al contenedor
                elementRef.current!.appendChild(canvas)

                URL.revokeObjectURL(url)
                setIsConverting(false)
              }

              img.onerror = () => {
                console.error("Error al convertir Mermaid SVG a PNG")
                // Fallback: mostrar SVG
                elementRef.current!.innerHTML = svg
                setIsConverting(false)
                URL.revokeObjectURL(url)
              }

              img.src = url
            }
          }
        }
      } catch (error) {
        console.error("Error rendering Mermaid diagram:", error)
        console.error("Código que causó el error:", code)

        if (elementRef.current) {
          elementRef.current.innerHTML = `
            <div class="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
              <p class="font-medium">Error al renderizar el diagrama</p>
              <p class="text-sm mt-1">${error instanceof Error ? error.message : "Error desconocido"}</p>
              <details class="mt-2">
                <summary class="text-xs cursor-pointer">Ver código recibido</summary>
                <pre class="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-32">${code}</pre>
              </details>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [code, viewFormat])

  return (
    <div className={`mermaid-container ${className}`}>
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
