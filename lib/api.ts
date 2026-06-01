import type { ApiResponse } from "@/lib/types";

// 서버 사이드: 절대 URL (직접 백엔드 호출)
// 클라이언트 사이드: 상대 URL /api/v1/* → Next.js rewrites → 백엔드 프록시 (CORS 우회)
function getBase(): string {
  if (typeof window === "undefined") {
    // SSR / Server Component
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      console.warn("[api] NEXT_PUBLIC_API_BASE_URL 이 설정되지 않았습니다.");
    }
    return base ?? "http://localhost:8080/api/v1";
  }
  // 브라우저: Next.js rewrites 프록시 경유
  return "/api/v1";
}

// ─────────────────────────────────────────
// 에러 클래스
// ─────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─────────────────────────────────────────
// 기본 fetch 래퍼
// ─────────────────────────────────────────

async function fetchApi<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${getBase()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    try {
      const json = (await res.json()) as ApiResponse<never>;
      throw new ApiError(
        res.status,
        json.error?.message ?? `HTTP ${res.status}`,
        json.error?.code
      );
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new ApiError(res.status, `HTTP ${res.status}`);
    }
  }

  return (await res.json()) as ApiResponse<T>;
}

// ─────────────────────────────────────────
// 공개 API
// ─────────────────────────────────────────

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const json = await fetchApi<T>(path, init);
  if (!json.success || json.data === null) {
    throw new ApiError(
      500,
      json.error?.message ?? "알 수 없는 오류",
      json.error?.code
    );
  }
  return json.data;
}

export async function apiGetWithDisclaimer<T>(
  path: string,
  init?: RequestInit
): Promise<{ data: T; disclaimer: string }> {
  const json = await fetchApi<T>(path, init);
  if (!json.success || json.data === null) {
    throw new ApiError(
      500,
      json.error?.message ?? "알 수 없는 오류",
      json.error?.code
    );
  }
  return { data: json.data, disclaimer: json.disclaimer };
}
