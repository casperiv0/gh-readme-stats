import axios from "axios";

export async function request<T = unknown>(data?: T, headers?: Record<string, unknown>) {
  return axios({
    url: "https://api.github.com/graphql",
    method: "post",
    headers,
    data,
  });
}
