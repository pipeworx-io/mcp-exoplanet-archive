# @pipeworx/exoplanet-archive

NASA [Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu) MCP — ~6,451 confirmed exoplanets + candidates + light curves. Keyless TAP service.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1856+ live data sources. This is an independent, unofficial integration — not affiliated with, endorsed by, or published by the upstream provider.

## A row-grain trap: `ps` vs `pscomppars`

The archive publishes two planet tables with different row grains, and mixing
them up silently over-counts planets by ~6x:

- **`ps`** (Planetary Systems) — one row per published parameter **solution**.
  A planet re-measured across several papers gets several rows, so
  `COUNT(*) FROM ps` counts solutions, not planets (40,350 rows for 6,451
  confirmed planets, 2026-10-16).
- **`pscomppars`** (Planetary Systems Composite Parameters) — one row per
  confirmed **planet**. This is the right table for "how many confirmed
  exoplanets" and for any per-planet listing.

Use `confirmed_planet_count` or `composite` for planet counts/listings. If you
query `ps` directly (via `planets` or `tap`), filter `default_flag = 1` or
count `DISTINCT pl_name` to get one row per planet; every response from this
pack names its row unit so this can't be missed silently.

## Tools

- `tap(query, format?)` — ADQL TAP query against the archive (default table: `ps`). A raw `COUNT(*) FROM ps` without `default_flag`/`DISTINCT` comes back with a `warning` field, not a bare number.
- `planets(query?, limit?)` — per-solution search against the `ps` table; every response carries a `unit` field naming the row grain
- `composite(query?, limit?)` — query the composite planet parameter table `pscomppars` (one row per confirmed planet)
- `confirmed_planet_count(query?)` — count of confirmed exoplanets from `pscomppars`, with its unit and the date of the live query; optional WHERE-clause filter (e.g. `disc_year = 2023`)
- `kepler_candidates(query?, limit?)` — Kepler Object of Interest (KOI) table (unconfirmed candidates)
- `microlensing(query?, limit?)` — microlensing event table

## Data source

NASA Exoplanet Archive, TAP service.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/exoplanet-archive/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1856+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/exoplanet_archive_tap \
  -H 'Content-Type: application/json' \
  -d '{"query":"SELECT TOP 5 pl_name, sy_dist FROM ps"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/exoplanet_archive_tap`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Run it from npm

`@pipeworx/mcp-exoplanet-archive` is a local stdio bridge to the Pipeworx gateway: your MCP client
starts it with `npx`, and it forwards every call to the same
`https://gateway.pipeworx.io/exoplanet-archive/mcp` endpoint shown above. It needs network access;
there is no offline mode.

```json
{
  "mcpServers": {
    "exoplanet-archive": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-exoplanet-archive"]
    }
  }
}
```

Without a key it calls anonymously, capped at 50 calls a day. A free account
raises that to 200 a day: get a key at https://pipeworx.io/signup and add
`"env": { "PIPEWORX_API_KEY": "<your key>" }` to the server entry.
The key is sent as a Bearer token, the same way a hosted connection sends it,
so calls are metered and billed exactly as they are there.

It lists **only** this pack's tools by default. Set `PIPEWORX_META_TOOLS=1` to
also list `ask_pipeworx` and the other gateway-wide tools.

Behind an HTTPS proxy: Node's built-in `fetch` does not read `HTTPS_PROXY` by
default. Newer Node releases honour it when `NODE_USE_ENV_PROXY=1` is set; check
your Node version's documentation.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Exoplanet Archive data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
