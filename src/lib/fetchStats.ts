import axios, { AxiosResponse } from "axios";
import "dotenv/config";
import { Stats } from "../types/Stats.js";
import { StatsResponse } from "../types/StatsResponse.js";
import { request } from "../utils/request.js";
import * as redis from "../lib/cache.js";

const QUERY = `
  query userInfo($login: String!) {
    user(login: $login) {
      name
      login
      contributionsCollection {
        restrictedContributionsCount
      }
      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
        totalCount
      }
      pullRequests(first: 1) {
        totalCount
      }
      issues(first: 1) {
        totalCount
      }
      followers {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
        totalCount
        nodes {
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`;

async function fetchTotalCommits(): Promise<number> {
  try {
    const res = await axios({
      method: "get",
      url: `https://api.github.com/search/commits?q=author:${process.env["GITHUB_USERNAME"]}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.cloak-preview",
        Authorization: `bearer ${process.env["GITHUB_PERSONAL_ACCESS_TOKEN"]}`,
      },
    });

    return res.data.total_count;
  } catch {
    return 0;
  }
}

export async function fetchStats() {
  const cached = await redis.get("stats");
  if (cached) return cached as Stats;

  const res: AxiosResponse<StatsResponse> = await request(
    {
      query: QUERY,
      variables: { login: process.env["GITHUB_USERNAME"] },
    },
    {
      Authorization: `bearer ${process.env["GITHUB_PERSONAL_ACCESS_TOKEN"]}`,
    },
  );

  const stats: Stats = {} as Stats;

  const totalCommits = await fetchTotalCommits();
  const { user } = res.data.data;

  stats.name = user.name || user.login;
  stats.totalIssues = user.issues.totalCount;
  stats.totalPRs = user.pullRequests.totalCount;
  stats.contributedTo = user.repositoriesContributedTo.totalCount;

  stats.totalCommits = totalCommits + user.contributionsCollection.restrictedContributionsCount;

  stats.totalStars = user.repositories.nodes.reduce((prev, curr) => {
    return prev + curr.stargazers.totalCount;
  }, 0);

  return redis.set({ key: "stats", value: stats });
}
