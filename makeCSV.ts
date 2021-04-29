import { csv, path, walkSync } from "./deps.ts";
import { rtkEntry } from "./mod.ts";

const kanjisDirPath = path.join(path.join(Deno.cwd(), "kanjis"), ".");
let csv = "";
let ordered = {}
for (const entry of walkSync(kanjisDirPath)) {
  if (!entry.path.endsWith(".json")) continue;

  const json = JSON.parse(Deno.readTextFileSync(entry.path)) as rtkEntry;
  console.log(json.basic[2], " - " + json.basic[0]);

  let csvLineArray = [];
  csvLineArray.push(json.basic[0]);
  csvLineArray.push(json.basic[1]);
  csvLineArray.push(json.basic[2]);

  json.extended.forEach((vocab) => {
    csvLineArray.push(vocab.jlpt);
    csvLineArray.push(flatDeep(japaneseFurigana(vocab.japanese), 20));
    csvLineArray.push(flatDeep(vocab.senses, 20));
  });

  ordered[json.basic[2]] = csvLineArray.join("\t");
}

for (let i = 0; i < 2300; i++) {
  if (ordered[i] === undefined) continue;
  csv += ordered[i] + "\n";
}

Deno.writeTextFileSync(path.join(Deno.cwd(), "rtkEnchanced.txt"), csv);

function japaneseFurigana(pairs) {
  let res = [];
  for (let vocab of pairs) {
    let word = vocab.word;
    vocab.reading = word + "[" + vocab.reading + "]";
    res.push(vocab.reading);
  }
  return res;
}

function flatDeep(arr, d = 1) {
  if (d > 0) {
    const res = arr.reduce((acc, val) => {
      let res;
      if (Array.isArray(val)) {
        res = flatDeep(val, d - 1);
      } else if (typeof val === "object") {
        res = flatDeep(Object.values(val), d - 1);
      } else res = val;
      if (acc === undefined) return [res];
      else return acc.concat(res);
    }, []);
    //console.log(res)
    return res;
  } else {
    return arr.slice();
  }
} /*
const rtk = await csv.parse(Deno.readTextFileSync(filePath), {
  skipFirstRow: false,
});
const kanjiList = await csv.parse(Deno.readTextFileSync(filePath), {
  skipFirstRow: false,
  parse: parseKanji,
});
*/
