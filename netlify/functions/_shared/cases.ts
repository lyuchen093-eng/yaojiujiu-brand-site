import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";

declare const Netlify: {
  env: {
    get(name: string): string | undefined;
  };
};

export type CaseStatus = "published" | "draft";

export interface BrandCase {
  id: string;
  title: string;
  client: string;
  category: string;
  industry: string;
  serviceType: string;
  summary: string;
  coverImage: string;
  gallery: string[];
  challenge: string;
  solution: string;
  results: string[];
  highlights: string[];
  videoUrl?: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export type CaseSummary = Pick<
  BrandCase,
  | "id"
  | "title"
  | "client"
  | "category"
  | "industry"
  | "serviceType"
  | "summary"
  | "coverImage"
  | "status"
  | "updatedAt"
>;

export interface CaseIndex {
  cases: CaseSummary[];
}

const INDEX_KEY = "cases/index.json";
const CASE_PREFIX = "cases/";

export function casesStore() {
  return getStore({ name: "yaojiujiu-brand", consistency: "strong" });
}

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init.headers ?? {}),
    },
  });
}

export function requireAdmin(req: Request) {
  const expected = Netlify.env.get("ADMIN_PASSWORD") || "change-me-199";
  const password = req.headers.get("x-admin-password");

  if (!password || password !== expected) {
    return json({ error: "后台密码不正确" }, { status: 401 });
  }

  return null;
}

export async function readIndex(): Promise<CaseIndex> {
  const index = await casesStore().get(INDEX_KEY, { type: "json" });
  if (!index || !Array.isArray(index.cases)) {
    return { cases: [] };
  }

  return index as CaseIndex;
}

export async function writeIndex(index: CaseIndex) {
  const sorted = [...index.cases].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  await casesStore().setJSON(INDEX_KEY, { cases: sorted });
}

export async function readCase(id: string) {
  const item = await casesStore().get(`${CASE_PREFIX}${id}.json`, { type: "json" });
  return item as BrandCase | null;
}

export async function writeCase(brandCase: BrandCase) {
  await casesStore().setJSON(`${CASE_PREFIX}${brandCase.id}.json`, brandCase);
  const index = await readIndex();
  const summary = toSummary(brandCase);
  const nextCases = index.cases.filter((item) => item.id !== brandCase.id);
  nextCases.push(summary);
  await writeIndex({ cases: nextCases });
}

export async function deleteCase(id: string) {
  await casesStore().delete(`${CASE_PREFIX}${id}.json`);
  const index = await readIndex();
  await writeIndex({ cases: index.cases.filter((item) => item.id !== id) });
}

export function toSummary(brandCase: BrandCase): CaseSummary {
  const {
    id,
    title,
    client,
    category,
    industry,
    serviceType,
    summary,
    coverImage,
    status,
    updatedAt,
  } = brandCase;

  return {
    id,
    title,
    client,
    category,
    industry,
    serviceType,
    summary,
    coverImage,
    status,
    updatedAt,
  };
}

export function normalizeCase(input: Partial<BrandCase>): BrandCase {
  const now = new Date().toISOString();
  const id = input.id?.trim() || randomUUID();
  const createdAt = input.createdAt || now;
  const title = requiredText(input.title, "案例标题");
  const industry = input.industry?.trim() || "成长型品牌";
  const serviceType = input.serviceType?.trim() || "品牌内容策划";

  return {
    id,
    title,
    client: input.client?.trim() || title,
    category: input.category?.trim() || "品牌内容",
    industry,
    serviceType,
    summary: input.summary?.trim() || `${title} 是一个${industry}方向的${serviceType}案例，后台可继续补充更完整的项目说明。`,
    coverImage: input.coverImage?.trim() || "",
    gallery: normalizeTextList(input.gallery),
    challenge: input.challenge?.trim() || "",
    solution: input.solution?.trim() || "",
    results: normalizeTextList(input.results),
    highlights: normalizeTextList(input.highlights),
    videoUrl: input.videoUrl?.trim() || "",
    status: input.status === "draft" ? "draft" : "published",
    createdAt,
    updatedAt: now,
  };
}

function requiredText(value: string | undefined, label: string) {
  const text = value?.trim();
  if (!text) {
    throw new Error(`${label}不能为空`);
  }

  return text;
}

function normalizeTextList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}
