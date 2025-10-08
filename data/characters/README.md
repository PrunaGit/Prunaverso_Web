This folder is the recommended place to store your character JSON files and avatars for the Prunaverso web app.

How to populate:

- Quick copy from your external folder (PowerShell):

  Copy-Item -Path "C:\Users\pruna\Documents\GITHUB\Prunaverso\personajes\*" -Destination "C:\Users\pruna\Documents\GITHUB\Prunaverso_Web\data\characters" -Recurse

- Or use a git submodule if the characters live in a separate repo:

  cd data
  git submodule add <repo-url> characters

Notes:
- Character JSON files must be valid JSON. If you have JS-style comments, remove them or use the server's tolerant parsing option (not enabled by default).
- Place avatar images in data/characters/avatars and reference them using relative paths in the JSON, e.g. "avatars/pruna.png".
