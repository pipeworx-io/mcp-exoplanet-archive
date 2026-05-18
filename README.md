# mcp-exoplanet-archive

NASA Exoplanet Archive — ~5600 confirmed exoplanets + candidates

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `tap` | ADQL TAP query. |
| `planets` | Quick planet search against the `ps` (planetary systems) table. |
| `composite` | Composite planet parameter table `pscomppars`. |
| `kepler_candidates` | Kepler Object of Interest (KOI) candidate table. |
| `microlensing` | Microlensing event table. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "exoplanet-archive": {
      "url": "https://gateway.pipeworx.io/exoplanet-archive/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Exoplanet Archive data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
