"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import type { DiagramType } from "../types/diagram-types"

export function useDiagram() {
  const [mermaidCode, setMermaidCode] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()
// si no usas isAuthenticated, elimínalo


  const generate = async (jsonCode: string, diagramType: DiagramType) => {
    setIsGenerating(true)
    setError(null)

    try {
      console.log("🚀 Generando diagrama con token...")
      console.log("🔑 Token:", token ? `${token.slice(0, 8)}...` : "NO TOKEN")
      console.log("📊 Tipo de diagrama:", diagramType)

      if (!token) {
        throw new Error("No hay token de autenticación disponible")
      }

      let endpoint = ""
      switch (diagramType) {
        case "json":
          endpoint = "https://7cnk7atez7.execute-api.us-east-1.amazonaws.com/dev/diagramas/crearJson"
          break
        case "er":
          endpoint = "https://7cnk7atez7.execute-api.us-east-1.amazonaws.com/dev/diagramas/crearEr"
          break
        case "aws":
          endpoint = "https://7cnk7atez7.execute-api.us-east-1.amazonaws.com/dev/diagramas/crearAws"
          break
        default:
          endpoint = "https://7cnk7atez7.execute-api.us-east-1.amazonaws.com/dev/diagramas/crearJson"
      }

      console.log("🌐 Endpoint:", endpoint)

      // 🎯 PARSEAR EL JSON CODE ANTES DE ENVIARLO
      let parsedCode
      try {
        // Intentar parsear el jsonCode como JSON
        parsedCode = JSON.parse(jsonCode)
        console.log("✅ JSON parseado correctamente:", parsedCode)
      } catch (parseError) {
        console.error("❌ Error parseando JSON:", parseError)
        throw new Error("El código JSON no es válido. Verifica la sintaxis.")
      }

      // 🎯 ENVIAR EL JSON DIRECTAMENTE COMO EN POSTMAN (SIN ENVOLVER EN "code")
      console.log("📤 Enviando JSON directamente (como Postman):", parsedCode)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(parsedCode), // ← DIRECTO, sin envolver
      })

      console.log("📡 Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("❌ Error response:", errorText)
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("📦 Respuesta completa:", data)

      // 🎯 VALIDAR STATUSCODE CORRECTAMENTE
      if (data.statusCode && data.statusCode !== 200) {
        console.error("❌ Backend devolvió error:", data)

        let errorMessage = "Error del servidor"

        // Extraer mensaje de error del body
        if (data.body) {
          if (typeof data.body === "object" && data.body.error) {
            errorMessage = data.body.error
          } else if (typeof data.body === "string") {
            try {
              const bodyData = JSON.parse(data.body)
              errorMessage = bodyData.error || data.body
            } catch {
              errorMessage = data.body
            }
          }
        }

        throw new Error(`Error del backend (${data.statusCode}): ${errorMessage}`)
      }

      // 🎯 EXTRAER CÓDIGO SOLO SI ES EXITOSO
      let diagramCode = null

      if (data.statusCode === 200 && data.body) {
        console.log("📝 Body recibido:", data.body)
        console.log("📝 Tipo de body:", typeof data.body)

        // Tu backend devuelve body como objeto directamente
        if (typeof data.body === "object") {
          // Buscar el código en diferentes campos
          if (data.body.mermaidcode) {
            diagramCode = data.body.mermaidcode
            console.log("✅ Código extraído de body.mermaidcode")
          } else if (data.body.dotcode) {
            diagramCode = data.body.dotcode
            console.log("✅ Código extraído de body.dotcode")
          } else if (data.body.code) {
            diagramCode = data.body.code
            console.log("✅ Código extraído de body.code")
          } else {
            console.error("❌ Campos disponibles en body:", Object.keys(data.body))
            throw new Error("No se encontró código de diagrama en la respuesta")
          }
        } else if (typeof data.body === "string") {
          try {
            const bodyData = JSON.parse(data.body)
            diagramCode = bodyData.mermaidcode || bodyData.dotcode || bodyData.code
            console.log("✅ Código extraído de body parseado")
          } catch (parseError) {
            console.error("❌ Error parseando body string:", parseError)
            throw new Error("No se pudo parsear la respuesta del servidor")
          }
        }

        console.log("🎨 Código extraído:", diagramCode ? diagramCode.slice(0, 100) + "..." : "VACÍO")
      } else {
        console.error("❌ Respuesta sin statusCode 200 o sin body:", data)
        throw new Error("La respuesta no contiene código de diagrama válido")
      }

      // 🎯 VALIDAR Y LIMPIAR EL CÓDIGO
      if (diagramCode && diagramCode.trim()) {
        // Limpiar escapes si los hay
        const cleanCode = diagramCode.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim()

        setMermaidCode(cleanCode)
        console.log("✅ Diagrama generado exitosamente")
        console.log("📝 Tipo de código:", diagramType === "er" ? "DOT/Graphviz" : "Mermaid")
        console.log("🎨 Código final:", cleanCode.slice(0, 200) + "...")
      } else {
        throw new Error("El código del diagrama está vacío")
      }
    } catch (err) {
      console.error("❌ Error completo:", err)
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const clearDiagram = () => {
    setMermaidCode(null)
    setError(null)
  }

  return {
    mermaidCode,
    isGenerating,
    error,
    generate,
    clearDiagram,
  }
}
