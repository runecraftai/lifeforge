# Hermes LifeForge integration

This directory contains the Personal OS Hermes skill and the `lifeforge-mcp` stdio server.
The server exposes task operations for the official `lifeforge--todo-list` contract and note
search/create operations for the Personal OS notes module.

## Install

From this repository, copy the integration files into the Hermes skill directory:

```sh
mkdir -p ~/.hermes/skills/personal-os
cp integrations/hermes/SKILL.md ~/.hermes/skills/personal-os/
cp integrations/hermes/lifeforge-mcp.ts ~/.hermes/skills/personal-os/
cp integrations/hermes/run-lifeforge-mcp ~/.hermes/skills/personal-os/
chmod +x ~/.hermes/skills/personal-os/run-lifeforge-mcp
```

Ensure the LifeForge checkout is available at `~/.local/share/personal-os/lifeforge`, or set
`LIFEFORGE_ROOT` when invoking the launcher. The launcher reads credentials only from the
private environment file at `~/.config/personal-os/lifeforge.env`; do not commit that file
or its values. It must define `PB_HOST`, `PB_EMAIL`, and `PB_PASSWORD`.

## Hermes registration

Add the stdio server under `mcp_servers` in `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  lifeforge:
    command: ~/.hermes/skills/personal-os/run-lifeforge-mcp
```

Restart Hermes or reload its MCP servers. The server is then available with the `lifeforge`
MCP name. No credentials belong in `config.yaml` or this repository.
