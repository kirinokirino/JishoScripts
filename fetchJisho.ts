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

export function getJsonData(promise: Promise<Response>) {
  promise.then((response) => {
    if (response.status !== 200) {
      console.error("Response status ", response.status);
      return null;
    } else return response.json();
  }).then((data?) => {
    if (data) {
      console.log(data);
    } else {
      console.error("No response...");
    }
  });
}

export function getArrayBuffer(promise: Promise<Response>) {
  promise.then((response) => {
    if (response.status !== 200) {
      console.error("Response status ", response.status);
      return null;
    } else return response.arrayBuffer();
  }).then((data?) => {
    if (data) {
      Deno.stdout.write(new Uint8Array(data));
    } else {
      console.error("No response...");
    }
  });
}
