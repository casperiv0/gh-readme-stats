/**
 * generated via https://json2typescript.com/
 */

export interface TopLanguagesResponse {
  data: Data;
}

interface Data {
  user: User;
}

interface User {
  repositories: Repositories;
}

interface Repositories {
  nodes: Node[];
}

export interface Node {
  name: string;
  languages: Languages;
}

export interface Languages {
  edges: Edge[];
}

export interface Edge {
  size: number;
  node: EdgeNode;
}

export interface EdgeNode {
  color: string;
  name: string;
  size: number;
}
