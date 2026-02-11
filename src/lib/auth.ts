const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function setTokens(tokens: { accessToken: string; refreshToken: string }) {
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/** ---------------- 추가: 유저 정보 ---------------- **/

// JWT payload decode (서명 검증 X, 표시용)
export function decodeJwt(token: string | null) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// accessToken에서 현재 유저 가져오기 (payload: { sub, email, name })
export function getCurrentUser() {
  const token = getAccessToken();
  const p = decodeJwt(token);
  if (!p) return null;

  return {
    id: Number(p.sub),
    email: p.email ?? "",
    name: p.name ?? null,
  };
}

export function getInitials(nameOrEmail: string | null | undefined) {
  const s = String(nameOrEmail ?? "").trim();
  if (!s) return "U";

  // 한글이면 첫 글자, 영문이면 첫 글자
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
}
