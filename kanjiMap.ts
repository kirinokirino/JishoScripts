import { path } from "./deps.ts";
import { minifiedEntry } from "./jmdictLoader.ts";

const jmdictPath = path.join(Deno.cwd(), "jmdict-min.json");
const outputPath = path.join(Deno.cwd(), "jmdictObject.json");
const json = JSON.parse(Deno.readTextFileSync(jmdictPath)) as minifiedEntry[];

const result = Object.create(null);

for (const entry of json) {
  entry.kanji.forEach((kanji) => {
    if (result[kanji.text] != undefined) {
      if (result[kanji.text].alt == undefined) {
        result[kanji.text].alt = {
          "readings": entry.kana.filter((kana) => {
            for (const appliedTo of kana.appliesToKanji) {
              if (appliedTo == "*" || appliedTo == kanji.text) {
                return true;
              }
            }
            return false;
          }).map((kana) => {
            return kana.text;
          }),
          "meanings": entry.sense.filter((sense) => {
            for (const appliedTo of sense.appliesToKanji) {
              if (appliedTo == "*" || appliedTo == kanji.text) {
                return true;
              }
            }
            return false;
          }).map((sense) => {
            return sense.translation;
          }),
        };
      } else {
        result[kanji.text].alt2 = {
          "readings": entry.kana.filter((kana) => {
            for (const appliedTo of kana.appliesToKanji) {
              if (appliedTo == "*" || appliedTo == kanji.text) {
                return true;
              }
            }
            return false;
          }).map((kana) => {
            return kana.text;
          }),
          "meanings": entry.sense.filter((sense) => {
            for (const appliedTo of sense.appliesToKanji) {
              if (appliedTo == "*" || appliedTo == kanji.text) {
                return true;
              }
            }
            return false;
          }).map((sense) => {
            return sense.translation;
          }),
        };
      }
    } else {
      result[kanji.text] = {
        "readings": entry.kana.filter((kana) => {
          for (const appliedTo of kana.appliesToKanji) {
            if (appliedTo == "*" || appliedTo == kanji.text) {
              return true;
            }
          }
          return false;
        }).map((kana) => {
          return kana.text;
        }),
        "meanings": entry.sense.filter((sense) => {
          for (const appliedTo of sense.appliesToKanji) {
            if (appliedTo == "*" || appliedTo == kanji.text) {
              return true;
            }
          }
          return false;
        }).map((sense) => {
          return sense.translation;
        }),
      };
    }
  });
}

Deno.writeTextFileSync(outputPath, JSON.stringify(result));
