import "dotenv/config";
import axios from "axios";

export async function fetchWakatimeStats() {
  const res = await axios({
    url: `https://wakatime.com/api/v1/users/${process.env["WAKATIME_USERNAME"]}/stats?is_including_today=true`,
  });

  return res.data.data;
}
