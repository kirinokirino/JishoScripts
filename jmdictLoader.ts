import { path } from "./deps.ts";

const jmdictPath = path.join(Deno.cwd(), "jmdict-eng-common-3.1.0.json");
const outputPath = path.join(Deno.cwd(), "jmdict-min.json");
const json = JSON.parse(Deno.readTextFileSync(jmdictPath)) as Jmdict;
const minifiedJson: minifiedEntry[] = [];

for (const word of json.words) {
  const senses: minifiedSense[] = word.sense.map((sense) => {
    return {
      appliesToKanji: sense.appliesToKanji,
      translation: sense.gloss.reduce((prev, next) => {
        next.text = prev.text + "; " + next.text;
        return next;
      }).text
    } as minifiedSense;
  });

  minifiedJson.push({
    id: word.id,
    kanji: word.kanji.filter((kanji) => {
      return kanji.common;
    }),
    kana: word.kana.filter((kana) => {
      return kana.common;
    }),
    sense: senses,
  } as minifiedEntry);
}

Deno.writeTextFileSync(outputPath, JSON.stringify(minifiedJson));

interface minifiedEntry {
  id: string;
  kanji: Kanji[];
  kana: Kana[];
  sense: minifiedSense[];
}

interface minifiedSense {
  appliesToKanji: string[];
  translation: string;
}

interface Jmdict {
  version: string;
  dictDate: string;
  dictRevisions: string[];
  tags: Record<string, unknown>;
  words: Word[];
}

interface Word {
  id: string;
  kanji: Kanji[];
  kana: Kana[];
  sense: Sense[];
}

interface Kanji {
  common: boolean;
  text: string;
  tags: string[];
}

interface Kana {
  common: boolean;
  text: string;
  tags: string[];
  appliesToKanji: string[];
}

interface Sense {
  partOfSpeech: string[];
  appliesToKanji: string[];
  appliesToKana: string[];
  related: string[];
  antonym: string[];
  field: string[];
  dialect: string[];
  misc: string[];
  info: string[];
  languageSource: LanguageSource;
  gloss: Gloss[];
}

interface LanguageSource {
  lang: string;
  full: boolean;
  wasei: boolean;
  text?: string;
}

interface Gloss {
  type?: string;
  lang: string;
  text: string;
}
