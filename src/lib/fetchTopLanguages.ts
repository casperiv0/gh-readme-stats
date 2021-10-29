import "dotenv/config";
import { request } from "../utils/request.js";
import { Edge, EdgeNode, TopLanguagesResponse } from "../types/TopLanguagesResponse.js";
import * as redis from "../lib/cache.js";

const QUERY = `
  query userInfo($login: String!) {
    user(login: $login) {
      # fetch only owner repos & not forks
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        nodes {
          name
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                color
                name
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchTopLanguages(hide: string[] = []): Promise<Record<string, EdgeNode>> {
  const cached = await redis.get("top-langs");
  if (cached) return cached;

  const res = await request(
    {
      query: QUERY,
      variables: { login: process.env["GITHUB_USERNAME"] },
    },
    {
      Authorization: `bearer ${process.env["GITHUB_PERSONAL_ACCESS_TOKEN"]}`,
    },
  );

  const data = res.data as TopLanguagesResponse;
  let repoNodes: EdgeNode = {} as EdgeNode;

  repoNodes = data.data.user.repositories.nodes
    .filter(({ name }) => {
      return !hide.includes(name);
    })
    .filter((n) => n.languages.edges.length > 0)
    .reduce((acc, curr) => [...acc, ...curr.languages.edges], [] as Edge[])
    .reduce((acc, prev) => {
      // get the size of the language (bytes)
      let langSize = prev.size;

      // if we already have the language in the accumulator
      // & the current language name is same as previous name
      // add the size to the language size.
      if (acc[prev.node.name] && prev.node.name === acc[prev.node.name].name) {
        langSize = prev.size + acc[prev.node.name].size;
      }
      return {
        ...acc,
        [prev.node.name]: {
          name: prev.node.name,
          color: prev.node.color,
          size: langSize,
        },
      };
    }, {} as EdgeNode);

  const topLangs = Object.keys(repoNodes)
    .sort((a, b) => repoNodes[b].size - repoNodes[a].size)
    .reduce((result, key) => {
      result[key] = repoNodes[key];
      return result;
    }, {} as Record<string, EdgeNode>);

  return redis.set({ key: "top-langs", value: topLangs });
}
