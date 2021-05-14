#!/usr/bin/env -S deno run --no-check --allow-read --allow-run

import { path } from "./deps.ts";
import {minifiedEntry} from "./jmdictLoader.ts";

let dictionaryPath;
const fullSearch = Deno.args.find(argument => { return argument.toLowerCase().includes("--full")});
if (fullSearch) {
  dictionaryPath = path.join(Deno.cwd(), "jmdict-min-full.json");
} else {
  dictionaryPath = path.join(Deno.cwd(), "jmdict-min.json");
}

const query = Deno.args.find(argument => { return !argument.includes("--")});
const jqArgument = `map(select(.sense[] .translation | contains("${query}")))`;

const p = Deno.run({
  cmd: [
    "jq",
    jqArgument,
    "--unbuffered",
    "-e",
    dictionaryPath,
  ],
  stdout: "piped",
  stderr: "piped",
});

const [status, stdout, stderr] = await Promise.all([
  p.status(),
  p.output(),
  p.stderrOutput()
]);

p.close();

if (status.code === 0) {
  const results = JSON.parse(new TextDecoder("utf-8").decode(stdout)) as minifiedEntry[];

  for (const result of results) {
    let kanji = "X";
    if (result.kanji[0]) { kanji = result.kanji[0].text }
    console.log(kanji, result.kana[0].text, result.sense[0].translation)
  }

} else {
  const errorString = new TextDecoder().decode(stderr);
  console.log(errorString);
}

Deno.exit(status.code);














/*
const translationIndex: TranslationIndex = { translations: [[]], ids: [] };

interface TranslationIndex {
  translations: string[][];
  ids: string[];
}

dictionary.forEach((entry, entryIndex) => {
  translationIndex.ids.push(entry.id);
  translationIndex.translations.push([]);
  entry.sense.forEach((value, senseIndex) => {
    translationIndex.translations[entryIndex][senseIndex] = value.translation;
  });
});

const num = 16234;
console.log(translationIndex.ids[num], translationIndex.translations[num]);

function lookUpById(id: string): minifiedEntry | undefined {
  return dictionary.find((value) => {
    return value.id === id;
  });
}

function lookUp(query: string): string[] | undefined {
  let ids = undefined;

  for (let i = 0; i < translationIndex.ids.length; i++) {
    ids = translationIndex.ids.filter((value, index) => {
      return translationIndex.translations[index][0].includes(query);
    });
  }
  if (!ids) {
    for (let i = 0; i < translationIndex.ids.length; i++) {
    ids = translationIndex.ids.filter((value, index) => {
      return translationIndex.translations[index][1].includes(query);
    });
  }
  }
  return ids;
}
console.log(lookUp("expedition;"));
*/