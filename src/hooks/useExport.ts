"use client"
import { useState } from "react"
import type { ExportFormat } from "../components/DiagramExportSelector"
import type { DiagramType } from "../types/diagram-types"

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportDiagram = async (code: string, diagramType: DiagramType, format: ExportFormat, filename?: string) => {
    setIsExporting(true)

    try {
      console.log(`🚀 Iniciando exportación: ${diagramType} → ${format}`)

      if (format === "svg") {
        await exportAsSVG(code, diagramType, filename)
      } else if (format === "png") {
        await exportAsPNG(code, diagramType, filename)
      } else if (format === "pdf") {
        await exportAsPDF(code, diagramType, filename)
      }

      console.log(`✅ Exportación completada: ${format}`)
    } catch (error) {
      console.error("❌ Error al exportar:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      alert(`Error al exportar el diagrama ${diagramType} como ${format}:\n\n${errorMessage}`)
    } finally {
      setIsExporting(false)
    }
  }

  const generateSVGFromCode = async (code: string, diagramType: DiagramType): Promise<string> => {
    console.log(`📊 Generando SVG para tipo: ${diagramType}`)

    switch (diagramType) {
      case "er":
        return await generateERSVG(code)
      case "json":
      case "aws":
      default:
        return await generateMermaidSVG(code)
    }
  }

  const generateERSVG = async (code: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("🔗 Generando SVG con d3-graphviz...")
        const { graphviz } = await import("d3-graphviz")
        const tempDiv = document.createElement("div")
        tempDiv.style.position = "absolute"
        tempDiv.style.left = "-9999px"
        tempDiv.style.visibility = "hidden"
        document.body.appendChild(tempDiv)

        let dotCode = code
        if (typeof dotCode === "string") {
          dotCode = dotCode.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim()
        }

        graphviz(tempDiv)
          .renderDot(dotCode)
          .on("end", () => {
            const svgElement = tempDiv.querySelector("svg")
            if (svgElement) {
              const svgContent = new XMLSerializer().serializeToString(svgElement)
              document.body.removeChild(tempDiv)
              console.log("✅ SVG ER generado correctamente")
              resolve(svgContent)
            } else {
              document.body.removeChild(tempDiv)
              reject(new Error("No se pudo generar el SVG del diagrama ER"))
            }
          })
          .on("error", (error: unknown) => {
            document.body.removeChild(tempDiv)
            const errorMessage = error instanceof Error ? error.message : "Error desconocido en d3-graphviz"
            reject(new Error(errorMessage))
          })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        reject(new Error(`Error en generateERSVG: ${errorMessage}`))
      }
    })
  }

  const generateMermaidSVG = async (code: string): Promise<string> => {
    try {
      console.log("📈 Generando SVG con Mermaid...")
      const mermaid = (await import("mermaid")).default

      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "Arial, sans-serif",
      })

      const id = `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const { svg } = await mermaid.render(id, code)
      console.log("✅ SVG Mermaid generado correctamente")
      return svg
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      throw new Error(`Error generando SVG Mermaid: ${errorMessage}`)
    }
  }

  const exportAsSVG = async (code: string, diagramType: DiagramType, filename?: string) => {
    try {
      console.log("📄 Exportando como SVG...")
      const svgContent = await generateSVGFromCode(code, diagramType)
      const finalFilename = `${filename || `${diagramType}-diagram`}.svg`
      downloadFile(svgContent, finalFilename, "image/svg+xml")
      console.log("✅ SVG descargado correctamente")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      throw new Error(`Error exportando SVG: ${errorMessage}`)
    }
  }

  const exportAsPNG = async (code: string, diagramType: DiagramType, filename?: string) => {
    try {
      console.log("🖼️ Iniciando exportación PNG con método alternativo...")

      // Método alternativo: usar html2canvas para evitar problemas de CORS
      const svgContent = await generateSVGFromCode(code, diagramType)
      console.log("✅ SVG generado para PNG")

      // Crear un contenedor temporal visible pero fuera de la vista
      const tempContainer = document.createElement("div")
      tempContainer.style.position = "fixed"
      tempContainer.style.top = "-9999px"
      tempContainer.style.left = "-9999px"
      tempContainer.style.width = "auto"
      tempContainer.style.height = "auto"
      tempContainer.style.backgroundColor = "white"
      tempContainer.style.padding = "20px"
      tempContainer.innerHTML = svgContent
      document.body.appendChild(tempContainer)

      try {
        // Intentar usar html2canvas si está disponible
        let html2canvas: any
        try {
          html2canvas = (await import("html2canvas")).default
          console.log("✅ html2canvas disponible")
        } catch {
          console.log("⚠️ html2canvas no disponible, usando método DOM")
          // Método alternativo sin html2canvas
          await exportPNGWithoutHtml2Canvas(svgContent, diagramType, filename)
          return
        }

        const canvas = await html2canvas(tempContainer, {
          backgroundColor: "white",
          scale: 2,
          useCORS: true,
          allowTaint: false,
          foreignObjectRendering: false,
        })

        console.log(`🎨 Canvas generado: ${canvas.width}x${canvas.height}`)

        // Convertir a blob y descargar - AQUÍ ESTÁ EL FIX DEL ERROR
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const finalFilename = `${filename || `${diagramType}-diagram`}.png`
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = finalFilename
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              console.log("✅ PNG descargado correctamente")
            }
          },
          "image/png",
          1.0,
        )
      } finally {
        document.body.removeChild(tempContainer)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      throw new Error(`Error exportando PNG: ${errorMessage}`)
    }
  }

  const exportPNGWithoutHtml2Canvas = async (svgContent: string, diagramType: DiagramType, filename?: string) => {
    console.log("🔄 Usando método DOM para PNG...")

    // Crear SVG limpio sin referencias externas
    const cleanSVG = cleanSVGForExport(svgContent)

    // Crear data URL del SVG
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleanSVG)))}`

    // Crear imagen y canvas
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No se pudo crear contexto de canvas")
    }

    return new Promise<void>((resolve, reject) => {
      img.onload = () => {
        try {
          canvas.width = img.width || 800
          canvas.height = img.height || 600

          // Fondo blanco
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Dibujar imagen
          ctx.drawImage(img, 0, 0)

          // Usar getImageData en lugar de toBlob para evitar tainted canvas
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const newCanvas = document.createElement("canvas")
          const newCtx = newCanvas.getContext("2d")

          if (newCtx) {
            newCanvas.width = canvas.width
            newCanvas.height = canvas.height
            newCtx.putImageData(imageData, 0, 0)

            // FIX: Tipado correcto para el callback de toBlob
            newCanvas.toBlob(
              (blob: Blob | null) => {
                if (blob) {
                  const finalFilename = `${filename || `${diagramType}-diagram`}.png`
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = finalFilename
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                  console.log("✅ PNG descargado con método DOM")
                }
                resolve()
              },
              "image/png",
              1.0,
            )
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error desconocido"
          reject(new Error(`Error en método DOM: ${errorMessage}`))
        }
      }

      img.onerror = () => {
        reject(new Error("Error cargando SVG como imagen"))
      }

      img.src = svgDataUrl
    })
  }

  const cleanSVGForExport = (svgContent: string): string => {
    // Limpiar SVG para evitar problemas de CORS
    let cleanSVG = svgContent

    // Remover referencias externas que pueden causar problemas
    cleanSVG = cleanSVG.replace(/xlink:href="[^"]*"/g, "")
    cleanSVG = cleanSVG.replace(/href="[^"]*"/g, "")

    // Asegurar que tenga namespace correcto
    if (!cleanSVG.includes('xmlns="http://www.w3.org/2000/svg"')) {
      cleanSVG = cleanSVG.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
    }

    return cleanSVG
  }

  const exportAsPDF = async (code: string, diagramType: DiagramType, filename?: string) => {
    try {
      console.log("📄 Iniciando exportación PDF...")

      // Verificar jsPDF
      let jsPDF: any
      try {
        const jsPDFModule = await import("jspdf")
        jsPDF = (jsPDFModule as any).jsPDF || (jsPDFModule as any).default || jsPDFModule

        if (!jsPDF || typeof jsPDF !== "function") {
          throw new Error("jsPDF no está disponible")
        }
        console.log("✅ jsPDF importado correctamente")
      } catch (importError) {
        console.error("❌ Error importando jsPDF:", importError)
        throw new Error("Para exportar PDF, instala jsPDF: npm install jspdf")
      }

      // Generar SVG
      const svgContent = await generateSVGFromCode(code, diagramType)
      console.log("✅ SVG generado para PDF")

      // Usar el mismo método que PNG pero para PDF
      const cleanSVG = cleanSVGForExport(svgContent)
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleanSVG)))}`

      const img = new Image()
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("No se pudo crear contexto de canvas para PDF")
      }

      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            const width = img.width || 800
            const height = img.height || 600

            canvas.width = width
            canvas.height = height

            // Fondo blanco
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, width, height)

            // Dibujar imagen
            ctx.drawImage(img, 0, 0)

            // Obtener datos de imagen usando getImageData
            const imageData = ctx.getImageData(0, 0, width, height)
            const newCanvas = document.createElement("canvas")
            const newCtx = newCanvas.getContext("2d")

            if (newCtx) {
              newCanvas.width = width
              newCanvas.height = height
              newCtx.putImageData(imageData, 0, 0)

              // Crear PDF
              const imgDataUrl = newCanvas.toDataURL("image/png", 1.0)

              const isLandscape = width > height
              const pdfWidth = isLandscape ? 297 : 210
              const pdfHeight = isLandscape ? 210 : 297
              const margin = 10

              const availableWidth = pdfWidth - margin * 2
              const availableHeight = pdfHeight - margin * 2

              const scaleX = availableWidth / (width * 0.75)
              const scaleY = availableHeight / (height * 0.75)
              const scale = Math.min(scaleX, scaleY, 1)

              const finalWidth = width * 0.75 * scale
              const finalHeight = height * 0.75 * scale

              const pdf = new jsPDF({
                orientation: isLandscape ? "landscape" : "portrait",
                unit: "mm",
                format: "a4",
              })

              pdf.setFontSize(12)
              pdf.text(`Diagrama ${diagramType.toUpperCase()}`, margin, margin)

              const x = (pdfWidth - finalWidth) / 2
              const y = margin + 10

              pdf.addImage(imgDataUrl, "PNG", x, y, finalWidth, finalHeight)

              const finalFilename = `${filename || `${diagramType}-diagram`}.pdf`
              pdf.save(finalFilename)

              console.log("✅ PDF descargado correctamente")
            }
            resolve()
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido"
            reject(new Error(`Error creando PDF: ${errorMessage}`))
          }
        }

        img.onerror = () => {
          reject(new Error("Error cargando SVG para PDF"))
        }

        img.src = svgDataUrl
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      throw new Error(`Error exportando PDF: ${errorMessage}`)
    }
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    isExporting,
    exportDiagram,
  }
}
