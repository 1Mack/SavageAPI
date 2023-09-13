import { createPool } from 'mysql2';
import AppError from '../errors/AppError';

export class Database {
  private pool2: any
  constructor() {
    this.pool2 = createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      port: Number(process.env.DATABASE_PORT),
    }).promise()
  }
  async query(query: string, dynamicField?: Array<string | number>) {
    try {
      const [row] = await this.pool2.query(query, dynamicField && dynamicField)
      return row
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}