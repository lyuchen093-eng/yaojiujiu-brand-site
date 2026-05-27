import type { Config, Context } from "@netlify/functions";
import { casesStore, json } from "./_shared/cases";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const { caseId, fileName } = context.params;
  const result = await casesStore().getWithMetadata(`uploads/${caseId}/${fileName}`, {
    type: "arrayBuffer",
  });

  if (!result?.data) {
    return new Response("Not found", { status: 404 });
  }

  const metadata = result.metadata as { contentType?: unknown };
  const contentType = typeof metadata.contentType === "string" ? metadata.contentType : "application/octet-stream";

  return new Response(result.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const config: Config = {
  path: "/api/assets/:caseId/:fileName",
};
