import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3Client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content-Type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

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

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "You are not allowed" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = fileUploadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid body request" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validated.data;
    const uniqueKey = `${uuidv4()}-${fileName}`;
    const putCommand = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const presignedURL = await getSignedUrl(s3, putCommand, {
      expiresIn: 360,
    });

    return NextResponse.json({ preSignedUrl: presignedURL, key: uniqueKey });
  } catch {
    return NextResponse.json(
      { error: "Error getting preSigned url" },
      { status: 500 }
    );
  }
}
