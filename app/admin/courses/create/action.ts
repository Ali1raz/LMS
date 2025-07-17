"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zod-schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function CreateCourse(
  data: CourseSchemaType
): Promise<ApiResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const validation = CourseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data.",
      };
    }

    // console.log(validation.data.level);

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Course creation failed",
    };
  }
}
