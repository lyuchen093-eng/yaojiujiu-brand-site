import type { BrandCase, CaseSummary } from "./types";

export async function fetchCases() {
  const response = await fetch("/api/cases");
  if (!response.ok) {
    throw new Error("案例列表加载失败");
  }

  return (await response.json()) as { cases: CaseSummary[] };
}

export async function fetchCase(id: string) {
  const response = await fetch(`/api/cases/${id}`);
  if (!response.ok) {
    throw new Error("案例详情加载失败");
  }

  return (await response.json()) as BrandCase;
}

export async function fetchAdminCases(password: string) {
  const response = await fetch("/api/admin/cases", {
    headers: adminHeaders(password),
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  return (await response.json()) as { cases: CaseSummary[] };
}

export async function fetchAdminCase(password: string, id: string) {
  const response = await fetch(`/api/admin/cases/${id}`, {
    headers: adminHeaders(password),
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  return (await response.json()) as BrandCase;
}

export async function saveCase(password: string, payload: Partial<BrandCase>) {
  const response = await fetch("/api/admin/cases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(password),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  return (await response.json()) as BrandCase;
}

export async function deleteCase(password: string, id: string) {
  const response = await fetch(`/api/admin/cases/${id}`, {
    method: "DELETE",
    headers: adminHeaders(password),
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
}

export async function uploadImage(password: string, file: File, caseId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("caseId", caseId || "draft");

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: adminHeaders(password),
    body: formData,
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  return (await response.json()) as { url: string; key: string };
}

function adminHeaders(password: string) {
  return {
    "x-admin-password": password,
  };
}

async function errorMessage(response: Response) {
  try {
    const data = await response.json();
    return data.error || "请求失败";
  } catch {
    return "请求失败";
  }
}
