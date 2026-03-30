import { Request, Response } from "express";
import pool from "../persistence/database";

export const getTasks = (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    pool.query(
        "SELECT * FROM tareas WHERE usuario_id = $1",
        [userId]
    ).then(result => {
        res.status(200).json({
            message: "Tasks retrieved successfully",
            data: result.rows
        });
    }).catch(error => {
        console.error(error);
        res.status(500).json({ error: "Error retrieving tasks" });
    });
}
export const getTaskById = (req: Request, res: Response) => {}
export const createTask = async (req: Request, res: Response) => {
     const { titulo, descripcion, fecha_vencimiento, estado } = req.body;
     const userId = (req as any).user.userId;

    try{
        const result = await pool.query(
            "INSERT INTO tareas (titulo, descripcion, fecha_vencimiento, estado, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [titulo, descripcion, fecha_vencimiento, estado, userId]
        )

        const newTask = result.rows[0];

        return res.status(201).json({
            message: "Task created successfully",
            data: newTask
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating task" });

    }
}
export const updateTask = (req: Request, res: Response) => {}
export const deleteTask = (req: Request, res: Response) => {}