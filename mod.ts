import { csv, path } from "./deps.ts";
import { getRelevantInfo } from "./fetchJisho.ts";

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
  let rtkEnchanced = [];
  for (const kanji of kanjiList) {
    if (typeof kanji === "string") {
      console.log(kanji);
      rtkEnchanced.push({
        basic: rtk[rtkEnchanced.length],
        extended: await getRelevantInfo(kanji),
      });
      const affirmative = await confirm("Do you want to go on? [y/n]");
      if (!affirmative) {
        break;
      }
    }
  }
  console.log(
    writeJson(path.join(Deno.cwd(), "rtkEnchanced.json"), rtkEnchanced),
  );
}

function parseKanji(row: unknown) {
  if (Array.isArray(row)) {
    return row[0];
  }
}

function confirm(question: string): boolean {
  let answer = false;
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

function writeJson(path: string, data: object): string {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}
