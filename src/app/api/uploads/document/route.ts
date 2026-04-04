import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const organizationId = formData.get("organizationId")?.toString();
    const bucket = formData.get("bucket")?.toString() ?? "tenant-documents";
    const documentType = formData.get("documentType")?.toString() ?? "supporting_document";
    const file = formData.get("file");

    if (!organizationId || !(file instanceof File)) {
      return NextResponse.json({ error: "organizationId and file are required" }, { status: 400 });
    }

    const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const path = `${organizationId}/${Date.now()}-${documentType}.${fileExt}`;

    const supabase = createServiceClient();
    const { error } = await supabase.storage.from(bucket).upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ path, bucket }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload document" },
      { status: 500 }
    );
  }
}
