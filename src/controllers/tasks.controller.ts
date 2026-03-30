import { Request, Response } from "express";
import pool from "../persistence/database";

/**
 * Obtiene todas las tareas del usuario autenticado.
 * 
 * - Filtra las tareas por el ID del usuario (multi-tenant)
 * - Retorna una lista de tareas asociadas al usuario
 * 
 * @param req - Request con el usuario autenticado en req.user
 * @param res - Response de Express
 * @returns Lista de tareas del usuario
 */
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
/**
 * Obtiene una tarea específica por su ID.
 * 
 * - Valida que la tarea pertenezca al usuario autenticado
 * - Retorna 404 si la tarea no existe o no pertenece al usuario
 * 
 * @param req - Request con params.id y usuario autenticado
 * @param res - Response de Express
 * @returns Tarea encontrada o error 404
 */
export const getTaskById = (req: Request, res: Response) => {
    
    const { id } = req.params;
    const userId = (req as any).user.userId;
    pool.query(
        "SELECT * FROM tareas WHERE id = $1 AND usuario_id = $2",
        [id, userId]
    ).then(result => {
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({
            message: "Task retrieved successfully",
            data: result.rows[0]
        });
    }).catch(error => {
        console.error(error);
        res.status(500).json({ error: "Error retrieving task" });
    });
}
/**
 * Crea una nueva tarea para el usuario autenticado.
 * 
 * - Asocia automáticamente la tarea al usuario (usuario_id)
 * - Inserta todos los campos recibidos en el body
 * 
 * @param req - Request con datos de la tarea en el body
 * @param res - Response de Express
 * @returns Tarea creada
 */
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
/**
 * Actualiza una tarea existente.
 * 
 * - Solo permite actualizar tareas del usuario autenticado
 * - Retorna 404 si la tarea no existe o no pertenece al usuario
 * 
 * @param req - Request con params.id y datos actualizados en el body
 * @param res - Response de Express
 * @returns Tarea actualizada o error 404
 */
export const updateTask = (req: Request, res: Response) => {
        const {id}=req.params;
        const { titulo, descripcion, fecha_vencimiento, estado } = req.body;
        const userId = (req as any).user.userId;

        pool.query(
            "UPDATE tareas SET titulo = $1, descripcion = $2, fecha_vencimiento = $3, estado = $4 WHERE id = $5 AND usuario_id = $6 RETURNING *",
            [titulo, descripcion, fecha_vencimiento, estado, id, userId]
        ).then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json({
                message: "Task updated successfully",
                data: result.rows[0]
            });
        }).catch(error => {
            console.error(error);
            res.status(500).json({ error: "Error updating task" });
        });
}
/**
 * Elimina una tarea del usuario autenticado.
 * 
 * - Verifica que la tarea pertenezca al usuario antes de eliminarla
 * - Retorna 404 si la tarea no existe o no pertenece al usuario
 * 
 * @param req - Request con params.id
 * @param res - Response de Express
 * @returns Tarea eliminada o error 404
 */
export const deleteTask = (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    pool.query("DELETE FROM tareas WHERE id = $1 AND usuario_id = $2 RETURNING *", [id, userId])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json({
                message: "Task deleted successfully",
                data: result.rows[0]
            });
        }).catch(error => {
            console.error(error);
            res.status(500).json({ error: "Error deleting task" });
        });
}