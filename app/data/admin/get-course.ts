import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function AdminGetCourse(id: string) {
  await requireAdmin();
  const data = await prisma.course.findUnique({
    where: { id },
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

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminSingleCourseType = Awaited<ReturnType<typeof AdminGetCourse>>;
