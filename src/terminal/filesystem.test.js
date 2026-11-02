import { buildData } from './data';
import { buildFs, resolvePath, listDir, readFile } from './filesystem';

const data = buildData({});
const fs = buildFs(data);

describe('resolvePath', () => {
  test.each([
    ['~', undefined, '~'],
    ['~', 'projects', '~/projects'],
    ['~/projects', '..', '~'],
    ['~', '..', '~'],
    ['~', '../../..', '~'],
    ['~/projects', '.', '~/projects'],
    ['~/projects', '/', '~'],
    ['~/projects', '/blogs', '~/blogs'],
    ['~/projects', '~/blogs', '~/blogs'],
    ['~', 'projects//mock-server-generator/', '~/projects/mock-server-generator'],
    ['~/a', 'b/../c', '~/a/c'],
  ])('%s + %s -> %s', (cwd, p, expected) => {
    expect(resolvePath(cwd, p)).toBe(expected);
  });
});

describe('fs', () => {
  test('root listing', () => {
    const names = listDir(fs, '~').map((e) => e.name);
    expect(names).toEqual(expect.arrayContaining(['about.txt', 'skills.txt', 'contact.txt', 'resume.pdf', 'experience', 'projects', 'blogs']));
  });
  test('dirs sort first', () => {
    expect(listDir(fs, '~')[0].type).toBe('dir');
  });
  test('projects have README and links', () => {
    expect(listDir(fs, '~/projects/mock-server-generator').map((e) => e.name)).toEqual(['links.txt', 'README.md']);
  });
  test('blogs are slug.md', () => {
    expect(listDir(fs, '~/blogs').map((e) => e.name)).toContain('the-quick-call-tax.md');
  });
  test('experience files exist', () => {
    expect(listDir(fs, '~/experience')).toHaveLength(data.about.experiences.length);
  });
  test('unknown and wrong-type paths', () => {
    expect(listDir(fs, '~/nope')).toBeNull();
    expect(listDir(fs, '~/about.txt')).toBeNull();
    expect(readFile(fs, '~/projects')).toBeNull();
    expect(readFile(fs, '~/nope.txt')).toBeNull();
  });
  test('readFile resume has link', () => {
    const lines = readFile(fs, '~/resume.pdf');
    expect(lines.some((l) => l.segments.some((s) => s.href === data.resumeUrl))).toBe(true);
  });
  test('no prototype leakage', () => {
    expect(listDir(fs, '~/constructor')).toBeNull();
  });
});
