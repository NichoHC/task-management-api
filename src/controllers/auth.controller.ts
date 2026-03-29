import { Request, Response } from "express";
import { hashPassword } from "../services/auth.service";
import pool from "../persistence/database"

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

export const login = (_req: any, _res: any) =>   _res.send("User logged in successfully");
