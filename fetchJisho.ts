#!/usr/bin/env -S deno run --no-check --allow-net=jisho.org
import { delay } from "./deps.ts";
const url = "https://jisho.org/api/v1/search/words";

export async function fetchFromJisho(
  keyword: string,
  page?: number,
): Promise<Response> {
  let pageString = "";
  if (page) {
    pageString = "&page=" + page.toString();
  }
  const query = `${url}?keyword=%23word %23common %3F*${keyword}*${pageString}`;
  console.debug(query);
  await delay(250);
  return await fetch(query);
}

export async function getJson(
  promise: Promise<Response>,
): Promise<unknown> {
  try {
    return await promise.then((response) => {
      return response.json();
    }).then(async (jsonData) => {
      return await jsonData;
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Not a JSON response!");
      return {
        data: [],
      };
    }
  }
}

export async function getRelevantInfo(query: string): Promise<Entry[]> {
  const result: Entry[] = [];
  let json: JishoJSON;

  json = await getJson(fetchFromJisho(query)) as JishoJSON;
  let page = 0;
  while (json["data"][0] !== undefined) {
    page += 1;
    for (let i = 0; i < 50; i++) {
      if (json["data"][i] === undefined) break;
      const jlpt = json["data"][i]["jlpt"];
      const tags = json["data"][i]["tags"];
      const japanese = json["data"][i]["japanese"];
      const senses: Sense[] = json["data"][i]["senses"].map((sense: Sense) => {
        return sense["english_definitions"];
      });
      const entry: Entry = {
        jlpt,
        tags,
        japanese,
        senses,
      };
      result.push(entry);
    }
    json = await getJson(fetchFromJisho(query, page)) as JishoJSON;
  }
  return result;
}

interface JishoJSON {
  data: Array<Entry>;
}

export interface Entry {
  jlpt: Record<string, unknown>;
  tags: Record<string, unknown>;
  japanese: Record<string, unknown>;
  senses: Sense[];
}

interface Sense {
  // deno-lint-ignore camelcase
  english_definitions: Sense;
}
