#!/usr/bin/env -S deno run --no-check --allow-net=jisho.org
const url = "https://jisho.org/api/v1/search/words";

export async function fetchFromJisho(
  keyword: string,
  page?: string,
): Promise<Response> {
  if (!page) {
    return await fetch(url + "?keyword=" + keyword);
  } else {
    return await fetch(url + "?keyword=" + keyword + "page=" + page);
  }
}

export function getJson(
  promise: Promise<Response>,
): Promise<unknown> {
  return promise.then((response) => {
    return response.json();
  }).then(async (jsonData) => {
    return await jsonData;
  });
}