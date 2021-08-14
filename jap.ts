#!/usr/bin/env -S deno run --no-check --allow-read --allow-run

import { colors, path } from "./deps.ts";
import { minifiedEntry } from "./jmdictLoader.ts";

let dictionaryPath;
const fullSearch = Deno.args.find((argument) => {
  return argument.toLowerCase().includes("--full");
});
const reverse = Deno.args.find((argument) => {
  return argument.toLowerCase().includes("--rev");
});
if (fullSearch) {
  dictionaryPath = path.join(Deno.cwd(), "jmdict-min-full.json");
} else {
  dictionaryPath = path.join(Deno.cwd(), "jmdict-min.json");
}

const query = Deno.args.find((argument) => {
  return !argument.includes("--");
});
const enToJap = `map(select(.sense[] .translation | contains("${query}")))`;
const japToEn = `map(select(.kanji[] .text | contains("${query}")))`;

let p;
if (reverse) {
  p = Deno.run({
    cmd: [
      "jq",
      japToEn,
      "--unbuffered",
      "-e",
      dictionaryPath,
    ],
    stdout: "piped",
    stderr: "piped",
  });
} else {
  p = Deno.run({
    cmd: [
      "jq",
      enToJap,
      "--unbuffered",
      "-e",
      dictionaryPath,
    ],
    stdout: "piped",
    stderr: "piped",
  });
}

const [status, stdout, stderr] = await Promise.all([
  p.status(),
  p.output(),
  p.stderrOutput(),
]);

p.close();

if (status.code === 0) {
  const results = JSON.parse(
    new TextDecoder("utf-8").decode(stdout),
  ) as minifiedEntry[];

  const output = [];
  for (const result of results) {
    let kanji = "";
    if (result.kanji[0]) kanji = result.kanji[0].text;
    output.push({
      kanji: colors.magenta(pad(kanji, 4) + kanji),
      furigana: colors.blue(result.kana[0].text),
      translation: colors.italic(result.sense[0].translation),
  });
  }
  for (const entry of output) {
    console.log("%s    \t%s    \t%s",entry.kanji, entry.furigana, entry.translation);
  }
} else {
  const errorString = new TextDecoder().decode(stderr);
  console.log(errorString);
}

Deno.exit(status.code);

function pad(str: string, amount: number): string {
  let padLength = amount - str.length;

  let pad = "";
  if (padLength === 6) pad = "      ";
  else if (padLength === 5) pad = "     ";
  else if (padLength === 4) pad = "    ";
  else if (padLength === 3) pad = "   ";
  else if (padLength === 2) pad = "  ";
  else if (padLength === 1) pad = " ";
  return pad;
}