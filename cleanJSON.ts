import { path, walkSync } from "./deps.ts";
import { rtkEntry } from "./mod.ts";

const kanjisDirPath = path.join(path.join(Deno.cwd(), "kanjis"), ".");

for (const entry of walkSync(kanjisDirPath)) {
  if (!entry.path.endsWith(".json")) continue;

  const json = JSON.parse(Deno.readTextFileSync(entry.path)) as rtkEntry;

  const set = new Set();
  json.extended.map((val) => {
    set.add(JSON.stringify(val));
  });
  console.log(
    json.basic[0],
    ` -- cleaned up ${json.extended.length - set.size} duplicate entries.`,
  );
  json.extended = [];
  set.forEach((val) => {
    json.extended.push(JSON.parse(val));
  });

  Deno.writeTextFileSync(entry.path, JSON.stringify(json));
}
