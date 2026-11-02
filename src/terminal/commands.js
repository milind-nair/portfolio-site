import {
  seg, line, blank, errorLine, wrapLines, WIDTH,
  renderAbout, renderSkills, renderContact, renderProject,
  resolvePath, getNode, listDir, readFile,
} from './filesystem';

const GITHUB_USER_URL = 'https://api.github.com/users/milind-nair';
const GITHUB_REPOS_URL = 'https://api.github.com/users/milind-nair/repos?sort=updated&per_page=1';

export function levenshtein(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

const flags = (args) => args.filter((a) => a.length > 1 && a.startsWith('-'));
const positional = (args) => args.filter((a) => !(a.length > 1 && a.startsWith('-')));
const link = (text, href) => seg(text, 'accent', { href });
const heading = (text) => line(seg(text, 'path', { bold: true }));

function findProject(data, key) {
  const k = String(key || '').toLowerCase();
  return data.projects.find((p) => p.slug === k || p.title.toLowerCase() === k);
}
function findBlog(data, key) {
  const k = String(key || '').toLowerCase();
  return data.blogs.find((b) => b.slug === k);
}

function lsRow(entry, long) {
  const isDir = entry.type === 'dir';
  const name = seg(isDir ? `${entry.name}/` : entry.name, isDir ? 'dir' : undefined);
  return long
    ? line(seg(isDir ? 'drwxr-xr-x  ' : '-rw-r--r--  ', 'muted'), name)
    : name;
}

function treeLines(fs, path, prefix = '') {
  const entries = listDir(fs, path) || [];
  return entries.flatMap((e, i) => {
    const last = i === entries.length - 1;
    const isDir = e.type === 'dir';
    const row = line(
      seg(`${prefix}${last ? '└── ' : '├── '}`, 'muted'),
      seg(isDir ? `${e.name}/` : e.name, isDir ? 'dir' : undefined),
    );
    return isDir
      ? [row, ...treeLines(fs, `${path === '~' ? '~' : path}/${e.name}`, `${prefix}${last ? '    ' : '│   '}`)]
      : [row];
  });
}

function neofetchLines(data) {
  const { about, projects } = data;
  const years = about.experiences
    .flatMap((e) => (e.duration.match(/\d{4}/g) || []).map(Number));
  const since = years.length ? Math.min(...years) : new Date().getFullYear();
  const up = Math.max(0, new Date().getFullYear() - since);
  const logo = [
    '  __  __ _   _  ',
    ' |  \\/  | \\ | | ',
    ' | |\\/| |  \\| | ',
    ' | |  | | |\\  | ',
    ' |_|  |_|_| \\_| ',
    '                ',
  ];
  const info = [
    [seg('milind', 'path', { bold: true }), seg('@', 'muted'), seg('portfolio', 'path', { bold: true })],
    [seg('-----------------', 'muted')],
    [seg('Name:     ', 'accent'), seg(about.name)],
    [seg('Role:     ', 'accent'), seg(about.role.split('|')[0].trim())],
    [seg('Location: ', 'accent'), seg(about.location)],
    [seg('Skills:   ', 'accent'), seg(String(about.skills.length))],
    [seg('Projects: ', 'accent'), seg(String(projects.length))],
    [seg('Uptime:   ', 'accent'), seg(`${up} year${up === 1 ? '' : 's'} (since ${since})`)],
  ];
  return info.map((segs, i) => line(seg(logo[i] || ' '.repeat(16), 'accent'), ...segs));
}

const notFound = (cmd, p, msg = 'No such file or directory') => errorLine(`${cmd}: ${p}: ${msg}`);

export const commands = [
  // ---- content ----
  {
    name: 'help', group: 'content', usage: 'help [cmd]', description: 'List commands, or show usage for one',
    run(args, ctx) {
      if (args[0]) {
        const c = findCommand(args[0]);
        if (!c) return { output: [errorLine(`help: no such command: ${args[0]}`)] };
        return {
          output: [
            line(seg(c.usage, 'accent', { bold: true })),
            line(c.description),
            ...(c.aliases && c.aliases.length ? [line(seg(`aliases: ${c.aliases.join(', ')}`, 'muted'))] : []),
          ],
        };
      }
      const groups = [['content', 'Content'], ['site', 'Site control'], ['fs', 'Filesystem'], ['fun', 'Fun']];
      const out = [];
      groups.forEach(([key, label]) => {
        out.push(heading(label));
        commands.filter((c) => c.group === key).forEach((c) => {
          out.push(line('  ', seg(c.usage.padEnd(24), 'accent'), seg(c.description, 'muted')));
        });
        out.push(blank());
      });
      out.push(line(seg("Type 'help <cmd>' for details. Tab completes.", 'muted')));
      return { output: out };
    },
  },
  {
    name: 'whoami', group: 'content', usage: 'whoami', description: 'Who am I',
    run(args, { data }) {
      return {
        output: [
          line(seg(data.about.name, 'accent', { bold: true })),
          line(seg(data.about.role, 'path')),
          ...wrapLines(data.about.description),
        ],
      };
    },
  },
  { name: 'about', group: 'content', usage: 'about', description: 'Bio and location', run: (a, { data }) => ({ output: renderAbout(data) }) },
  { name: 'skills', group: 'content', usage: 'skills', description: 'Skills list', run: (a, { data }) => ({ output: renderSkills(data) }) },
  {
    name: 'experience', group: 'content', usage: 'experience', description: 'Work timeline',
    run(args, { data }) {
      return {
        output: data.about.experiences.flatMap((e) => [
          line(seg(e.duration.padEnd(22), 'muted'), seg(e.role, 'accent', { bold: true })),
          line(' '.repeat(22), seg(e.company, 'path')),
          ...wrapLines(e.description, WIDTH - 22).map((l) => line(' '.repeat(22), ...l.segments)),
          blank(),
        ]),
      };
    },
  },
  {
    name: 'projects', group: 'content', usage: 'projects [--pinned]', description: 'List projects',
    run(args, { data }) {
      const list = flags(args).includes('--pinned') ? data.projects.filter((p) => p.pinned) : data.projects;
      return {
        output: [
          ...list.flatMap((p) => [
            line(seg(p.slug, 'accent', { bold: true }), ...(p.pinned ? [seg('  *pinned', 'success')] : [])),
            line('  ', seg(p.tags.join(' | '), 'muted')),
          ]),
          blank(),
          line(seg("Use 'project <name|slug>' for details.", 'muted')),
        ],
      };
    },
  },
  {
    name: 'project', group: 'content', usage: 'project <name|slug>', description: 'Project details',
    run(args, { data }) {
      if (!args.length) return { output: [errorLine('usage: project <name|slug>')] };
      const p = findProject(data, args.join(' ')) || findProject(data, args[0]);
      if (!p) return { output: [errorLine(`project: ${args.join(' ')}: no such project`)] };
      return { output: renderProject(p) };
    },
  },
  {
    name: 'blogs', group: 'content', usage: 'blogs [n]', description: 'Recent blog posts',
    run(args, { data }) {
      const n = parseInt(args[0], 10);
      const list = Number.isFinite(n) && n > 0 ? data.blogs.slice(0, n) : data.blogs.slice(0, 5);
      return {
        output: list.flatMap((b) => [
          line(seg(b.title, 'accent', { bold: true, href: b.path })),
          line('  ', seg(`${b.dateLabel || ''}${b.readTime ? ` | ${b.readTime}` : ''}`, 'muted')),
          line('  ', seg(b.slug, 'dir')),
        ]),
      };
    },
  },
  { name: 'contact', aliases: ['socials'], group: 'content', usage: 'contact', description: 'Email and social links', run: (a, { data }) => ({ output: renderContact(data) }) },
  {
    name: 'resume', group: 'content', usage: 'resume', description: 'Open the resume PDF',
    run(args, { data }) {
      return {
        output: [line(seg('Opening resume: ', 'muted'), link(data.resumeUrl, data.resumeUrl))],
        effects: [{ type: 'open', url: data.resumeUrl }],
      };
    },
  },
  {
    name: 'github', group: 'content', usage: 'github', description: 'Live GitHub stats',
    async run(args, { data }) {
      const profile = data.about.social.github;
      try {
        const [userRes, reposRes] = await Promise.all([fetch(GITHUB_USER_URL), fetch(GITHUB_REPOS_URL)]);
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
        const user = await userRes.json();
        const repos = await reposRes.json();
        const latest = repos && repos[0];
        const out = [
          line(seg('Public repos: ', 'muted'), seg(String(user.public_repos), 'success')),
          line(seg('Followers:    ', 'muted'), seg(String(user.followers), 'success')),
        ];
        if (latest) {
          const when = latest.pushed_at ? new Date(latest.pushed_at).toLocaleDateString() : 'unknown';
          out.push(line(seg('Latest push:  ', 'muted'), link(latest.name, latest.html_url), seg(` (${when})`, 'muted')));
        }
        out.push(line(seg('Profile:      ', 'muted'), link(profile, profile)));
        return { output: out };
      } catch (e) {
        return {
          output: [
            errorLine("github: couldn't reach the GitHub API right now."),
            line(seg('Visit the profile instead: ', 'muted'), link(profile, profile)),
          ],
        };
      }
    },
  },

  // ---- site control ----
  {
    name: 'goto', group: 'site', usage: 'goto <hero|about|projects|blogs|contact>', description: 'Scroll to a section',
    run(args, { data }) {
      const target = args[0];
      if (!data.sections.includes(target)) {
        return { output: [errorLine(`goto: unknown section: ${target || ''}. Try: ${data.sections.join(', ')}`)] };
      }
      return { output: [line(seg(`Scrolling to ${target}...`, 'muted'))], effects: [{ type: 'scroll', target }, { type: 'close' }] };
    },
  },
  {
    name: 'open', group: 'site', usage: 'open <slug|github|linkedin|medium|resume>', description: 'Open a project, blog or link in a new tab',
    run(args, { data }) {
      const key = (args[0] || '').toLowerCase();
      if (!key) return { output: [errorLine('usage: open <project-slug|blog-slug|github|linkedin|medium|resume>')] };
      const social = data.about.social;
      let url = null;
      if (key === 'resume') url = data.resumeUrl;
      else if (social[key]) url = social[key];
      else {
        const p = findProject(data, key);
        const b = findBlog(data, key);
        if (p) url = p.codeUrl || p.demoUrl;
        else if (b) url = b.path;
      }
      if (!url) return { output: [errorLine(`open: ${args[0]}: nothing to open`)] };
      return { output: [line(seg('Opening ', 'muted'), link(url, url))], effects: [{ type: 'open', url }] };
    },
  },
  {
    name: 'theme', group: 'site', usage: 'theme [dark|light|toggle]', description: 'Switch color theme',
    run(args) {
      const value = args[0] || 'toggle';
      if (!['dark', 'light', 'toggle'].includes(value)) return { output: [errorLine('usage: theme [dark|light|toggle]')] };
      return { output: [line(seg(`theme: ${value}`, 'success'))], effects: [{ type: 'theme', value }] };
    },
  },
  {
    name: 'mode', group: 'site', usage: 'mode [dev|recruiter|toggle]', description: 'Switch site mode',
    run(args) {
      const value = args[0] || 'toggle';
      if (!['dev', 'recruiter', 'toggle'].includes(value)) return { output: [errorLine('usage: mode [dev|recruiter|toggle]')] };
      return { output: [line(seg(`mode: ${value}`, 'success'))], effects: [{ type: 'mode', value }] };
    },
  },
  { name: 'clear', group: 'site', usage: 'clear', description: 'Clear the screen', run: () => ({ output: [], effects: [{ type: 'clear' }] }) },
  {
    name: 'exit', group: 'site', usage: 'exit', description: 'Close the terminal',
    run: () => ({
      output: [line(seg('Closing terminal.', 'muted'))],
      effects: [{ type: 'close' }],
    }),
  },

  // ---- filesystem ----
  {
    name: 'ls', group: 'fs', usage: 'ls [-l] [path]', description: 'List directory',
    run(args, { session, fs }) {
      const long = flags(args).some((f) => f.includes('l'));
      const paths = positional(args);
      const out = [];
      (paths.length ? paths : [undefined]).forEach((arg, idx) => {
        const abs = resolvePath(session.cwd, arg === undefined ? '.' : arg);
        const node = getNode(fs, abs);
        if (!node) {
          out.push(errorLine(`ls: cannot access '${arg}': No such file or directory`));
          return;
        }
        if (paths.length > 1) {
          if (idx) out.push(blank());
          out.push(line(seg(`${arg}:`, 'muted')));
        }
        if (node.type === 'file') {
          const row = lsRow({ name: abs.split('/').pop(), type: 'file' }, long);
          out.push(long ? row : line(row));
          return;
        }
        const entries = listDir(fs, abs);
        if (long) {
          entries.forEach((e) => out.push(lsRow(e, true)));
        } else {
          let cur = [];
          let len = 0;
          entries.forEach((e) => {
            const w = e.name.length + 3;
            if (cur.length && len + w > WIDTH) {
              out.push(line(...cur));
              cur = [];
              len = 0;
            }
            if (cur.length) cur.push('  ');
            cur.push(lsRow(e, false));
            len += w;
          });
          if (cur.length) out.push(line(...cur));
        }
      });
      return { output: out };
    },
  },
  {
    name: 'cd', group: 'fs', usage: 'cd [path]', description: 'Change directory',
    run(args, { session, fs }) {
      const arg = args[0];
      const abs = resolvePath(session.cwd, arg);
      const node = getNode(fs, abs);
      if (!node) return { output: [notFound('cd', arg)] };
      if (node.type !== 'dir') return { output: [errorLine(`cd: ${arg}: Not a directory`)] };
      return { output: [], cwd: abs };
    },
  },
  { name: 'pwd', group: 'fs', usage: 'pwd', description: 'Print working directory', run: (a, { session }) => ({ output: [line(session.cwd === '~' ? '/home/milind' : session.cwd.replace(/^~/, '/home/milind'))] }) },
  {
    name: 'cat', group: 'fs', usage: 'cat <file>', description: 'Print a file',
    run(args, { session, fs }) {
      if (!args.length) return { output: [errorLine('cat: missing file operand')] };
      const out = [];
      args.forEach((arg) => {
        const abs = resolvePath(session.cwd, arg);
        const node = getNode(fs, abs);
        if (!node) out.push(notFound('cat', arg));
        else if (node.type === 'dir') out.push(errorLine(`cat: ${arg}: Is a directory`));
        else out.push(...readFile(fs, abs));
      });
      return { output: out };
    },
  },
  {
    name: 'tree', group: 'fs', usage: 'tree [path]', description: 'Show directory tree',
    run(args, { session, fs }) {
      const arg = args[0];
      const abs = resolvePath(session.cwd, arg === undefined ? '.' : arg);
      const node = getNode(fs, abs);
      if (!node) return { output: [errorLine(`tree: ${arg}: No such file or directory`)] };
      if (node.type !== 'dir') return { output: [line(abs.split('/').pop())] };
      return { output: [line(seg(arg || '.', 'dir')), ...treeLines(fs, abs)] };
    },
  },

  // ---- fun ----
  { name: 'neofetch', group: 'fun', usage: 'neofetch', description: 'System info, portfolio edition', run: (a, { data }) => ({ output: neofetchLines(data) }) },
  {
    name: 'sudo', group: 'fun', usage: 'sudo hire-me', description: 'Try it',
    run(args, { data }) {
      if (args[0] !== 'hire-me') {
        return { output: [errorLine(args.length ? 'Nice try. You are not in the sudoers file. This incident will be reported.' : 'usage: sudo <command>')] };
      }
      const subject = encodeURIComponent(`Let's talk, ${data.about.name}`);
      const url = `mailto:${data.about.email}?subject=${subject}`;
      return {
        output: [
          { ...line(seg('[sudo] password for recruiter: ', 'muted')), delayMs: 0 },
          { ...line(seg('******', 'muted')), delayMs: 600 },
          { ...line(seg('Verifying credentials...', 'muted')), delayMs: 600 },
          { ...line(seg('access granted', 'success', { bold: true })), delayMs: 600 },
          { ...line(seg('Composing email to ', 'muted'), link(data.about.email, url)), delayMs: 500 },
        ],
        effects: [{ type: 'open', url }],
      };
    },
  },
  {
    name: 'history', group: 'fun', usage: 'history', description: 'Command history',
    run: (a, { session }) => ({ output: session.history.map((h, i) => line(seg(String(i + 1).padStart(4), 'muted'), `  ${h}`)) }),
  },
  { name: 'echo', group: 'fun', usage: 'echo <text>', description: 'Print text', run: (args) => ({ output: [line(args.join(' '))] }) },
  { name: 'date', group: 'fun', usage: 'date', description: 'Current date', run: () => ({ output: [line(new Date().toString())] }) },
  {
    name: 'fortune', group: 'fun', usage: 'fortune', description: 'A random blog snippet',
    run(args, { data }) {
      const b = data.blogs[Math.floor(Math.random() * data.blogs.length)];
      if (!b) return { output: [line('Fortune not found.')] };
      return { output: [...wrapLines(`"${b.description}"`), line(seg(`  - ${b.title}`, 'muted'))] };
    },
  },
  {
    name: 'rm', group: 'fun', usage: 'rm <path>', description: 'Please do not',
    run(args) {
      const recursive = flags(args).some((f) => /r|f/.test(f));
      return {
        output: [errorLine(recursive
          ? "rm: nice try. This filesystem is read-only, and so is my sense of humor about it."
          : 'rm: cannot remove: read-only file system')],
      };
    },
  },
];

export function findCommand(name) {
  return commands.find((c) => c.name === name || (c.aliases && c.aliases.includes(name)));
}

export function commandNames() {
  return commands.flatMap((c) => [c.name, ...(c.aliases || [])]);
}
