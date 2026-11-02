import { tokenize, createSession, promptFor, run, navigateHistory, suggest } from './engine';
import { buildData } from './data';

const data = buildData({});
const text = (out) => out.map((l) => l.segments.map((s) => s.text).join('')).join('\n');
const exec = async (input, session = createSession()) => {
  const r = await run(input, session, data);
  return { ...r, text: text(r.output) };
};

describe('tokenize', () => {
  test('splits and trims extra spaces', () => {
    expect(tokenize('  ls   -l   projects ')).toEqual(['ls', '-l', 'projects']);
  });
  test('quotes', () => {
    expect(tokenize(`echo "hello   world" 'a b' c`)).toEqual(['echo', 'hello   world', 'a b', 'c']);
    expect(tokenize('echo ""')).toEqual(['echo', '']);
    expect(tokenize('echo "unclosed one')).toEqual(['echo', 'unclosed one']);
  });
});

describe('session and prompt', () => {
  test('createSession / promptFor', () => {
    expect(createSession()).toEqual({ history: [], cwd: '~' });
    expect(promptFor('~/projects')).toBe('milind@portfolio:~/projects$');
  });
  test('run appends history without mutating', async () => {
    const s = createSession();
    const r = await run('whoami', s, data);
    expect(s.history).toEqual([]);
    expect(r.session.history).toEqual(['whoami']);
    expect(r.session).not.toBe(s);
  });
  test('empty input is not recorded', async () => {
    const r = await exec('   ');
    expect(r.session.history).toEqual([]);
    expect(r.output).toEqual([]);
  });
});

describe('navigateHistory', () => {
  const h = ['a', 'b', 'c'];
  test('up walks back and clamps', () => {
    expect(navigateHistory(h, null, 'up')).toEqual({ index: 2, value: 'c' });
    expect(navigateHistory(h, 2, 'up')).toEqual({ index: 1, value: 'b' });
    expect(navigateHistory(h, 0, 'up')).toEqual({ index: 0, value: 'a' });
  });
  test('down walks forward and exits', () => {
    expect(navigateHistory(h, 0, 'down')).toEqual({ index: 1, value: 'b' });
    expect(navigateHistory(h, 2, 'down')).toEqual({ index: null, value: '' });
    expect(navigateHistory(h, null, 'down')).toEqual({ index: null, value: '' });
  });
  test('empty history', () => {
    expect(navigateHistory([], null, 'up')).toEqual({ index: null, value: '' });
  });
});

describe('unknown commands', () => {
  test('did you mean', async () => {
    const r = await exec('projcts');
    expect(r.text).toContain("command not found: projcts. Type 'help'.");
    expect(r.text).toContain("Did you mean 'projects'?");
  });
  test('no suggestion when far', async () => {
    const r = await exec('zzzzzzzz');
    expect(r.text).not.toContain('Did you mean');
    expect(suggest('zzzzzzzz')).toBeNull();
  });
});

describe('content commands', () => {
  test('help lists groups; help cmd shows usage', async () => {
    expect((await exec('help')).text).toMatch(/Content[\s\S]*Site control[\s\S]*Filesystem[\s\S]*Fun/);
    expect((await exec('help projects')).text).toContain('projects [--pinned]');
    expect((await exec('help nope')).text).toContain('no such command');
  });
  test('whoami/about/skills/experience', async () => {
    expect((await exec('whoami')).text).toContain('Milind Nair');
    expect((await exec('about')).text).toContain('Bengaluru');
    expect((await exec('skills')).text).toContain('Kubernetes');
    expect((await exec('experience')).text).toContain('Summer 2023');
  });
  test('projects and --pinned', async () => {
    const all = await exec('projects');
    const pinned = await exec('projects --pinned');
    expect(all.text).toContain('autoskip-intro');
    expect(pinned.text).not.toContain('autoskip-intro');
    expect(pinned.text).toContain('portfolio-site');
  });
  test('project by slug and by quoted name', async () => {
    expect((await exec('project fashion-ai-chatbot')).text).toContain('Llama v2');
    expect((await exec('project "Fashion AI Chatbot"')).text).toContain('Llama v2');
    expect((await exec('project nope')).text).toContain('no such project');
  });
  test('blogs [n]', async () => {
    expect((await exec('blogs 2')).output.filter((l) => l.segments[0].href)).toHaveLength(2);
  });
  test('contact has mailto link; socials alias', async () => {
    const r = await exec('socials');
    expect(r.output.some((l) => l.segments.some((s) => s.href === `mailto:${data.about.email}`))).toBe(true);
  });
  test('resume opens pdf', async () => {
    expect((await exec('resume')).effects).toEqual([{ type: 'open', url: data.resumeUrl }]);
  });
});

describe('github', () => {
  afterEach(() => {
    delete global.fetch;
  });
  test('success', async () => {
    global.fetch = jest.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(
          url.includes('/repos')
            ? [{ name: 'latest-repo', html_url: 'https://github.com/milind-nair/latest-repo', pushed_at: '2025-01-01T00:00:00Z' }]
            : { public_repos: 42, followers: 7 }
        ),
      })
    );
    const r = await exec('github');
    expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/milind-nair');
    expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/milind-nair/repos?sort=updated&per_page=1');
    expect(r.text).toContain('42');
    expect(r.text).toContain('latest-repo');
  });
  test('failure gives error plus profile link', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
    const r = await exec('github');
    expect(r.output[0].segments[0].color).toBe('error');
    expect(r.output.some((l) => l.segments.some((s) => s.href === data.about.social.github))).toBe(true);
  });
  test('non-ok response is a failure', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }));
    const r = await exec('github');
    expect(r.output[0].segments[0].color).toBe('error');
  });
});

