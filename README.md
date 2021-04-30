# JishoScripts

Get translation and other info from Jisho. Uses deno.

The finished product is `rtkExamples.txt`, and the deck with the styles like mine is `RTK.apkg`

Some of the scripts are actually js and don't work as ts.
`mod.ts` reads other exported rtk deck, and calls jisho api to get common words that contain that kanji. Caps at 13 additional words.
For some reason, jisho api responds with some duplicates, so `cleanJSON` walks the kanjis dir and removes the duplicates.
Lastly, `makeCSV` reads kanjis dir and makes one tsv (tabs, yeah) file. Fills with some empty tabs so anki doesn't argue.

print_json is basically
[catj deno example](https://deno.land/std@0.95.0/examples/catj.ts).
