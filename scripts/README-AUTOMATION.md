Automation scripts for common tasks

Files added:

- `automation_setup.py` - installs `react-router-dom` and runs `npm ci`/`npm install`.
- `start_dev_server.py` - starts the dev server (`npm run dev`).
- `automation_merge_pipeline.py` - runs the merge script (dry-run/execute) and can optionally run the verifier.

Usage examples (PowerShell):

Install router dependency and prepare environment:

```powershell
python .\scripts\automation_setup.py
```

Start dev server:

```powershell
python .\scripts\start_dev_server.py
```

Run merge pipeline dry run:

```powershell
python .\scripts\automation_merge_pipeline.py --dry-run
```

Run merge pipeline, generate artifacts and verify signatures:

```powershell
python .\scripts\automation_merge_pipeline.py --execute --verify
```

Notes:
- These scripts only call the existing node/python scripts in the repo. They do not modify repository files except for outputs created by the merge script (when executed non-dry-run).
- Ensure `python` and `npm` are available in PATH.
