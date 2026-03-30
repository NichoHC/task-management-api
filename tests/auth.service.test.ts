import { describe, expect, it } from "vitest";
import { comparePassword, hashPassword } from "../src/services/auth.service";

describe("auth.service", () => {
  it("hashPassword genera un hash distinto al texto plano", async () => {
    const plainPassword = "super-secret";

    const hashedPassword = await hashPassword(plainPassword);

    expect(hashedPassword).not.toBe(plainPassword);
    expect(hashedPassword.length).toBeGreaterThan(20);
  });

  it("comparePassword valida correctamente la contrasena", async () => {
    const plainPassword = "super-secret";
    const hashedPassword = await hashPassword(plainPassword);

    await expect(comparePassword(plainPassword, hashedPassword)).resolves.toBe(true);
    await expect(comparePassword("otra-clave", hashedPassword)).resolves.toBe(false);
  });
});
