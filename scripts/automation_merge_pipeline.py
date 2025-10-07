#!/usr/bin/env python3
"""
automation_merge_pipeline.py

Automatiza la ejecución del script de merge (dry-run o real) y opcionalmente
ejecuta el verificador para comprobar firmas.

Uso:
  python scripts\automation_merge_pipeline.py --dry-run
  python scripts\automation_merge_pipeline.py --execute --sign

Opciones:
  --dry-run   : no escribe archivos
  --execute   : genera los archivos en destino
  --sign      : intenta firmar el índice (necesita PRUNAVERSO_HMAC_KEY en env o archivo .secrets)
  --verify    : ejecuta scripts/verify_monitor.cjs después
"""
import argparse
import subprocess
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def run(cmd, env=None):
    print('>',' '.join(cmd))
    subprocess.run(cmd, check=True, env=env)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--dry-run', action='store_true')
    p.add_argument('--execute', action='store_true')
    p.add_argument('--sign', action='store_true')
    p.add_argument('--verify', action='store_true')
    args = p.parse_args()

    merge_cmd = ['python', os.path.join('scripts', 'merge_saved_chats_v005_dual.py')]
    if args.dry_run:
        merge_cmd.append('--dry-run')

    print('Running merge script...')
    run(merge_cmd)

    if args.execute and args.sign:
        print('\nSigning: ensure PRUNAVERSO_HMAC_KEY is available in env or .secrets/prunaverso_hmac.key')
        # The merge script already signs if key present; no extra action here.

    if args.verify:
        print('\nRunning verifier...')
        env = os.environ.copy()
        run(['node', os.path.join('scripts', 'verify_monitor.cjs')], env=env)

    print('\nPipeline finished.')

if __name__ == '__main__':
    main()
