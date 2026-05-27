import type { Config, Context } from "@netlify/functions";
import { deleteCase, json, normalizeCase, readCase, readIndex, requireAdmin, writeCase } from "./_shared/cases";

export default async (req: Request, context: Context) => {
  const authError = requireAdmin(req);
  if (authError) {
    return authError;
  }

  try {
    if (req.method === "GET") {
      const id = context.params.id;
      if (id) {
        const brandCase = await readCase(id);
        if (!brandCase) {
          return json({ error: "案例不存在" }, { status: 404 });
        }

        return json(brandCase);
      }

      const index = await readIndex();
      return json(index);
    }

    if (req.method === "POST") {
      const input = await req.json();
      const previous = input.id ? await readCase(input.id) : null;
      const brandCase = normalizeCase({
        ...previous,
        ...input,
        createdAt: previous?.createdAt ?? input.createdAt,
      });

      await writeCase(brandCase);
      return json(brandCase);
    }

    if (req.method === "DELETE") {
      const id = context.params.id;
      if (!id) {
        return json({ error: "缺少案例 ID" }, { status: 400 });
      }

      await deleteCase(id);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "保存失败" }, { status: 400 });
  }
};

export const config: Config = {
  path: ["/api/admin/cases", "/api/admin/cases/:id"],
};
