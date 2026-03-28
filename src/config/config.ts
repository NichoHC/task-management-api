import dotenv from "dotenv";

dotenv.config(); 

class Config {
  private static instance: Config;


  public readonly PORT: number;
  public readonly DB_HOST: string;
  public readonly DB_PORT: number;
  public readonly DB_USER: string;
  public readonly DB_PASSWORD: string;
  public readonly DB_NAME: string;
  public readonly JWT_SECRET: string;

 
  private constructor() {
    if (
      !process.env.DB_HOST ||
      !process.env.DB_PORT ||
      !process.env.DB_USER ||
      !process.env.DB_PASSWORD ||
      !process.env.DB_NAME ||
      !process.env.JWT_SECRET
    ) {
      throw new Error("Missing required environment variables");
    }

    this.PORT = Number(process.env.PORT ?? 3000);
    this.DB_HOST = process.env.DB_HOST;
    this.DB_PORT = Number(process.env.DB_PORT);
    this.DB_USER = process.env.DB_USER;
    this.DB_PASSWORD = process.env.DB_PASSWORD;
    this.DB_NAME = process.env.DB_NAME;
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}


export const config = Config.getInstance();