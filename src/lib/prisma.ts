import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn("DATABASE_URL not set, Prisma client may not work properly");
    // Prisma 7에서는 adapter가 필수이므로 더미 연결 생성
    const adapter = new PrismaNeon({ connectionString: "postgresql://dummy:dummy@localhost:5432/dummy" });
    return new PrismaClient({ adapter });
  }

  // Prisma 7에서는 항상 adapter 필요
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
