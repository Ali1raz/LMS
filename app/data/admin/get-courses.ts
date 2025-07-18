import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export async function AdminGetCourses() {
  await requireAdmin();
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      fileKey: true,
      duration: true,
      description: true,
      level: true,
      price: true,
      smallDescription: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof AdminGetCourses>>[0];
