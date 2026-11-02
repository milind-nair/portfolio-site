import { buildFs, resolvePath, listDir } from './filesystem';
import { commandNames } from './commands';

const FS_CMDS = ['ls', 'cd', 'cat', 'tree'];

function commonPrefix(items) {
  return items.reduce((a, b) => {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
    return a.slice(0, i);
  });
}

// matches: [{ text, suffix }] where text is the completion of the word
function finish(head, word, matches) {
  if (!matches.length) return { value: head + word, candidates: [] };
  if (matches.length === 1) {
    return { value: head + matches[0].text + matches[0].suffix, candidates: [] };
  }
  const lcp = commonPrefix(matches.map((m) => m.text));
  return {
    value: head + lcp,
    candidates: matches.map((m) => m.text.slice(m.text.lastIndexOf('/') + 1) + (m.suffix === '/' ? '/' : '')),
  };
}

const wordMatches = (word, options) =>
  options.filter((o) => o.startsWith(word)).map((o) => ({ text: o, suffix: ' ' }));

export function complete(input, session, data) {
  const idx = input.search(/\S*$/);
  const head = input.slice(0, idx);
  const word = input.slice(idx);
  const prior = head.trim().split(/\s+/).filter(Boolean);

  if (prior.length === 0) {
    return finish(head, word, wordMatches(word, [...new Set(commandNames())].sort()));
  }

  const cmd = prior[0];
  if (word.startsWith('-')) return { value: input, candidates: [] };

  if (FS_CMDS.includes(cmd)) {
    const slash = word.lastIndexOf('/');
    const dirPart = slash >= 0 ? word.slice(0, slash + 1) : '';
    const base = word.slice(slash + 1);
    const entries = listDir(buildFs(data), resolvePath(session.cwd, dirPart || '.')) || [];
    const matches = entries
      .filter((e) => e.name.startsWith(base) && (cmd !== 'cd' || e.type === 'dir'))
      .map((e) => ({ text: dirPart + e.name, suffix: e.type === 'dir' ? '/' : ' ' }));
    return finish(head, word, matches);
  }

  if (prior.length === 1) {
    let options = [];
    if (cmd === 'project') options = data.projects.map((p) => p.slug);
    else if (cmd === 'goto') options = data.sections;
    else if (cmd === 'sudo') options = ['hire-me'];
    else if (cmd === 'open') {
      options = [
        ...data.projects.map((p) => p.slug),
        ...data.blogs.map((b) => b.slug),
        'github', 'linkedin', 'medium', 'resume',
      ];
    }
    return finish(head, word, wordMatches(word, options));
  }

  return { value: input, candidates: [] };
}
