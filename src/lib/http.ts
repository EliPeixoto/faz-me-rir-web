import keycloak from "../auth/keycloak";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function request<T>(path:string, method: HttpMethod, body?: unknown): Promise<T> {
    const token = keycloak?.token;

    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if(!res.ok){
        const text = await res.text().catch(()=>"");
        throw new Error(`HTTP error! status: ${res.status} - ${text || res.statusText}`);
    }

    //Delete pode voltar vazio
    if(res.status ===204)return undefined as T;

    return (await res.json()) as T;
}

export const http = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body: unknown) => request<T>(path, "POST", body),
  put: <T>(path: string, body: unknown) => request<T>(path, "PUT", body),
  del: <T>(path: string) => request<T>(path, "DELETE"),
}
