#!/usr/bin/env -S deno run --no-check --allow-net=jisho.org
import { printJson } from "./print_json.ts";
const url = "https://jisho.org/api/v1/search/words";

export async function fetchFromJisho(
  keyword: string,
  page?: string,
): Promise<Response> {
  let pageString = "";
  if (page) {
    pageString = "&page=" + page;
  }
  let query = `${url}?keyword=%23word %23common %3F*${keyword}*${pageString}`;
  console.info(query);
  return await fetch(query);
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

export async function getRelevantInfo(query: string) {
  let json = await getJson(fetchFromJisho(query));
  let result = [];

  for (let i = 0; i < 50; i++) {
    if (json["data"][i] === undefined) break;
    let entry = {};
    entry.jlpt = json["data"][i]["jlpt"];
    entry.tags = json["data"][i]["tags"];
    entry.japanese = json["data"][i]["japanese"];
    entry.senses = [];
    if (json["data"][i]["senses"][0] !== undefined) {
      entry.senses.push(json["data"][i]["senses"][0]["english_definitions"]);
    }
    if (json["data"][i]["senses"][1] !== undefined) {
      entry.senses.push(json["data"][i]["senses"][1]["english_definitions"]);
    }
    if (json["data"][i]["senses"][2] !== undefined) {
      entry.senses.push(json["data"][i]["senses"][2]["english_definitions"]);
    }
    result.push(entry);
  }
  return result;
}
