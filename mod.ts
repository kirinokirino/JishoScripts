import { csv, path } from "./deps.ts";
import { Entry, getRelevantInfo } from "./fetchJisho.ts";

if (import.meta.main) {
  const filePath = path.join(Deno.cwd(), "rtk.csv");
  const rtk = await csv.parse(Deno.readTextFileSync(filePath), {
    skipFirstRow: false,
  });
  const kanjiList = await csv.parse(Deno.readTextFileSync(filePath), {
    skipFirstRow: false,
    parse: parseKanji,
  });
  const rtkEnchanced: rtkEntry[] = [];
  for (const kanji of kanjiList) {
    if (typeof kanji === "string") {
      console.log(kanji);
      rtkEnchanced.push({
        basic: rtk[rtkEnchanced.length] as string[],
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

interface rtkEntry {
  basic: string[];
  extended: Entry[];
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

function writeJson(path: string, data: rtkEntry[]): string {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}
