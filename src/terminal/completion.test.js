import { complete } from './completion';
import { createSession } from './engine';
import { buildData } from './data';

const data = buildData({});
const s = createSession();

describe('complete', () => {
  test('unique command gets trailing space', () => {
    expect(complete('neo', s, data)).toEqual({ value: 'neofetch ', candidates: [] });
  });
  test('ambiguous command applies common prefix and lists candidates', () => {
    const r = complete('p', s, data);
    expect(r.candidates).toEqual(expect.arrayContaining(['pwd', 'projects', 'project']));
    expect(r.value).toBe('p');
    const r2 = complete('proj', s, data);
    expect(r2.value).toBe('project');
    expect(r2.candidates.sort()).toEqual(['project', 'projects']);
  });
  test('no match leaves input', () => {
    expect(complete('zzz', s, data)).toEqual({ value: 'zzz', candidates: [] });
  });
  test('alias completes', () => {
    expect(complete('soc', s, data).value).toBe('socials ');
  });
  test('path: unique dir gets trailing slash, file gets space', () => {
    expect(complete('cd pro', s, data)).toEqual({ value: 'cd projects/', candidates: [] });
    expect(complete('cat ab', s, data)).toEqual({ value: 'cat about.txt ', candidates: [] });
  });
  test('cd only offers directories', () => {
    expect(complete('cd ab', s, data)).toEqual({ value: 'cd ab', candidates: [] });
  });
  test('path: nested and relative to cwd', () => {
    expect(complete('cat projects/mock-server-generator/R', s, data).value).toBe('cat projects/mock-server-generator/README.md ');
    expect(complete('cat README', { ...s, cwd: '~/projects/autoskip-intro' }, data).value).toBe('cat README.md ');
    expect(complete('ls ~/bl', s, data).value).toBe('ls ~/blogs/');
  });
  test('path: ambiguous', () => {
    const r = complete('cat s', s, data);
    expect(r.value).toBe('cat skills.txt ');
    const r2 = complete('ls ', s, data);
    expect(r2.candidates).toEqual(expect.arrayContaining(['projects/', 'about.txt']));
    const r3 = complete('cat projects/s', s, data);
    expect(r3.value).toBe('cat projects/spring-cron-expression-translator/');
    const r4 = complete('cat blogs/w', s, data);
    expect(r4.candidates.length).toBeGreaterThan(1);
    expect(r4.value.startsWith('cat blogs/w')).toBe(true);
  });
  test('slugs for project/open/goto', () => {
    expect(complete('project auto', s, data).value).toBe('project autoskip-intro ');
    expect(complete('goto pro', s, data).value).toBe('goto projects ');
    expect(complete('open git', s, data).value).toBe('open github ');
    expect(complete('open the-quick', s, data).value).toBe('open the-quick-call-tax ');
    const amb = complete('goto ', s, data);
    expect(amb.candidates).toEqual(data.sections);
  });
  test('sudo hire-me', () => {
    expect(complete('sudo h', s, data).value).toBe('sudo hire-me ');
  });
});
