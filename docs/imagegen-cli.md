# ImageGen CLI setup

**State:** local CLI dependencies installed; API key encrypted for this Windows user; API returned HTTP 429 due to zero credits; no ImageGen asset was generated. The project owner chose not to add credits.  
**Skill:** `C:\Users\user\.codex\skills\.system\imagegen\scripts\image_gen.py`  
**Runtime:** isolated Python 3.12 virtual environment at `.imagegen-runtime/` (ignored by Git).  
**SDK:** OpenAI Python package installed in that environment.

## Set up the key once

Create a key in your OpenAI API project at [API Keys](https://platform.openai.com/api-keys). The project settings contain **API Keys → Create new secret key**. Copy the key when it is shown; OpenAI does not show the full secret again. API usage is billed separately from a ChatGPT subscription, so check your API billing and set a project spend limit before generating images.

In PowerShell, from the project directory, run:

```powershell
.\tools\set-imagegen-key.ps1
```

Paste the key into the hidden prompt. The helper uses Windows PowerShell secure-string encryption for the current Windows account and saves the encrypted value under `%APPDATA%\Codex\secrets`; it does not place the key in the repository, PowerShell history, or chat. The CLI decrypts it in memory when invoked and clears the process environment afterward. The encrypted key can only be decrypted by the same Windows user on this machine. If you need to replace it, first remove `imagegen-api-key.dpapi` from that secrets folder, then run the setup script again.

## Generate images

From PowerShell in the project directory:

```powershell
.\tools\imagegen.ps1 --help
```

Images are generated into `output/imagegen/`. The wrapper runs the bundled skill CLI from the project root.

The bundled fallback CLI defaults to `gpt-image-2`, medium quality, PNG. After saving the encrypted key once, the wrapper reads it when you or Codex invokes ImageGen; no session variable needs to be entered again. API access may require organization verification. See [OpenAI image-generation documentation](https://developers.openai.com/api/docs/guides/image-generation).
