import * as SecureStore from "expo-secure-store";
import { Game, Edge, Prop } from "../types";

const SERVER_URL_KEY = "plus_ev_server_url";
const DEFAULT_URL = "http://10.0.2.2:8000"; // Android emulator localhost

async function getBaseUrl(): Promise<string> {
  const stored = await SecureStore.getItemAsync(SERVER_URL_KEY);
  return stored || DEFAULT_URL;
}

export async function setServerUrl(url: string): Promise<void> {
  // Normalize: remove trailing slash
  const normalized = url.replace(/\/+$/, "");
  await SecureStore.setItemAsync(SERVER_URL_KEY, normalized);
}

export async function getServerUrl(): Promise<string> {
  return getBaseUrl();
}

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const base = await getBaseUrl();
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function healthCheck(): Promise<boolean> {
  try {
    const data = await apiFetch<{ status: string }>("/api/health");
    return data.status === "ok";
  } catch {
    return false;
  }
}

export async function fetchGames(): Promise<Game[]> {
  const data = await apiFetch<{ success: boolean; games: Game[]; error?: string }>(
    "/api/games"
  );
  if (!data.success) throw new Error(data.error || "Failed to fetch games");
  return data.games;
}

export async function fetchEdges(minEdge: number = 5.0): Promise<Edge[]> {
  const data = await apiFetch<{ success: boolean; edges: Edge[]; error?: string }>(
    "/api/edges",
    { min_edge: minEdge.toString() }
  );
  if (!data.success) throw new Error(data.error || "Failed to fetch edges");
  return data.edges;
}

export async function fetchProps(
  gameId: string,
  propType: string = "points",
  minLine: number = 0
): Promise<Prop[]> {
  const data = await apiFetch<{ success: boolean; props: Prop[]; error?: string }>(
    `/api/props/${gameId}`,
    { type: propType, min_line: minLine.toString() }
  );
  if (!data.success) throw new Error(data.error || "Failed to fetch props");
  return data.props;
}
