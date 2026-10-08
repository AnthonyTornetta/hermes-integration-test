type Run = { id: string | null; kind: string; at: string; middleware: string | null };
const globals = globalThis as typeof globalThis & { cronState?: { started: string; runs: Run[] } };
export const state = globals.cronState ??= { started: new Date().toISOString(), runs: [] };
