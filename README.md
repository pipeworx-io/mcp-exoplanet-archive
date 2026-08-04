# @pipeworx/exoplanet-archive

NASA [Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu) MCP — ~5600 confirmed exoplanets + candidates + light curves. Keyless TAP service.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `tap(query, format?)` — ADQL TAP query against the archive (default table: `ps`)
- `planets(query?, limit?)` — quick planet search (defaults to `ps` planet table)
- `composite(query?, limit?)` — query the composite planet parameter table `pscomppars`
- `kepler_candidates(query?, limit?)` — Kepler Object of Interest (KOI) table
- `microlensing(query?, limit?)` — microlensing event table

## Data source

`https://exoplanetarchive.ipac.caltech.edu/TAP/sync`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
