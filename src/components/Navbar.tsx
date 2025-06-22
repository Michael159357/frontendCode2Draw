"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Share, Github, Save } from "lucide-react"

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-gray-900">Diagram Editor</span>
          </Link>
          <span className="text-gray-500 text-sm">Playground - create relationship diagrams with code</span>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
            <Github className="w-5 h-5" />
          </button>

          <button className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 text-sm">
            <Share className="w-4 h-4 inline mr-1" />
            Share
          </button>

          <button className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm">
            <Save className="w-4 h-4 inline mr-1" />
            Save diagram
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">Hola, {user?.name}</span>
              <button
                onClick={logout}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 text-sm"
              >
                Login
              </Link>
              <Link to="/register" className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
