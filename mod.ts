import { csv, path } from "./deps.ts";
import { fetchFromJisho, getJson } from "./fetchJisho.ts";

if (import.meta.main) {
  const keyword: string = Deno.args[0];
  const page: string = Deno.args[1];

  const filePath = path.join(Deno.cwd(), "rtk.csv");
  const rtk = await csv.parse(Deno.readTextFileSync(filePath), {
    skipFirstRow: false,
  });
  const kanjiList = await csv.parse(Deno.readTextFileSync(filePath), {
    skipFirstRow: false,
    parse: parseKanji,
  });

  for (const kanji of kanjiList) {
    console.log(kanji);

    const affirmative = await confirm("Do you want to go on? [y/n]");
    if (!affirmative) {
      break;
    }
  }
}

function parseKanji(row: unknown) {
  if (Array.isArray(row)) {
    return row[0];
  }
}

function confirm(question: string): boolean {
  let answer= false;
  let line = "LUL";
  while (line !== "y" && line !== "n") {
    line = prompt(question) || "bleh";
    if (line === "y") {
      answer = true;
    } else if (line === "n") {
      answer = false;
    }
  }
  return answer;
}
