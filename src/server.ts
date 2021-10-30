import fastify from "fastify";
import "dotenv/config";
import { fetchTopLanguages } from "./lib/fetchTopLanguages.js";
import { clampValue } from "./utils/index.js";
import { renderTopLanguages } from "./cards/topLangsCard.js";
import { renderStatsCard } from "./cards/statsCard.js";
import { fetchStats } from "./lib/fetchStats.js";
import { renderWakatimeCard } from "./cards/wakatimeCard.js";
import { fetchWakatimeStats } from "./lib/fetchWakatimeStats.js";
import { getColors } from "./utils/getColors.js";

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
    message: "Info cards are powered by anuraghazra/github-readme-stats on GitHub!",
    routes: ["/stats", "/wakatime", "/top-langs"],
  };
});

server.get("/stats", async (req, reply) => {
  try {
    const stats = await fetchStats();

    reply.header("Content-Type", "image/svg+xml");
    reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

    const query = (req.query as Record<string, any>) ?? {};

    const options = {
      colors: getColors(query),
    };

    return reply.send(renderStatsCard(stats, options));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown";
    return reply.status(500).send({ error: message });
  }
});

server.get("/wakatime", async (req, reply) => {
  try {
    const stats = await fetchWakatimeStats();

    reply.header("Content-Type", "image/svg+xml");
    reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

    const query = (req.query as Record<string, any>) ?? {};

    const options = {
      count: query.count ? parseInt(query.count) : 5,
      colors: getColors(query),
    };

    return reply.send(renderWakatimeCard(stats, options));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown";
    return reply.status(500).send({ error: message });
  }
});

server.get("/top-langs", async (req, reply) => {
  try {
    const topLangs = await fetchTopLanguages();

    reply.header("Content-Type", "image/svg+xml");
    reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

    const query = (req.query as Record<string, any>) ?? {};

    const options = {
      hide: query.hide?.split(",") ?? [],
      colors: getColors(query),
    };

    return reply.send(renderTopLanguages(topLangs, options));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown";
    return reply.status(500).send({ error: message });
  }
});

server.listen(8080, "0.0.0.0", (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.info("Server listening at http://localhost:8080");
});
