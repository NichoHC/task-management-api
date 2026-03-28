const bcrypt = require('bcrypt');

export async function hashPassword(contrasena: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(contrasena, saltRounds);
}