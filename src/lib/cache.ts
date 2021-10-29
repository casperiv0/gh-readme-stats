import Redis from "ioredis";
import { Stats } from "../types/Stats";
import { EdgeNode } from "../types/TopLanguagesResponse";
import { WakatimeStats } from "../types/WakatimeStats";

export type Cache =
  | { key: "stats"; value: Stats }
  | { key: "wakatime"; value: WakatimeStats }
  | { key: "top-langs"; value: Record<string, EdgeNode> };

export type CacheKeys = Cache["key"];

const client = new Redis(process.env["UPSTASH_REDIS_URL"]);

export async function set<T extends Cache = Cache>({ key, value }: T): Promise<T["value"]> {
  // expire after 2 hours
  await client.set(key, JSON.stringify(value), "EX", 7200);

  return value;
}

export async function get<K extends CacheKeys>(key: K) {
  const value = await client.get(key);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function del(key: CacheKeys) {
  await client.del(key);
  return true;
}
