import type { RawItem, SuggestResult } from "./types";

export async function fetchAddressSuggest(query: string): Promise<SuggestResult> {
  if (!query.trim()) return { mode: "empty" };

  // ⚠️ при деплое вынеси базу в VITE_API_BASE
  const base = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";
  const res = await fetch(`${base}/api/address/suggest?query=${encodeURIComponent(query.trim())}`);

  if (!res.ok) return { mode: "empty" };

  const data = await res.json();

  const list: RawItem[] = Array.isArray(data) ? data : data?.suggestions ?? [];
  if (!Array.isArray(list) || list.length === 0) return { mode: "empty" };

  const first = list[0];
  if (first?.value?.trim().toLowerCase() === query.toLowerCase()) {
    return { mode: "match", match: first };
  }

  const suggestions = list.map((i) => i?.value).filter((v): v is string => typeof v === "string" && !!v.trim());

  return suggestions.length ? { mode: "list", suggestions } : { mode: "empty" };
}
