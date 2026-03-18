import { auth } from "@/auth";
import { prisma } from "@kimchupa/db";

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  return user?.role === "admin";
}
