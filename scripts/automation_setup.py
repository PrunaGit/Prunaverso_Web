#!/usr/bin/env python3
"""
automation_setup.py

Instala dependencias frontend necesarias para el Portal (por ejemplo react-router-dom)
y verifica el entorno Node/npm. No modifica código fuente.

Uso:
  python scripts\automation_setup.py
"""
import subprocess
import sys

def run(cmd, check=True):
    print('>',' '.join(cmd) if isinstance(cmd, list) else cmd)
    subprocess.run(cmd, check=check)

def main():
    print('Checking npm availability...')
    try:
        run(['npm', '--version'])
    except Exception as e:
        print('npm not found. Please install Node.js/npm first.')
        sys.exit(2)

    # Install react-router-dom if not present
    print('\nInstalling frontend routing dependency: react-router-dom')
    run(['npm', 'install', 'react-router-dom'])

    print('\nRunning npm ci to ensure consistent deps (if package-lock exists)')
    try:
        run(['npm', 'ci'])
    except Exception:
        print('npm ci failed or not applicable; running npm install instead')
        run(['npm', 'install'])

    print('\nSetup complete. You can now run the dev server with:')
    print('  python scripts\\start_dev_server.py')

if __name__ == '__main__':
    main()
