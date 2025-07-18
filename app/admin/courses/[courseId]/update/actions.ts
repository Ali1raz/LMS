"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zod-schemas";

export async function UpdateCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const res = CourseSchema.safeParse(data);

    if (!res.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.update({
      where: { id: courseId, userId: session.user.id },
      data: {
        ...res.data,
      },
    });

    return {
      status: "success",
      message: "Successfully updated the course.",
    };
  } catch {
    return {
      status: "error",
      message: "Internal server error",
    };
  }
}
