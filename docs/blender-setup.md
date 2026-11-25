# Blender skill setup

**Status:** add-ons installed and enabled; live listeners and post-restart MCP availability still need verification.  
**Blender:** 5.3.0 at `C:\Program Files\Blender Foundation\Blender 5.3\blender.exe`  
**User's requested path:** `C:\blender` does not exist on this machine.

## Installed components

| Component | Version/source | Install state | Connection and privacy |
|---|---|---|---|
| `uv` / `uvx` | 0.13.9, installed with Windows Package Manager | Installed | Used to run the MCP package |
| MCP for Blender | 2.3.1, `ahujasid/mcp-for-blender` community project | Add-on installed in Blender 5.3 and enabled; Codex MCP entry added | Configured with `BLENDER_MCP_SAFE_MODE=1`, `DISABLE_TELEMETRY=true`, and localhost defaults on port 9876 |
| Blender Toolkit | 1.4.4, Dev-GOM marketplace source at commit `eed6aa2` | Add-on built with its `aiohttp` dependency, installed in Blender 5.3 and enabled | Its documented loopback WebSocket port is 9400; start it from Blender's N-panel |
| Three.js exporter skill | Installed Codex skill | Script CLI help inspected | Exports GLB/viewer from a running Blender MCP service |

## Verification so far

- Blender 5.3 reports both add-ons enabled in user preferences.
- Codex reports a `blender` stdio MCP entry with safe mode and telemetry-disable environment variables set.
- Blender Toolkit add-on registers successfully.
- A port check found no listener on 9876 or 9400 yet. The Blender MCP integration was added after the current Codex session started; restart Codex before expecting its tools to load. The Toolkit server requires its **Start Server** control in Blender's N-panel.

## Next activation steps

1. Restart Codex so it reads the new `blender` MCP configuration.
2. In Blender 5.3, open the 3D View sidebar with **N** and select **MCP for Blender**; confirm its server is running on localhost port 9876.
3. In the same sidebar, select **Blender Toolkit** and click **Start Server**; confirm it listens only on localhost port 9400.
4. Re-check both listeners before creating or exporting project assets.

The MCP package can execute Blender Python. Safe mode blocks risky filesystem, process, network, and persistent-code actions while allowing modeling/export. Telemetry is disabled. The Toolkit source labels itself experimental; keep both ports bound to localhost and do not expose them on a network.
