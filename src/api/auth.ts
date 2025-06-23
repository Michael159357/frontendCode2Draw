// Función para registrar usuario
export async function registerUser(data: {
  correo: string
  password: string
  nombre?: string
  apellido?: string
}) {
  const res = await fetch("https://sjsbk3k9w5.execute-api.us-east-1.amazonaws.com/dev/usuarios/crear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  console.log("📦 Respuesta de registro:", json)

  if (!res.ok) {
    const errorMessage = json.error || json.message || "Error al registrar usuario"
    throw new Error(errorMessage)
  }

  return json
}

// Función para hacer login
export async function loginUser(data: {
  correo: string
  password: string
}) {
  const res = await fetch("https://sjsbk3k9w5.execute-api.us-east-1.amazonaws.com/dev/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  console.log("📦 Respuesta de login:", json)

  if (!res.ok) {
    const errorMessage = json.error || json.message || "Error al iniciar sesión"
    throw new Error(errorMessage)
  }

  return json
}
