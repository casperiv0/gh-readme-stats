import fastify from "fastify";
import "dotenv/config";
import { fetchTopLanguages } from "./lib/fetchTopLanguages";
import { clampValue } from "./utils";
import { renderTopLanguages } from "./cards/topLangsCard";
import { renderStatsCard } from "./cards/statsCard";
import { fetchStats } from "./lib/fetchStats";
import { renderWakatimeCard } from "./cards/wakatimeCard";
import { fetchWakatimeStats } from "./lib/fetchWakatimeStats";
import { getColors } from "./utils/getColors";

const CACHE_SECONDS = {
  THIRTY_MINUTES: 1800,
  TWO_HOURS: 7200,
  ONE_DAY: 86400,
};

const cacheSeconds = clampValue(
  CACHE_SECONDS.TWO_HOURS,
  CACHE_SECONDS.TWO_HOURS,
  CACHE_SECONDS.ONE_DAY,
);

const server = fastify();

server.get("/", async () => {
  return {
    routes: ["/stats", "/wakatime", "/top-langs"],
    message: "Info cards are powered by anuraghazra/github-readme-stats on GitHub!",
  };
});

server.get("/stats", async (req, reply) => {
  const stats = await fetchStats();

  reply.header("Content-Type", "image/svg+xml");
  reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

  const query = (req.query as Record<string, any>) ?? {};

  const options = {
    colors: getColors(query),
  };

  return reply.send(renderStatsCard(stats, options));
});

server.get("/wakatime", async (req, reply) => {
  const stats = await fetchWakatimeStats();

  reply.header("Content-Type", "image/svg+xml");
  reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

  const query = (req.query as Record<string, any>) ?? {};

  const options = {
    count: parseInt(query.count) ?? 5,
    colors: getColors(query),
  };

  return reply.send(renderWakatimeCard(stats, options));
});

server.get("/top-langs", async (req, reply) => {
  const topLangs = await fetchTopLanguages();

  reply.header("Content-Type", "image/svg+xml");
  reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

  const query = (req.query as Record<string, any>) ?? {};

  const options = {
    hide: query.hide?.split(",") ?? [],
    colors: getColors(query),
  };

  return reply.send(renderTopLanguages(topLangs, options));
});

server.listen(8080, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.info(`Server listening at ${address}`);
});
