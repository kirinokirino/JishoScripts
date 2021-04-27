import { csv, path } from "./deps.ts";
import { fetchFromJisho, getArrayBuffer } from "./fetchJisho.ts";

if (import.meta.main) {
  const keyword: string = Deno.args[0];
  const page: string = Deno.args[1];

  const filePath = path.join(Deno.cwd(), "rtk.csv");
  const rtk = await csv.parse(Deno.readTextFileSync(filePath), {
    skipFirstRow: false,
  });
  const kanji = await csv.parse(Deno.readTextFileSync(filePath), {
    skipFirstRow: false,
    parse: parseKanji,
  });

  console.log(rtk);

  //getArrayBuffer(fetchFromJisho(keyword, page));
}

function parseKanji(row: unknown) {
  if (Array.isArray(row)) {
    return row[0];
  }
}
