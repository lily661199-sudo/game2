$ErrorActionPreference = 'Stop'
$ImageGenArgs = $args
$projectRoot = Split-Path -Parent $PSScriptRoot
$pythonPath = Join-Path $projectRoot '.imagegen-runtime\Scripts\python.exe'
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
$imageGenScript = Join-Path $codexHome 'skills\.system\imagegen\scripts\image_gen.py'

if (-not (Test-Path -LiteralPath $pythonPath)) {
  throw "ImageGen runtime is missing: $pythonPath"
}
if (-not (Test-Path -LiteralPath $imageGenScript)) {
  throw "ImageGen skill CLI is missing: $imageGenScript"
}
$loadedKeyFromStore = $false
if (-not $env:OPENAI_API_KEY) {
  $secretPath = Join-Path $env:APPDATA 'Codex\secrets\imagegen-api-key.dpapi'
  if (Test-Path -LiteralPath $secretPath) {
    $encryptedKey = (Get-Content -LiteralPath $secretPath -Raw).Trim()
    $secureKey = ConvertTo-SecureString -String $encryptedKey
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
    try {
      $env:OPENAI_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
      $loadedKeyFromStore = $true
    }
    finally {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
  }
}
if ($ImageGenArgs -notcontains '--dry-run' -and $ImageGenArgs -notcontains '--help' -and $ImageGenArgs -notcontains '-h' -and -not $env:OPENAI_API_KEY) {
  throw 'No API key is configured. Run .\tools\set-imagegen-key.ps1 first; key entry is hidden and the key is encrypted for this Windows user.'
}

Push-Location $projectRoot
try {
  & $pythonPath $imageGenScript @ImageGenArgs
  $imageGenExitCode = $LASTEXITCODE
}
finally {
  Pop-Location
  if ($loadedKeyFromStore) {
    Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
  }
}
exit $imageGenExitCode
