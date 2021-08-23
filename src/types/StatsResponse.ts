export interface StatsResponse {
  data: Data;
}

interface Data {
  user: User;
}

export interface User {
  name: string;
  login: string;
  contributionsCollection: ContributionsCollection;
  repositoriesContributedTo: RepositoriesContributedTo;
  pullRequests: RepositoriesContributedTo;
  issues: RepositoriesContributedTo;
  followers: RepositoriesContributedTo;
  repositories: Repositories;
}

interface Repositories {
  totalCount: number;
  nodes: Node[];
}

export interface Node {
  stargazers: RepositoriesContributedTo;
}

export interface RepositoriesContributedTo {
  totalCount: number;
}

export interface ContributionsCollection {
  restrictedContributionsCount: number;
}
