#!/usr/bin/env -S deno run --no-check --allow-net=jisho.org
const url = "https://jisho.org/api/v1/search/words";

export async function fetchFromJisho(
  keyword: string,
  page?: string,
): Promise<Response> {
  let pageString = "";
  if (page) {
    pageString = "&page=" + page;
  }
  const query = `${url}?keyword=%23word %23common %3F*${keyword}*${pageString}`;
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
  const json = await getJson(fetchFromJisho(query)) as JishoJSON;
  const result: Entry[] = [];

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
