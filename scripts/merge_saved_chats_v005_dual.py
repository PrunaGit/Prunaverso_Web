#!/usr/bin/env python3
# merge_saved_chats_v005_dual.py
#
# Merge all .txt and optional .json artifacts from saved_chats_v005 into a
# single mastodonte text file and a lightweight JSON index. Optionally produce
# an HMAC signature for the index using PRUNAVERSO_HMAC_KEY env var or
# .secrets/prunaverso_hmac.key (for integration with your integrity pipeline).
#
# Usage (PowerShell):
#   python .\scripts\merge_saved_chats_v005_dual.py
#
# Outputs (DEST_DIR):
#   - stable_pv_v005.txt          # concatenated narrative + embedded json blocks
#   - stable_pv_v005_index.json   # lightweight index for machine consumption
#   - stable_pv_v005_index.sig    # optional HMAC signature (base64)
#
# This script is safe: it only reads files and writes outputs in DEST_DIR.
# Do a dry-run first by passing --dry-run to avoid writing files.

import os
import io
import json
import re
import sys
import argparse
from datetime import datetime
from collections import Counter
import hashlib
import hmac
import base64

# Configuration: adjust these paths if needed
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SOURCE_DIR = os.path.join(ROOT, 'a_stabledversions', 'saved_chats', 'saved_chats_v005')
DEST_DIR = os.path.join(ROOT, 'a_stabledversions', 'nodo_central_versions')
VERSION = 'v005'
OUTPUT_TXT = os.path.join(DEST_DIR, f'stable_pv_{VERSION}.txt')
OUTPUT_INDEX = os.path.join(DEST_DIR, f'stable_pv_{VERSION}_index.json')
OUTPUT_SIG = os.path.join(DEST_DIR, f'stable_pv_{VERSION}_index.sig')

# Helpers
SENTENCE_SPLIT_RE = re.compile(r'(?<=[.!?])\s+')
WORD_RE = re.compile(r"\b[0-9A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,}\b")


def simple_summary(text, max_sentences=4):
    if not text:
        return ''
    sentences = [s.strip() for s in SENTENCE_SPLIT_RE.split(text) if s.strip()]
    return ' '.join(sentences[:max_sentences])


def extract_entities(text, max_entities=20):
    # Very simple heuristic: capitalized words (not at sentence start) and proper nouns
    candidates = re.findall(r"\b([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ0-9_\-]+)\b", text)
    # Filter short/garbage
    candidates = [c for c in candidates if len(c) > 2]
    # Return unique, preserve order
    seen = set()
    out = []
    for c in candidates:
        if c.lower() in seen:
            continue
        seen.add(c.lower())
        out.append(c)
        if len(out) >= max_entities:
            break
    return out


def extract_themes(text, max_themes=10):
    words = [w.lower() for w in WORD_RE.findall(text)]
    stop = set(['the', 'and', 'que', 'de', 'la', 'el', 'y', 'to', 'of', 'in', 'a', 'is'])
    filtered = [w for w in words if w not in stop and len(w) > 3]
    freq = Counter(filtered)
    most = [w for w, _ in freq.most_common(max_themes)]
    return most


def load_key_from_env_or_file():
    # Prefer env var
    key = os.environ.get('PRUNAVERSO_HMAC_KEY')
    if key:
        return key.strip()
    # Otherwise try .secrets/prunaverso_hmac.key relative to repo root
    alt = os.path.join(ROOT, '.secrets', 'prunaverso_hmac.key')
    if os.path.exists(alt):
        return open(alt, 'r', encoding='utf-8').read().strip()
    return None


def compute_hmac_base64(data_bytes, key_str):
    key = key_str.encode('utf-8')
    dig = hmac.new(key, data_bytes, hashlib.sha256).digest()
    return base64.b64encode(dig).decode('ascii')


def collect_source_files(srcdir):
    # Return list of base filenames (without extension) for .txt files
    items = []
    if not os.path.exists(srcdir):
        raise FileNotFoundError(f'SOURCE_DIR not found: {srcdir}')
    for name in sorted(os.listdir(srcdir)):
        path = os.path.join(srcdir, name)
        if os.path.isfile(path) and name.lower().endswith('.txt'):
            items.append(name)
    return items


