# JishoScripts

LICENSE does not apply to jmdict-eng-common and jmdict-min .json files. Read below.

Get translation and other info from Jisho. Uses deno.

The finished product is `rtkExamples.txt`, and the deck with the styles like mine is `RTK.apkg`

Some of the scripts are actually js and don't work as ts.
`mod.ts` reads other exported rtk deck, and calls jisho api to get common words that contain that kanji. Caps at 13 additional words.
For some reason, jisho api responds with some duplicates, so `cleanJSON` walks the kanjis dir and removes the duplicates.
Lastly, `makeCSV` reads kanjis dir and makes one tsv (tabs, yeah) file. Fills with some empty tabs so anki doesn't argue.

jmdict-eng-common is a converted to json jmdict dictionary from [this repository](https://github.com/scriptin/jmdict-simplified). This package uses the [JMdict/EDICT](http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project) dictionary files. These files are the property of the [Electronic Dictionary Research and Development Group](http://www.edrdg.org/), and are used in conformance with the Group's [licence](http://www.edrdg.org/edrdg/licence.html). 
`jmdictLoader.ts` uses that file to simplify it into jmdict-min.json. jmdict-min.json is licensed under [Electronic Dictionary Research and Development Group's](http://www.edrdg.org/) [licence](http://www.edrdg.org/edrdg/licence.html)

print_json is basically
[catj deno example](https://deno.land/std@0.95.0/examples/catj.ts).
