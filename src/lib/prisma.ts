import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../../generated/prisma/client";
import path from "path"

const adapter = new PrismaBetterSqlite3({
  url: "file:" + path.resolve(__dirname, "../../prisma/dev.db")
})

const prisma = new PrismaClient({ adapter })

export default prisma