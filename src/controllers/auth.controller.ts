import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/auth.service";
import pool from "../persistence/database"
import { generateToken } from "../utils/jwt";

/**
 * Registra un nuevo usuario en el sistema.
 * 
 * - Hashea la contraseña antes de guardarla
 * - Evita duplicados por email (constraint único en DB)
 * 
 * @param req - Request de Express con { nombre, email, contrasena } en el body
 * @param res - Response de Express
 * @returns Usuario creado (sin contraseña) o mensaje de error
 */

export const register = async (req: Request, res: Response) => {
  const { nombre, email, contrasena } = req.body;

  try {
    
    const hashedPassword = await hashPassword(contrasena);
   
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email, contrasena) VALUES ($1, $2, $3) RETURNING id, nombre, email",
      [nombre, email, hashedPassword]
    );

    const newUser = result.rows[0];

    return res.status(201).json({
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "23505") {
    
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Autentica un usuario existente.
 * 
 * - Verifica si el email existe
 * - Compara la contraseña hasheada
 * - Genera un JWT si las credenciales son válidas
 * 
 * @param req - Request con { email, contrasena } en el body
 * @param res - Response de Express
 * @returns Token JWT si el login es exitoso
 */

export const login =  async (req: Request, res: Response) =>   {
    const { email, contrasena } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        const user = result.rows[0];
        
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await comparePassword(contrasena, user.contrasena);

        if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
        }
        

        const token = generateToken(user.id);
        
        return res.status(200).json({ 
          message: "Login successful",
          token 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Cierra la sesión del usuario eliminando la cookie del token.
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @returns Mensaje de confirmación
 */
export const logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
}