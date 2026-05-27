import type { Config, Context } from "@netlify/functions";
import { json, readCase, readIndex } from "./_shared/cases";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const id = context.params.id;

  if (id) {
    const brandCase = await readCase(id);
    if (!brandCase || brandCase.status !== "published") {
      return json({ error: "案例不存在" }, { status: 404 });
    }

    return json(brandCase);
  }

  const index = await readIndex();
  return json({
    cases: index.cases.filter((item) => item.status === "published"),
  });
};

export const config: Config = {
  path: ["/api/cases", "/api/cases/:id"],
};
