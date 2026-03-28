import { JSONSchemaType } from "ajv";

interface User {

  nombre: string;
  email: string;
  password: string;
}

export const userSchema: JSONSchemaType<User> = {
  type: "object",
  properties: {
    nombre: { type: "string", minLength: 2, maxLength: 100 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 }
  },
  required: ["nombre", "email", "password"],
  additionalProperties: false
};