const bcrypt = require('bcrypt');

export async function hashPassword(contrasena: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(contrasena, saltRounds);
}

export async function comparePassword(contrasena: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(contrasena, hashedPassword);
}