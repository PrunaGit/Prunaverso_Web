# merge_saved_chats_v005_dual.py

This script consolidates all `.txt` (and optional `.json`) files from
`a_stabledversions/saved_chats/saved_chats_v005/` into two outputs in
`a_stabledversions/nodo_central_versions/`:

- `stable_pv_v005.txt` — mastodonte text file with all narratives and embedded JSON blocks.
- `stable_pv_v005_index.json` — lightweight JSON index with metadata, summaries, entities and themes.
- `stable_pv_v005_index.sig` — optional HMAC signature (base64) if `PRUNAVERSO_HMAC_KEY` is set.

Usage (PowerShell):

```powershell
# Dry run (no files written):
python .\scripts\merge_saved_chats_v005_dual.py --dry-run

# Produce outputs (writes to nodo_central_versions):
python .\scripts\merge_saved_chats_v005_dual.py
```

HMAC signature
- The script will look for the HMAC key in the environment variable
  `PRUNAVERSO_HMAC_KEY` or in the file `.secrets/prunaverso_hmac.key` at the
  repository root. If present, it signs the index JSON and writes a `.sig`
  file with the base64 HMAC.

Notes
- The script is non-destructive — it only reads sources and writes outputs
  in `a_stabledversions/nodo_central_versions/`.
- Summaries, entities and themes are generated with simple heuristics; they
  are intended as lightweight indices for mining, not production NLP results.

If you want, I can now:
1. Run the script locally in this environment (only if the source files are present here),
2. Or leave the script and README for you to run on your machine (recommended).
