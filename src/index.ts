interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * NASA Exoplanet Archive MCP.
 *
 * Auth: none. Docs: https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html
 */


const TAP = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
const UA = 'pipeworx-mcp-exoplanet-archive/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'tap',
    description: 'ADQL TAP query.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'e.g. "SELECT TOP 5 pl_name, sy_dist FROM ps"' },
        format: { type: 'string', description: 'json (default) | csv | votable' },
      },
      required: ['query'],
    },
  },
  {
    name: 'planets',
    description: 'Quick planet search against the `ps` (planetary systems) table.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional WHERE clause (without "WHERE").' },
        limit: { type: 'number', description: '1-10000 (default 25).' },
      },
    },
  },
  {
    name: 'composite',
    description: 'Composite planet parameter table `pscomppars`.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number' },
      },
    },
  },
  {
    name: 'kepler_candidates',
    description: 'Kepler Object of Interest (KOI) candidate table.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number' },
      },
    },
  },
  {
    name: 'microlensing',
    description: 'Microlensing event table.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'tap':
      return runQuery(reqStr(args, 'query', '"SELECT TOP 5 pl_name FROM ps"'), String(args.format ?? 'json'));
    case 'planets':
      return tableQuery('ps', args);
    case 'composite':
      return tableQuery('pscomppars', args);
    case 'kepler_candidates':
      return tableQuery('koi', args);
    case 'microlensing':
      return tableQuery('ml', args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function tableQuery(table: string, args: Record<string, unknown>): Promise<unknown> {
  const limit = Math.min(10000, Math.max(1, (args.limit as number) ?? 25));
  const where = args.query ? ` WHERE ${args.query}` : '';
  const sql = `SELECT TOP ${limit} * FROM ${table}${where}`;
  return runQuery(sql, 'json');
}

async function runQuery(query: string, format: string): Promise<unknown> {
  const params = new URLSearchParams({
    REQUEST: 'doQuery',
    LANG: 'ADQL',
    FORMAT: format,
    QUERY: query,
  });
  const res = await fetch(`${TAP}?${params}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Exoplanet Archive: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { format, body: text.slice(0, 16000) }; }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
