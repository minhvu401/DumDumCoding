import postgres, { Sql } from 'postgres'

const connectionString: string = process.env.DATABASE_URL as string
const sql: Sql = postgres(connectionString)

export default sql
