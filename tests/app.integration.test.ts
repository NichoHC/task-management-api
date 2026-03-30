import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashPassword } from "../src/services/auth.service";

const { queryMock } = vi.hoisted(() => ({
  queryMock: vi.fn(),
}));

vi.mock("../src/persistence/database", () => ({
  default: {
    query: queryMock,
  },
}));

import app from "../src/app";
import { generateToken } from "../src/utils/jwt";

describe("API integration", () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  it("registra un usuario cuando el payload es valido", async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ id: 1, nombre: "Ana", email: "ana@example.com" }],
    });

    const response = await request(app).post("/auth/register").send({
      nombre: "Ana",
      email: "ana@example.com",
      contrasena: "secret123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User registered successfully",
      data: { id: 1, nombre: "Ana", email: "ana@example.com" },
    });
    expect(queryMock).toHaveBeenCalledOnce();
    expect(queryMock.mock.calls[0][1]).toEqual([
      "Ana",
      "ana@example.com",
      expect.any(String),
    ]);
    expect(queryMock.mock.calls[0][1][2]).not.toBe("secret123");
  });

  it("rechaza el registro si el body no cumple el esquema", async () => {
    const response = await request(app).post("/auth/register").send({
      nombre: "A",
      email: "correo-invalido",
      contrasena: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(queryMock).not.toHaveBeenCalled();
  });

  it("retorna un token al hacer login con credenciales validas", async () => {
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          id: 7,
          email: "ana@example.com",
          contrasena: await hashPassword("secret123"),
        },
      ],
    });

    const response = await request(app).post("/auth/login").send({
      email: "ana@example.com",
      contrasena: "secret123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toEqual(expect.any(String));
  });

  it("protege las rutas de tareas cuando no hay token", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Token requerido" });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it("crea una tarea cuando el token es valido y el body cumple el esquema", async () => {
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          id: 11,
          titulo: "Preparar release",
          descripcion: "Cerrar pendientes",
          fecha_vencimiento: "2026-04-02",
          estado: "pendiente",
          usuario_id: 7,
        },
      ],
    });

    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${generateToken(7)}`)
      .send({
        titulo: "Preparar release",
        descripcion: "Cerrar pendientes",
        fecha_vencimiento: "2026-04-02",
        estado: "pendiente",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      titulo: "Preparar release",
      usuario_id: 7,
    });
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO tareas"),
      [
        "Preparar release",
        "Cerrar pendientes",
        "2026-04-02",
        "pendiente",
        7,
      ],
    );
  });

  it("retorna 404 si la tarea no pertenece al usuario autenticado", async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .get("/tasks/999")
      .set("Authorization", `Bearer ${generateToken(7)}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM tareas WHERE id = $1 AND usuario_id = $2"),
      ["999", 7],
    );
  });

  it("rechaza la creacion de tareas con fechas invalidas", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${generateToken(7)}`)
      .send({
        titulo: "Preparar release",
        descripcion: "Cerrar pendientes",
        fecha_vencimiento: "02-04-2026",
        estado: "pendiente",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(queryMock).not.toHaveBeenCalled();
  });
});
