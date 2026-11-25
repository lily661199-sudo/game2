$ErrorActionPreference = 'Stop'

$secretDirectory = Join-Path $env:APPDATA 'Codex\secrets'
$secretPath = Join-Path $secretDirectory 'imagegen-api-key.dpapi'

if (Test-Path -LiteralPath $secretPath) {
  throw "An encrypted ImageGen key already exists at $secretPath. Remove that file first if you intend to replace the key."
}

$secureKey = Read-Host 'Enter your OpenAI API key (input is hidden)' -AsSecureString
if ($secureKey.Length -lt 1) {
  throw 'No key entered; nothing was saved.'
}

New-Item -ItemType Directory -Path $secretDirectory -Force | Out-Null
$encryptedKey = ConvertFrom-SecureString -SecureString $secureKey
Set-Content -LiteralPath $secretPath -Value $encryptedKey -Encoding ASCII -NoNewline
Write-Output 'Encrypted ImageGen key saved for this Windows user. The key was not written to the project.'