describe('site control', () => {
  test('goto emits scroll + close', async () => {
    expect((await exec('goto projects')).effects).toEqual([{ type: 'scroll', target: 'projects' }, { type: 'close' }]);
    expect((await exec('goto nowhere')).effects).toEqual([]);
  });
  test('open', async () => {
    expect((await exec('open github')).effects).toEqual([{ type: 'open', url: data.about.social.github }]);
    expect((await exec('open mock-server-generator')).effects[0].url).toBe(data.projects[0].codeUrl);
    expect((await exec('open the-quick-call-tax')).effects[0].url).toBe(data.blogs[1].path);
    expect((await exec('open nope')).effects).toEqual([]);
  });
  test('theme and mode', async () => {
    expect((await exec('theme')).effects).toEqual([{ type: 'theme', value: 'toggle' }]);
    expect((await exec('theme light')).effects).toEqual([{ type: 'theme', value: 'light' }]);
    expect((await exec('theme purple')).effects).toEqual([]);
    expect((await exec('mode recruiter')).effects).toEqual([{ type: 'mode', value: 'recruiter' }]);
    expect((await exec('mode x')).effects).toEqual([]);
  });
  test('clear and exit', async () => {
    expect((await exec('clear')).effects).toEqual([{ type: 'clear' }]);
    expect((await exec('exit')).effects).toEqual([{ type: 'close' }]);
  });
});

describe('filesystem commands', () => {
  test('cd updates cwd; pwd; relative ls', async () => {
    let r = await exec('cd projects');
    expect(r.session.cwd).toBe('~/projects');
    r = await exec('ls', r.session);
    expect(r.text).toContain('portfolio-site/');
    r = await exec('cd ..', r.session);
    expect(r.session.cwd).toBe('~');
    r = await exec('cd ../../..', r.session);
    expect(r.session.cwd).toBe('~');
  });
  test('cd errors do not change cwd', async () => {
    const r = await exec('cd nope');
    expect(r.session.cwd).toBe('~');
    expect(r.text).toContain('cd: nope: No such file or directory');
    expect((await exec('cd about.txt')).text).toContain('Not a directory');
  });
  test('cat file, missing, directory', async () => {
    expect((await exec('cat about.txt')).text).toContain('Bengaluru');
    expect((await exec('cat foo')).text).toBe('cat: foo: No such file or directory');
    expect((await exec('cat projects')).text).toContain('Is a directory');
    expect((await exec('cat projects/autoskip-intro/links.txt')).text).toContain('github.com/milind-nair/AutoSkip-Intro');
    expect((await exec('cat blogs/the-quick-call-tax.md')).text).toContain('5 min read');
    expect((await exec('cat resume.pdf')).text).toContain('Milind_Nair.pdf');
  });
  test('ls -l and ls missing', async () => {
    expect((await exec('ls -l')).text).toMatch(/drwxr-xr-x\s+projects\//);
    expect((await exec('ls nope')).text).toContain("ls: cannot access 'nope': No such file or directory");
  });
  test('ls on a file returns a Line', async () => {
    const r = await exec('ls about.txt');
    expect(r.output).toHaveLength(1);
    expect(r.text).toBe('about.txt');
  });
  test('ls colors dirs', async () => {
    const r = await exec('ls');
    const dirSeg = r.output[0].segments.find((s) => s.text === 'projects/');
    expect(dirSeg.color).toBe('dir');
  });
  test('tree', async () => {
    const r = await exec('tree projects');
    expect(r.text).toContain('└── ');
    expect(r.text).toContain('README.md');
  });
  test('pwd', async () => {
    const r = await exec('cd blogs');
    expect((await exec('pwd', r.session)).text).toBe('/home/milind/blogs');
  });
});

describe('fun', () => {
  test('sudo hire-me staggered then mailto', async () => {
    const r = await exec('sudo hire-me');
    expect(r.text).toContain('access granted');
    expect(r.output.some((l) => l.delayMs > 0)).toBe(true);
    expect(r.effects).toHaveLength(1);
    expect(r.effects[0].type).toBe('open');
    expect(r.effects[0].url).toMatch(new RegExp(`^mailto:${data.about.email.replace('.', '\\.')}\\?subject=`));
  });
  test('plain sudo', async () => {
    const r = await exec('sudo ls');
    expect(r.text).toContain('Nice try');
    expect(r.effects).toEqual([]);
  });
  test('rm -rf / refusal', async () => {
    const r = await exec('rm -rf /');
    expect(r.text).toContain('nice try');
  });
  test('echo, history, date, fortune, neofetch', async () => {
    expect((await exec('echo "hi   there" x')).text).toBe('hi   there x');
    const s = (await exec('whoami')).session;
    expect((await exec('history', s)).text).toMatch(/1\s+whoami\n\s*2\s+history/);
    expect((await exec('date')).text.length).toBeGreaterThan(10);
    const nf = (await exec('neofetch')).text;
    expect(nf).toContain('Projects: 8');
    expect(nf).toContain('Skills:   14');
    expect(nf).toMatch(/Uptime:\s+\d+ years? \(since 2023\)/);
  });
  test('fortune returns a blog snippet', async () => {
    const r = await exec('fortune');
    expect(data.blogs.some((b) => r.text.includes(b.description.slice(0, 20)))).toBe(true);
  });
  test('output stays within ~70 columns for prose', async () => {
    const r = await exec('about');
    r.text.split('\n').forEach((l) => expect(l.length).toBeLessThanOrEqual(72));
  });
});
