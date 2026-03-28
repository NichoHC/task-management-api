import { JSONSchemaType } from "ajv";


interface Task {
  titulo: string;
  description: string;
  fecha_vencimiento: string;
  estado: string;
}

export const taskSchema: JSONSchemaType<Task> = {
  type: "object",
  properties: {
    titulo: { type: "string" },
    description: { type: "string" },
    fecha_vencimiento: { type: "string", format: "date" },
    estado: { 
      type: "string",
      enum: ["pendiente", "en curso", "completada"]
    }
  },
  required: ["titulo", "description", "fecha_vencimiento", "estado"],
  additionalProperties: false
};