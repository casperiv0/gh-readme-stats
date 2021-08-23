import fastify from "fastify";
import "dotenv/config";
import { fetchTopLanguages } from "./lib/fetchTopLanguages";
import { clampValue } from "./utils";
import { renderTopLanguages } from "./cards/topLangsCard";

const CACHE_SECONDS = {
  THIRTY_MINUTES: 1800,
  TWO_HOURS: 7200,
  FOUR_HOURS: 14400,
  ONE_DAY: 86400,
};

const server = fastify();

server.get("/top-langs", async (req, reply) => {
  const topLangs = await fetchTopLanguages();

  const cacheSeconds = clampValue(
    CACHE_SECONDS.TWO_HOURS,
    CACHE_SECONDS.TWO_HOURS,
    CACHE_SECONDS.ONE_DAY,
  );

  reply.header("Content-Type", "image/svg+xml");
  reply.header("Cache-Control", `public, max-age=${cacheSeconds}`);

  const query = (req.query as Record<string, any>) ?? {};

  const options = {
    hide: query.hide?.split(",") ?? [],
    colors: {
      iconColor: "#4c71f2",
      textColor: "#333",
      bgColor: "#fffefe",
      borderColor: "#e4e2e2",
    },
  };

  return reply.send(renderTopLanguages(topLangs, options));
});

server.listen(8080, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
