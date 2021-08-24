import "dotenv/config";
import axios from "axios";
import { WakatimeStats } from "../types/WakatimeStats.js";

export async function fetchWakatimeStats(): Promise<WakatimeStats> {
  const res = await axios({
    url: `https://wakatime.com/api/v1/users/${process.env["WAKATIME_USERNAME"]}/stats?is_including_today=true`,
  });

  return res.data.data;
}
