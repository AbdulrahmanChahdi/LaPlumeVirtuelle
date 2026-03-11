import { getAuthToken } from "./authToken"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

async function parseErrorResponse(res) {
  const raw = await res.text()

  try {
    const parsed = JSON.parse(raw)
    if (parsed?.error) {
      return parsed.error
    }
    return raw || `Erreur HTTP ${res.status}`
  } catch {
    return raw || `Erreur HTTP ${res.status}`
  }
}

async function authorizedRequest(path, options = {}) {
  const token = await getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const message = await parseErrorResponse(response)
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function createOrUpdateProfile(profilePayload) {
  return authorizedRequest("/api/profile", {
    method: "POST",
    body: JSON.stringify(profilePayload),
  })
}

export async function getRecommendations(limit = 12) {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, limit)) : 12
  const query = new URLSearchParams({ limit: String(safeLimit) })

  return authorizedRequest(`/api/recommendations?${query.toString()}`, {
    method: "GET",
  })
}
