#!/usr/bin/env python3
import os, sys, json, re, hmac, hashlib, base64
from datetime import datetime
from collections import Counter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SOURCE_DIR = os.path.join(ROOT, 'a_stabledversions', 'saved_chats', 'saved_chats_v006')
DEST_DIR = os.path.join(ROOT, 'a_stabledversions', 'nodo_central_versions')
PUBLIC_DIR = os.path.join(ROOT, 'public', 'data', 'nodo_central_versions')
VERSION = 'v006'
OUTPUT_TXT = os.path.join(DEST_DIR, f'stable_pv_{VERSION}.txt')
OUTPUT_INDEX = os.path.join(DEST_DIR, f'stable_pv_{VERSION}_index.json')
OUTPUT_SIG = os.path.join(DEST_DIR, f'stable_pv_{VERSION}_index.sig')

WORD_RE = re.compile(r"\b[0-9A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,}\b")
SENTENCE_SPLIT_RE = re.compile(r'(?<=[.!?])\s+')


def simple_summary(text, max_sentences=4):
    if not text: return ''
    sentences = [s.strip() for s in SENTENCE_SPLIT_RE.split(text) if s.strip()]
    return ' '.join(sentences[:max_sentences])


def extract_entities(text, max_entities=20):
    candidates = re.findall(r"\b([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ0-9_\-]+)\b", text)
    candidates = [c for c in candidates if len(c) > 2]
    seen = set(); out = []
    for c in candidates:
        if c.lower() in seen: continue
        seen.add(c.lower()); out.append(c)
        if len(out) >= max_entities: break
    return out


def extract_themes(text, max_themes=10):
    words = [w.lower() for w in WORD_RE.findall(text)]
    stop = set(['the', 'and', 'que', 'de', 'la', 'el', 'y', 'to', 'of', 'in', 'a', 'is'])
    filtered = [w for w in words if w not in stop and len(w) > 3]
    freq = Counter(filtered)
    return [w for w,_ in freq.most_common(max_themes)]


def load_key():
    key = os.environ.get('PRUNAVERSO_HMAC_KEY')
    if key: return key.strip()
    alt = os.path.join(ROOT, '.secrets', 'prunaverso_hmac.key')
    if os.path.exists(alt):
        return open(alt,'r',encoding='utf-8').read().strip()
    return None


def compute_hmac_base64(data_bytes, key_str):
    key = key_str.encode('utf-8')
    dig = hmac.new(key, data_bytes, hashlib.sha256).digest()
    return base64.b64encode(dig).decode('ascii')


def collect_txt_files(srcdir):
    if not os.path.exists(srcdir):
        raise FileNotFoundError(srcdir)
    files = [f for f in sorted(os.listdir(srcdir)) if os.path.isfile(os.path.join(srcdir,f)) and f.lower().endswith('.txt')]
    return files


def build():
    os.makedirs(DEST_DIR, exist_ok=True)
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    files = collect_txt_files(SOURCE_DIR)
    mast = []
    mast.append(f"# Prunaverso stable {VERSION} - generated: {datetime.utcnow().isoformat()}Z")
    mast.append(f"# Source: {os.path.relpath(SOURCE_DIR, ROOT)}")
    mast.append('\n')
    index = {'version': VERSION, 'generated_at': datetime.utcnow().isoformat() + 'Z', 'source_dir': os.path.relpath(SOURCE_DIR, ROOT), 'entries': []}
    for fname in files:
        path = os.path.join(SOURCE_DIR, fname)
        base = os.path.splitext(fname)[0]
        with open(path, 'r', encoding='utf-8') as f:
            txt = f.read()
        lines = txt.count('\n') + 1
        chars = len(txt)
        entry = {'filename': fname, 'base': base, 'source_path': os.path.relpath(path, ROOT), 'lines': lines, 'chars': chars, 'summary': simple_summary(txt), 'entities': extract_entities(txt), 'themes': extract_themes(txt)}
        # attach json if exists
        jpath = os.path.join(SOURCE_DIR, base + '.json')
        if os.path.exists(jpath):
            entry['json_path'] = os.path.relpath(jpath, ROOT)
            try:
                with open(jpath,'r',encoding='utf-8') as jf:
                    jdata = json.load(jf)
                for field in ('tags','author','created_at'):
                    if field in jdata: entry[field] = jdata[field]
            except Exception:
                pass
        index['entries'].append(entry)
        mast.append(f"--- FILE: {fname} ---")
        mast.append(txt)
        if os.path.exists(jpath):
            try:
                with open(jpath,'r',encoding='utf-8') as jf:
                    mast.append(f"--- EMBEDDED JSON: {base}.json ---")
                    mast.append(jf.read())
            except Exception:
                pass
        mast.append('\n')

    index_json = json.dumps(index, ensure_ascii=False, indent=2)
    mast_text = '\n'.join(mast)
    # write to DEST
    with open(OUTPUT_TXT, 'w', encoding='utf-8') as outf:
        outf.write(mast_text)
    with open(OUTPUT_INDEX, 'w', encoding='utf-8') as jf:
        jf.write(index_json)
    # copy to public dir
    import shutil
    shutil.copy2(OUTPUT_TXT, os.path.join(PUBLIC_DIR, os.path.basename(OUTPUT_TXT)))
    shutil.copy2(OUTPUT_INDEX, os.path.join(PUBLIC_DIR, os.path.basename(OUTPUT_INDEX)))

    key = load_key()
    if key:
        sig = compute_hmac_base64(index_json.encode('utf-8'), key)
        with open(OUTPUT_SIG, 'w', encoding='utf-8') as sf:
            sf.write(sig)
        shutil.copy2(OUTPUT_SIG, os.path.join(PUBLIC_DIR, os.path.basename(OUTPUT_SIG)))
        print('Wrote signature')
    else:
        print('No key found; skipping signature')

    print('Wrote mastodonte and index for', VERSION)

if __name__ == '__main__':
    try:
        build()
    except Exception as e:
        print('ERROR', e)
        sys.exit(2)
