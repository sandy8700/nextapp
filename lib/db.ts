import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/src/generated/client'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  connectionLimit: 15
})

export const db = new PrismaClient({ adapter })