def build_index_and_mastodon(source_dir, dest_dir, dry_run=False):
    os.makedirs(dest_dir, exist_ok=True)
    txt_files = collect_source_files(source_dir)
    index = {
        'version': VERSION,
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'source_dir': os.path.relpath(source_dir, ROOT),
        'entries': []
    }

    # Build the mastodonte text in memory then write
    mastodonte_lines = []
    mastodonte_lines.append(f"# Prunaverso stable {VERSION} - generated: {index['generated_at']}")
    mastodonte_lines.append(f"# Source: {index['source_dir']}")
    mastodonte_lines.append('\n')

    for fname in txt_files:
        base = os.path.splitext(fname)[0]
        txt_path = os.path.join(source_dir, fname)
        json_path = os.path.join(source_dir, base + '.json')

        try:
            with open(txt_path, 'r', encoding='utf-8') as f:
                txt = f.read()
        except Exception as e:
            print(f'Warning: failed to read {txt_path}: {e}', file=sys.stderr)
            continue

        lines = txt.count('\n') + 1
        chars = len(txt)
        summary = simple_summary(txt, max_sentences=4)
        entities = extract_entities(txt)
        themes = extract_themes(txt)

        entry = {
            'filename': fname,
            'base': base,
            'source_path': os.path.relpath(txt_path, ROOT),
            'lines': lines,
            'chars': chars,
            'summary': summary,
            'entities': entities,
            'themes': themes
        }

        # If a lightweight .json exists alongside, include its filename in index
        if os.path.exists(json_path):
            entry['json_path'] = os.path.relpath(json_path, ROOT)
            # Optionally, we can read the json skeleton metadata
            try:
                with open(json_path, 'r', encoding='utf-8') as jf:
                    jdata = json.load(jf)
                # Keep only small fields if present
                for field in ('tags', 'author', 'created_at'):
                    if field in jdata:
                        entry[field] = jdata[field]
            except Exception:
                # ignore json parse issues
                pass

        index['entries'].append(entry)

        # Append to mastodonte
        mastodonte_lines.append(f"--- FILE: {fname} ---")
        mastodonte_lines.append(txt)
        if os.path.exists(json_path):
            try:
                with open(json_path, 'r', encoding='utf-8') as jf:
                    jtxt = jf.read()
                mastodonte_lines.append(f"--- EMBEDDED JSON: {base}.json ---")
                mastodonte_lines.append(jtxt)
            except Exception:
                pass
        mastodonte_lines.append('\n')

    # Serialize index
    index_json = json.dumps(index, ensure_ascii=False, indent=2)

    if dry_run:
        print('Dry run: would write:')
        print(' -', OUTPUT_TXT)
        print(' -', OUTPUT_INDEX)
        print(' -', OUTPUT_SIG)
        return index_json, '\n'.join(mastodonte_lines)

    # Write mastodonte
    with open(OUTPUT_TXT, 'w', encoding='utf-8') as outf:
        outf.write('\n'.join(mastodonte_lines))

    # Write index
    with open(OUTPUT_INDEX, 'w', encoding='utf-8') as jf:
        jf.write(index_json)

    # Optionally sign the index
    key = load_key_from_env_or_file()
    if key:
        sig = compute_hmac_base64(index_json.encode('utf-8'), key)
        with open(OUTPUT_SIG, 'w', encoding='utf-8') as sf:
            sf.write(sig)
        print(f'Wrote signature to {OUTPUT_SIG}')
    else:
        print('No HMAC key found (PRUNAVERSO_HMAC_KEY or .secrets/prunaverso_hmac.key). Skipping signature.')

    print(f'Wrote mastodonte to: {OUTPUT_TXT}')
    print(f'Wrote index to: {OUTPUT_INDEX}')
    return index_json, '\n'.join(mastodonte_lines)


def main():
    parser = argparse.ArgumentParser(description='Merge saved chats into stable_pv_v005 (dual output).')
    parser.add_argument('--source', '-s', default=SOURCE_DIR, help='Source directory with saved chats')
    parser.add_argument('--dest', '-d', default=DEST_DIR, help='Destination directory for outputs')
    parser.add_argument('--dry-run', action='store_true', help='Do not write files; print what would be done')
    args = parser.parse_args()

    # Apply overrides from args into module-level names using globals()
    globals()['SOURCE_DIR'] = os.path.abspath(args.source)
    globals()['DEST_DIR'] = os.path.abspath(args.dest)
    globals()['OUTPUT_TXT'] = os.path.join(globals()['DEST_DIR'], f'stable_pv_{VERSION}.txt')
    globals()['OUTPUT_INDEX'] = os.path.join(globals()['DEST_DIR'], f'stable_pv_{VERSION}_index.json')
    globals()['OUTPUT_SIG'] = os.path.join(globals()['DEST_DIR'], f'stable_pv_{VERSION}_index.sig')

    try:
        build_index_and_mastodon(SOURCE_DIR, DEST_DIR, dry_run=args.dry_run)
    except Exception as e:
        print('ERROR:', e, file=sys.stderr)
        sys.exit(3)


if __name__ == '__main__':
    main()
