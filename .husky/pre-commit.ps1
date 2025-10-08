# Prunaversal pre-commit hook (PowerShell)
# Ejecuta el validador de handshakes antes de permitir el commit.

Param()

Write-Host "Prunaversal pre-commit (PowerShell) — ejecutando validador..."

$script = Join-Path -Path (Split-Path -Parent $PSScriptRoot) -ChildPath "scripts\precommit_validate.cjs"
if (-Not (Test-Path $script)) {
  Write-Error "Validador no encontrado: $script"
  exit 2
}

# Ejecutar Node validator
$node = "node"
& $node $script
$exitCode = $LASTEXITCODE
if ($exitCode -ne 0) {
  Write-Error "PRE-COMMIT VALIDATION FAILED (exit code $exitCode). Revisa los logs en data/logs/validation/."
  exit $exitCode
}

Write-Host "PRE-COMMIT VALIDATION PASSED"
exit 0
