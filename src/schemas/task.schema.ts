import { JSONSchemaType } from "ajv";


interface Task {
  titulo: string;
  descripcion: string;
  fecha_vencimiento: string;
  estado: string;
}

export const taskSchema: JSONSchemaType<Task> = {
  type: "object",
  properties: {
    titulo: { type: "string" },
    descripcion: { type: "string" },
    fecha_vencimiento: { type: "string", format: "date" },
    estado: { 
      type: "string",
      enum: ["pendiente", "en curso", "completada"]
    }
  },
  required: ["titulo", "descripcion", "fecha_vencimiento", "estado"],
  additionalProperties: false
};