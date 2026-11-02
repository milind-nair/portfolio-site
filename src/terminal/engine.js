import { buildFs, seg, line, errorLine } from './filesystem';
import { findCommand, commandNames, levenshtein } from './commands';

export function tokenize(input) {
  const tokens = [];
  let cur = '';
  let quote = null;
  let started = false;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      started = true;
    } else if (/\s/.test(ch)) {
      if (cur || started) tokens.push(cur);
      cur = '';
      started = false;
    } else {
      cur += ch;
    }
  }
  if (cur || started) tokens.push(cur);
  return tokens;
}

export function createSession() {
  return { history: [], cwd: '~' };
}

export function promptFor(cwd) {
  return `milind@portfolio:${cwd}$`;
}

export function navigateHistory(history, index, direction) {
  if (direction === 'up') {
    if (!history.length) return { index, value: '' };
    const next = index === null || index === undefined ? history.length - 1 : Math.max(0, index - 1);
    return { index: next, value: history[next] };
  }
  if (index === null || index === undefined || index >= history.length - 1) {
    return { index: null, value: '' };
  }
  return { index: index + 1, value: history[index + 1] };
}

export function suggest(name) {
  let best = null;
  let bestDist = 3;
  commandNames().forEach((n) => {
    const d = levenshtein(name, n);
    if (d < bestDist) {
      best = n;
      bestDist = d;
    }
  });
  return best;
}

export async function run(input, session, data) {
  const text = (input || '').trim();
  if (!text) return { output: [], effects: [], session: { ...session } };

  const next = { ...session, history: [...session.history, text] };
  const [name, ...args] = tokenize(text);
  const cmd = name ? findCommand(name) : null;

  if (!cmd) {
    const out = [errorLine(`command not found: ${name}. Type 'help'.`)];
    const guess = suggest(name || '');
    if (guess) out.push(line(seg(`Did you mean '${guess}'?`, 'muted')));
    return { output: out, effects: [], session: next };
  }

  let result;
  try {
    result = await cmd.run(args, { session: next, data, fs: buildFs(data) });
  } catch (e) {
    result = { output: [errorLine(`${name}: ${e.message || 'unexpected error'}`)] };
  }
  if (result.cwd) next.cwd = result.cwd;
  return { output: result.output || [], effects: result.effects || [], session: next };
}
