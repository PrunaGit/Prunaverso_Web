#!/usr/bin/env python3
"""
start_dev_server.py

Starts the frontend dev server (Vite) and streams output to console.

Usage:
  python scripts\start_dev_server.py
"""
import subprocess
import sys

def main():
    try:
        subprocess.run(['npm', 'run', 'dev'], check=True)
    except KeyboardInterrupt:
        print('\nDev server stopped')
    except Exception as e:
        print('Error starting dev server:', e)
        sys.exit(1)

if __name__ == '__main__':
    main()
