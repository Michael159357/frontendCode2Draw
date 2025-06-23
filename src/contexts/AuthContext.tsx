"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { registerUser, loginUser } from "../api/auth"

interface User {
  id: string
  nombre: string
  apellido?: string
  correo: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  setAuthData: (user: User, token: string) => void
}

interface RegisterData {
  correo: string
  password: string
  nombre?: string
  apellido?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedToken = localStorage.getItem("authToken")
        const savedUser = localStorage.getItem("authUser")

        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
          console.log("✅ Token encontrado, usuario autenticado")
        } else {
          console.log("❌ No hay token guardado")
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log("📝 Intentando registro...")

      const response = await registerUser(data)
      console.log("✅ Registro exitoso:", response)

      // Después del registro exitoso, hacer login automáticamente
      const loginSuccess = await login(data.correo, data.password)
      return loginSuccess
    } catch (error) {
      console.error("❌ Error en registro:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log("🔐 Intentando login...")

      const data = await loginUser({ correo: email, password })
      console.log("📦 Respuesta del servidor:", data)

      // Manejar la estructura específica de tu API
      if (data.statusCode === 200 && data.body) {
        // Parsear el body que viene como string JSON
        const bodyData = JSON.parse(data.body)
        console.log("🔓 Datos parseados:", bodyData)

        if (bodyData.token) {
          // Crear un objeto user básico
          const userData = {
            id: bodyData.userId || "user-id",
            nombre: bodyData.nombre || email.split("@")[0],
            apellido: bodyData.apellido || "",
            correo: email,
          }

          setAuthData(userData, bodyData.token)
          console.log("✅ Login exitoso con token:", bodyData.token)
          return true
        } else {
          throw new Error("Token no encontrado en la respuesta")
        }
      } else {
        throw new Error(`Error del servidor: ${data.statusCode || "Respuesta inválida"}`)
      }
    } catch (error) {
      console.error("❌ Error en login:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const setAuthData = (userData: User, userToken: string) => {
    setUser(userData)
    setToken(userToken)

    // Guardar en localStorage
    localStorage.setItem("authToken", userToken)
    localStorage.setItem("authUser", JSON.stringify(userData))

    console.log("💾 Datos de autenticación guardados")
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    // Limpiar localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")

    console.log("👋 Logout exitoso")
  }

  const isAuthenticated = !!(user && token)

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setAuthData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
