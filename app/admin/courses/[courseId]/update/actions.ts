"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zod-schemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function UpdateCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting.",
        };
      }

      return {
        status: "error",
        message: "You are a bot, if false contact our support.",
      };
    }

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
