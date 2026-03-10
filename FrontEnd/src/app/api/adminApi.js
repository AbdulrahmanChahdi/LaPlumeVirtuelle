import { getAuthToken } from "./authToken"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

async function request(path, options = {}) {
	const token = await getAuthToken()
	let res

	try {
		res = await fetch(`${API_BASE}${path}`, {
			...options,
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
				...(options.headers || {})
			}
		})
	} catch (err) {
		throw new Error(`Backend indisponible. Vérifiez que le serveur Spring Boot tourne sur ${API_BASE}.`)
	}

	if (!res.ok) {
		let details = ""
		try {
			details = await res.text()
		} catch {
			details = ""
		}
		const suffix = details ? ` - ${details}` : ""
		throw new Error(`Erreur API (${res.status}): ${res.statusText}${suffix}`)
	}

	if (res.status === 204) return null

	const raw = await res.text()
	if (!raw) return null

	try {
		return JSON.parse(raw)
	} catch {
		return raw
	}
}

export function getAdminUsers() {
	return request("/api/utilisateurs/all")
}

export function saveAdminUser(user) {
	return request("/api/utilisateurs/save", {
		method: "POST",
		body: JSON.stringify(user)
	})
}

export function deleteAdminUser(id) {
	return request(`/api/utilisateurs/delete/${id}`, { method: "DELETE" })
}

export function getAdminDigitalBooks() {
	return request("/api/livres")
}

export function saveAdminDigitalBook(book) {
	return request("/api/livres/add", {
		method: "POST",
		body: JSON.stringify(book)
	})
}

export function deleteAdminDigitalBook(id) {
	return request(`/api/livres/${id}`, { method: "DELETE" })
}

export function getAdminAudiobooks() {
	return request("/api/livres-audio")
}

export function saveAdminAudiobook(audiobook) {
	return request("/api/livres-audio", {
		method: "POST",
		body: JSON.stringify(audiobook)
	})
}

export function deleteAdminAudiobook(id) {
	return request(`/api/livres-audio/${id}`, { method: "DELETE" })
}

export function getAdminPodcasts() {
	return request("/api/podcasts")
}

export function saveAdminPodcast(podcast) {
	return request("/api/podcasts", {
		method: "POST",
		body: JSON.stringify(podcast)
	})
}

export function deleteAdminPodcast(id) {
	return request(`/api/podcasts/${id}`, { method: "DELETE" })
}

export function getAdminCategories() {
	return request("/api/categories")
}

export function getAdminAuthors() {
	return request("/api/auteurs")
}

export function saveAdminAuthor(author) {
	return request("/api/auteurs", {
		method: "POST",
		body: JSON.stringify(author)
	})
}
