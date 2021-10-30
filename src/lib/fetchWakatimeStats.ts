import axios from "axios";
import type { WakatimeStats } from "../types/WakatimeStats.js";
import * as redis from "../lib/cache.js";

export async function fetchWakatimeStats(): Promise<WakatimeStats> {
  const cached = await redis.get("wakatime");
  if (cached) return cached;

  const res = await axios({
    url: `https://wakatime.com/api/v1/users/${process.env["WAKATIME_USERNAME"]}/stats?is_including_today=true`,
  });

  const data: WakatimeStats = {
    human_readable_range: res.data.data.human_readable_range,
    languages: res.data.data.languages,
    total_seconds_including_other_language: res.data.data.total_seconds_including_other_language,
  };

  return redis.set({ key: "wakatime", value: data });
}
