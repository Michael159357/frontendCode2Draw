"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { DiagramType } from "../types/diagram-types"

interface UploadStatus {
  type: "success" | "error" | null
  message: string
}

export function useFileOperations(
  selectedDiagramType: DiagramType,
  setJsonCode: (code: string) => void,
  setUploadStatus: (status: UploadStatus) => void,
) {
  const [githubUrl, setGithubUrl] = useState("")
  const [isLoadingFromGithub, setIsLoadingFromGithub] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptedFileTypes = () => {
    switch (selectedDiagramType) {
      case "json":
        return ".txt,.json"
      case "er":
        return ".txt,.sql"
      case "aws":
        return ".txt,.json"
      default:
        return ".txt,.json"
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setUploadStatus({ type: "error", message: "No se seleccionó ningún archivo" })
      return
    }

    // Validar tipo de archivo
    const validExtensions = [".txt", ".json", ".sql", ".dot"]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus({
        type: "error",
        message: `Tipo de archivo no válido. Se permiten: ${validExtensions.join(", ")}`,
      })
      return
    }

    // Validar tamaño (máximo 1MB)
    if (file.size > 1024 * 1024) {
      setUploadStatus({
        type: "error",
        message: "El archivo es demasiado grande. Máximo 1MB permitido.",
      })
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string

        if (!content || content.trim().length === 0) {
          setUploadStatus({ type: "error", message: "El archivo está vacío" })
          return
        }

        // Validar contenido según el tipo de diagrama
        if (selectedDiagramType === "json") {
          try {
            JSON.parse(content)
          } catch {
            setUploadStatus({
              type: "error",
              message: "El archivo no contiene JSON válido para diagrama JSON",
            })
            return
          }
        } else if (selectedDiagramType === "er") {
          if (!content.toLowerCase().includes("create table") && !content.includes("schema")) {
            setUploadStatus({
              type: "error",
              message: "El archivo no parece contener esquemas SQL válidos para diagrama ER",
            })
            return
          }
        }

        setJsonCode(content)
        setUploadStatus({
          type: "success",
          message: `Archivo "${file.name}" cargado exitosamente (${(file.size / 1024).toFixed(1)} KB)`,
        })

        // Limpiar el input para permitir subir el mismo archivo de nuevo
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        // Auto-limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setUploadStatus({ type: null, message: "" })
        }, 3000)
      } catch (err) {
        console.error("Error leyendo archivo:", err)
        setUploadStatus({
          type: "error",
          message: "Error al leer el archivo. Inténtalo de nuevo.",
        })
      }
    }

    reader.onerror = () => {
      setUploadStatus({
        type: "error",
        message: "Error al leer el archivo. Verifica que no esté corrupto.",
      })
    }

    reader.readAsText(file, "UTF-8")
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()

      if (!text || text.trim().length === 0) {
        setUploadStatus({ type: "error", message: "El portapapeles está vacío" })
        return
      }

      setJsonCode(text)
      setUploadStatus({
        type: "success",
        message: `Contenido pegado desde portapapeles (${text.length} caracteres)`,
      })

      // Auto-limpiar el mensaje después de 2 segundos
      setTimeout(() => {
        setUploadStatus({ type: null, message: "" })
      }, 2000)
    } catch (err) {
      console.error("Error al pegar desde portapapeles:", err)
      setUploadStatus({
        type: "error",
        message: "No se pudo acceder al portapapeles. Usa Ctrl+V manualmente.",
      })
    }
  }

  const handleLoadFromGithub = async () => {
    if (!githubUrl.trim()) {
      setUploadStatus({ type: "error", message: "Ingresa una URL de GitHub válida" })
      return
    }

    // Validar que sea una URL de GitHub raw
    if (!githubUrl.includes("raw.githubusercontent.com") && !githubUrl.includes("github.com")) {
      setUploadStatus({
        type: "error",
        message: "Usa una URL de GitHub raw (raw.githubusercontent.com)",
      })
      return
    }

    setIsLoadingFromGithub(true)
    setUploadStatus({ type: null, message: "" })

    try {
      const res = await fetch(githubUrl)

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}: ${res.statusText}`)
      }

      const content = await res.text()

      if (!content || content.trim().length === 0) {
        throw new Error("El archivo de GitHub está vacío")
      }

      setJsonCode(content)
      setGithubUrl("")
      setUploadStatus({
        type: "success",
        message: `Archivo cargado desde GitHub exitosamente (${(content.length / 1024).toFixed(1)} KB)`,
      })

      // Auto-limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setUploadStatus({ type: null, message: "" })
      }, 3000)
    } catch (err: any) {
      console.error("Error cargando desde GitHub:", err)
      setUploadStatus({
        type: "error",
        message: `Error cargando desde GitHub: ${err.message}`,
      })
    } finally {
      setIsLoadingFromGithub(false)
    }
  }

  return {
    githubUrl,
    setGithubUrl,
    isLoadingFromGithub,
    fileInputRef,
    getAcceptedFileTypes,
    handleFileUpload,
    handlePasteFromClipboard,
    handleLoadFromGithub,
  }
}
