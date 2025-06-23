export type DiagramType = "json" | "er" | "aws"

export interface DiagramTypeConfig {
  id: DiagramType
  name: string
  description: string
  endpoint: string
  enabled: boolean
  icon: string
  placeholder: string
}

export const DIAGRAM_TYPES: DiagramTypeConfig[] = [
  {
    id: "json",
    name: "JSON to Mermaid",
    description: "Convierte estructuras JSON en diagramas de clases",
    endpoint: "/diagramas/crear/json",
    enabled: true,
    icon: "📊",
    placeholder: `{
  "Usuario": {
    "nombre": "string",
    "email": "string"
  },
  "Curso": {
    "titulo": "string",
    "duracion": "int"
  }
}`,
  },
  {
    id: "er",
    name: "Entity Relationship",
    description: "Genera diagramas ER desde esquemas SQL",
    endpoint: "/diagramas/crear/er",
    enabled: true, // ✅ Ahora habilitado
    icon: "🔗",
    placeholder: `{
  "schema": "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT); CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT, duration INTEGER); CREATE TABLE enrollments (id INTEGER PRIMARY KEY, user_id INTEGER, course_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(course_id) REFERENCES courses(id));"
}`,
  },
  {
    id: "aws",
    name: "AWS Architecture",
    description: "Crea diagramas de arquitectura AWS",
    endpoint: "/diagramas/crear/aws",
    enabled: false, // Por ahora deshabilitado
    icon: "☁️",
    placeholder: `{
  "services": [
    {
      "name": "API Gateway",
      "type": "api-gateway"
    },
    {
      "name": "Lambda Function",
      "type": "lambda"
    },
    {
      "name": "DynamoDB",
      "type": "dynamodb"
    }
  ],
  "connections": [
    {
      "from": "API Gateway",
      "to": "Lambda Function"
    },
    {
      "from": "Lambda Function", 
      "to": "DynamoDB"
    }
  ]
}`,
  },
]
