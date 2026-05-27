import type { Config } from "@netlify/functions";
import { casesStore, json, requireAdmin } from "./_shared/cases";

const MAX_SIZE = 20 * 1024 * 1024;

type UploadFile = {
  name?: string;
  size: number;
  type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
};

export default async (req: Request) => {
  const authError = requireAdmin(req);
  if (authError) {
    return authError;
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const caseId = String(formData.get("caseId") || "draft");

    if (!isUploadFile(file)) {
      return json({ error: "请选择图片文件" }, { status: 400 });
    }

    const uploadFile = file as UploadFile;

    if (!uploadFile.type.startsWith("image/")) {
      return json({ error: "仅支持图片上传" }, { status: 400 });
    }

    if (uploadFile.size > MAX_SIZE) {
      return json({ error: "图片不能超过 20MB" }, { status: 400 });
    }

    const safeCaseId = sanitize(caseId);
    const safeName = `${Date.now()}-${sanitize(uploadFile.name || "upload.jpg")}`;
    const key = `uploads/${safeCaseId}/${safeName}`;
    await casesStore().set(key, await uploadFile.arrayBuffer(), {
      metadata: { contentType: uploadFile.type },
    });

    return json({
      url: `/api/assets/${safeCaseId}/${safeName}`,
      key,
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "图片上传失败" }, { status: 400 });
  }
};

export const config: Config = {
  path: "/api/admin/uploads",
};

function sanitize(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 96) || "asset";
}

function isUploadFile(value: FormDataEntryValue | null) {
  return Boolean(
    value &&
      typeof value === "object" &&
      "arrayBuffer" in value &&
      "size" in value &&
      "type" in value &&
      typeof (value as UploadFile).arrayBuffer === "function" &&
      typeof (value as UploadFile).size === "number" &&
      typeof (value as UploadFile).type === "string",
  );
}
