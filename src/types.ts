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
