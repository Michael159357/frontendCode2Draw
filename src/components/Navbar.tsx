"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Github, HelpCircle, Settings } from "lucide-react"

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo y branding */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src="/C2DOFICIAL.svg" alt="Code2Draw logo" className="w-20 h-20" />
          </Link>
          <div className="hidden md:block">
            <span className="text-gray-500 text-sm">Playground - create relationship diagrams with code</span>
          </div>
        </div>

        {/* Controles globales y autenticación */}
        <div className="flex items-center space-x-3">
          {/* Botones de utilidad global */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              title="Ver en GitHub"
            >
              <Github className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              title="Ayuda y documentación"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Separador visual */}
          <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

          {/* Autenticación */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Hola, {user?.nombre ? `${user.nombre} ${user.apellido || ""}`.trim() : user?.correo}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
