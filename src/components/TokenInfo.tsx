"use client"

import { useAuth } from "../contexts/AuthContext"
import { Shield, Clock, User } from "lucide-react"

export default function TokenInfo() {
  const { token, user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !token) {
    return null
  }

  // Función para mostrar solo los primeros y últimos caracteres del token
  const maskToken = (token: string) => {
    if (token.length <= 8) return token
    return `${token.slice(0, 4)}...${token.slice(-4)}`
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
      <div className="flex items-center text-green-700 mb-2">
        <Shield className="w-4 h-4 mr-2" />
        <span className="font-medium">Sesión Activa</span>
      </div>

      <div className="space-y-1 text-green-600">
        <div className="flex items-center">
          <User className="w-3 h-3 mr-2" />
          <span>{user?.correo}</span>
        </div>

        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-2" />
          <span>Token: {maskToken(token)}</span>
        </div>
      </div>
    </div>
  )
}
