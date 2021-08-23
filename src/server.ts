import fastify from "fastify";
import "dotenv/config";
import { fetchTopLanguages } from "./lib/fetchTopLanguages";
import { clampValue } from "./utils";
import { renderTopLanguages } from "./cards/topLangsCard";
import { renderStatsCard } from "./cards/statsCard";
import { fetchStats } from "./lib/fetchStats";

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

server.get("/stats", async (req, reply) => {
  const stats = await fetchStats();

  reply.header("Content-Type", "image/svg+xml");
  reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

  const query = (req.query as Record<string, any>) ?? {};

  const options = {
    colors: {
      titleColor: query.titleColor ? `#${query.titleColor}` : "#2f80ed",
      iconColor: query.iconColor ? `#${query.iconColor}` : "#4c71f2",
      textColor: query.textColor ? `#${query.textColor}` : "#333333",
      bgColor: query.bgColor ? `#${query.bgColor}` : "#fffefe",
      borderColor: query.borderColor && `#${query.borderColor}`,
    },
  };

  return reply.send(renderStatsCard(stats, options));
});

server.get("/top-langs", async (req, reply) => {
  const topLangs = await fetchTopLanguages();

  reply.header("Content-Type", "image/svg+xml");
  reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

  const query = (req.query as Record<string, any>) ?? {};

  const options = {
    hide: query.hide?.split(",") ?? [],
    colors: {
      titleColor: query.titleColor ? `#${query.titleColor}` : "#2f80ed",
      iconColor: query.iconColor ? `#${query.iconColor}` : "#4c71f2",
      textColor: query.textColor ? `#${query.textColor}` : "#333333",
      bgColor: query.bgColor ? `#${query.bgColor}` : "#fffefe",
      borderColor: query.borderColor && `#${query.borderColor}`,
    },
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
