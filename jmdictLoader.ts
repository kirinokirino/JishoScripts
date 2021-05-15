import { path } from "./deps.ts";

<<<<<<< HEAD
<<<<<<< HEAD
const jmdictPath = path.join(Deno.cwd(), "jmdict-eng-3.1.0.json");
const outputPath = path.join(Deno.cwd(), "jmdict-min-full.json");
const json = JSON.parse(Deno.readTextFileSync(jmdictPath)) as Jmdict;
const minifiedJson: minifiedEntry[] = [];

const onlyCommon = false;
=======
=======
>>>>>>> e0c72ca20f040b033a9423fd13d5d4e83688c6bb
const jmdictPath = path.join(Deno.cwd(), "jmdict-eng-common-3.1.0.json");
const outputPath = path.join(Deno.cwd(), "jmdict-min.json");
const json = JSON.parse(Deno.readTextFileSync(jmdictPath)) as Jmdict;
const minifiedJson: minifiedEntry[] = [];

<<<<<<< HEAD
>>>>>>> e0c72ca20f040b033a9423fd13d5d4e83688c6bb
=======
>>>>>>> e0c72ca20f040b033a9423fd13d5d4e83688c6bb
for (const word of json.words) {
  const senses: minifiedSense[] = word.sense.map((sense) => {
    return {
      appliesToKanji: sense.appliesToKanji,
      translation: sense.gloss.reduce((prev, next) => {
        next.text = prev.text + "; " + next.text;
        return next;
<<<<<<< HEAD
<<<<<<< HEAD
      }).text,
    } as minifiedSense;
  });

  if (onlyCommon) {
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
  } else {
    minifiedJson.push({
      id: word.id,
      kanji: word.kanji,
      kana: word.kana,
      sense: senses,
    } as minifiedEntry);
  }
=======
=======
>>>>>>> e0c72ca20f040b033a9423fd13d5d4e83688c6bb
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
<<<<<<< HEAD
>>>>>>> e0c72ca20f040b033a9423fd13d5d4e83688c6bb
=======
>>>>>>> e0c72ca20f040b033a9423fd13d5d4e83688c6bb
}

Deno.writeTextFileSync(outputPath, JSON.stringify(minifiedJson));

export interface minifiedEntry {
  id: string;
  kanji: Kanji[];
  kana: Kana[];
  sense: minifiedSense[];
}

export interface minifiedSense {
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
