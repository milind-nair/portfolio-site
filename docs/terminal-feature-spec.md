# Terminal Feature Spec

An interactive, in-browser terminal for the portfolio site. Visitors can explore content, navigate the page, and find a few easter eggs by typing commands.

## Decisions

| Area | Decision |
| --- | --- |
| Placement | A global **overlay** (all modes) **and** an embedded terminal that replaces the Hero content in **Dev mode** |
| Commands | Content, site control, a virtual filesystem, and fun/easter eggs |
| Tech | Custom React component, no terminal library |
| Look | Always dark, with accents from the MUI palette, macOS window chrome, JetBrains Mono, and a blinking block cursor |
| Session | One shared session (output, history, cwd) across hero and overlay via `TerminalContext` |
| Hero intro | Auto-types `whoami` plus a hint on load; no focus steal; respects `prefers-reduced-motion` |
| Reach | Hotkey `` ` `` plus a `>_` AppBar button in both modes; on mobile it goes full-screen with tappable command chips |
| Resume | `/Milind_Nair.pdf` |
| Live data | Static (`constants.js` + `/blogs/posts.json`, falling back to `about.blogs`); `github` fetches live stats only when it runs |
| Delivery | Jest tests for the engine, an RTL smoke test, a `terminal-feature` branch, and a PR to `master` |

## Architecture

```
src/terminal/
  engine.js        pure: tokenize(input), run(input, session, data) -> { output, effects, session }
  commands.js      command registry: { name, aliases, usage, description, run(args, ctx) }
  filesystem.js    buildFs(data) -> virtual tree; resolvePath(cwd, path); listDir; readFile
  completion.js    complete(input, session, data) -> { completed, candidates }
  data.js          normalizes constants.js + blog metadata into the shape commands use
  *.test.js        unit tests (Jest via react-scripts test)
src/context/TerminalContext.js
  session state (lines, history, historyIndex, cwd), overlayOpen, run(), effect handlers
src/components/terminal/
  Terminal.jsx         view: window chrome, scrollback, prompt line, hidden-input-backed typing
  TerminalOverlay.jsx  MUI Modal/Dialog wrapper; full-screen on xs; command chips on mobile
  HeroTerminal.jsx     embedded hero variant with the auto-typed intro
```

- **Engine is pure.** Commands never touch the DOM or React. They return output lines plus **effects** (`{ type: 'scroll', target }`, `{ type: 'open', url }`, `{ type: 'theme', value }`, `{ type: 'mode', value }`, `{ type: 'clear' }`, `{ type: 'close' }`). `TerminalContext` interprets the effects. This keeps the engine fully unit-testable.
- **Output lines are structured**, not HTML strings: an array of segments `{ text, color?, href?, bold? }`. Link segments render as real `<a>` elements; external links use `target="_blank" rel="noopener noreferrer"`. No `dangerouslySetInnerHTML`.
- **Async commands** (`github`, `sudo hire-me` animation): `run` can return a promise. Show a pending line, then replace or append the result.
- **Wiring:** `App.js` wraps the tree in `TerminalProvider`, passing the color-mode setter. `ModeContext` must also expose `setMode` (alongside `toggleMode`) so `mode dev|recruiter` can set the mode explicitly.

## Commands

Content:
- `help [cmd]`: grouped command list, or usage for one command
- `whoami`: name, role, one-line description
- `about`: bio paragraphs, location
- `skills`: skills list (wrapped columns)
- `experience`: timeline from `about.experiences`
- `projects [--pinned]`: list with tags; `project <name|slug>`: details (summary, stack, features, links)
- `blogs [n]`: recent posts with links (from posts.json, falling back to `about.blogs`)
- `contact`, `socials`: email (mailto link), GitHub, LinkedIn, Medium
- `resume`: opens `/Milind_Nair.pdf` (use `process.env.PUBLIC_URL`)
- `github`: live public repos, followers, and latest pushed repo from the GitHub API (same endpoints as `Pulse.jsx`); on error, a friendly message that links to the profile

Site control:
- `goto <hero|about|projects|blogs|contact>`: smooth-scrolls to the section id and closes the overlay
- `open <project-slug|blog-slug|github|linkedin|medium|resume>`
- `theme [dark|light|toggle]`, `mode [dev|recruiter|toggle]`
- `clear` (also Ctrl+L), `exit` (closes the overlay; prints a hint in the hero)

Virtual filesystem (read-only, built from data):
```
~/
  about.txt
  skills.txt
  contact.txt
  resume.pdf            -> cat prints a short garbled line plus a link to the PDF
  experience/<company-role-slug>.txt
  projects/<slug>/README.md, links.txt
  blogs/<slug>.md       -> title, date, read time, description, link
```
- `ls [-l] [path]`, `cd [path]` (supports `~`, `..`, `.`, absolute `/`-rooted == `~`), `pwd`, `cat <file>`, `tree [path]`
- Directories are colored; errors mimic bash (`cat: foo: No such file or directory`)
- The prompt shows cwd: `milind@portfolio:~/projects$`

Fun:
- `neofetch`: ASCII logo with a stats block (name, role, location, skill count, project count, "uptime" since first experience)
- `sudo hire-me`: a short "[sudo] password for recruiter: ****** / access granted" sequence, then opens `mailto:` with a prefilled subject. Plain `sudo <anything>`: "nice try"
- `history`, `echo <text>`, `date`, `fortune` (random blog snippet), `exit`
- `rm -rf /` and similar: a playful refusal
- Unknown command: `command not found: foo. Type 'help'.`, plus a "did you mean" suggestion (Levenshtein ≤ 2)

## Interaction

- Up/Down arrows walk history; Tab completes command names, then paths for fs commands and slugs for `project`/`open`/`goto`. Ambiguous Tab prints the candidates.
- Ctrl+L clears; Ctrl+C prints `^C` and abandons the current line.
- Clicking anywhere in the terminal focuses its input.
- Hotkey `` ` `` toggles the overlay, but only when focus is not in an input, textarea, or contenteditable (except the terminal's own input, where `` ` `` closes it only if the line is empty). Esc closes the overlay. Focus returns to the previously focused element on close.
- If the overlay is opened while the hero terminal is in view (Dev mode), focus the hero terminal instead of opening the overlay.
- The overlay sits in the upper portion of the viewport (drops down, around 60vh, max-width about 900px, centered) with a dimmed backdrop. On `xs` it goes full-screen and shows a horizontally scrollable row of chips (`help`, `projects`, `blogs`, `contact`, `sudo hire-me`) that run commands when tapped.
- Scrollback auto-scrolls to the bottom on new output. Cap the scrollback at around 500 lines.
- Accessibility: the scrollback has `role="log"` and `aria-live="polite"`; the input has a label; the overlay is a proper modal (focus trap via MUI).

## Hero terminal (Dev mode only)

- In Dev mode, `Hero.jsx` renders `HeroTerminal` in place of the gradient title/role/description. Keep the "View My Work" button below the terminal. Recruiter mode is unchanged.
- On first mount (once per page load, not per re-render or mode toggle), auto-type `whoami` character by character (about 40ms/char), print the output, then the hint `Type 'help' to explore, or press ` to open me anywhere.` With `prefers-reduced-motion: reduce`, print it instantly.
- Never call `.focus()` on load. Focus only on click/tap.
- Fixed height (about 360px desktop, 300px mobile), with internal scroll.
- It shares the session with the overlay, so its scrollback shows the same lines.

## Visual

- Background `#0d1117`, text `#e6edf3`, muted `#8b949e`. Prompt user/host in the theme's primary blue (`#2a5599` is too dark on this background, so use the dark-palette primary `#90caf9`), path in the dark-palette secondary pink `#f48fb1`, directories `#90caf9`, errors `#ff7b72`, success `#7ee787`.
- Title bar: three dots (red/yellow/green), centered title `milind@portfolio: <cwd>`; the dots close (red) and toggle a maximized size (green) on the overlay.
- Font: `@fontsource/jetbrains-mono` (400, 700), fallback `ui-monospace, SFMono-Regular, Menlo, monospace`. 14px desktop, 13px mobile.
- A blinking block cursor rendered at the caret position; stop the blink under reduced-motion.
- AppBar: a `>_` icon button (MUI `TerminalIcon`) with tooltip "Terminal (`)", placed before the Dark Mode button.

## Testing

- `src/terminal/*.test.js`: tokenizer (quotes, extra spaces), each command group's output/effects, fs path resolution (`..` past root stays at `~`, unknown paths), completion (unique, ambiguous, path completion), history navigation logic, did-you-mean.
- `src/components/terminal/Terminal.test.jsx`: render the provider + overlay, press `` ` ``, type `help` + Enter, and assert the output appears; `goto projects` emits a scroll effect and closes the overlay.
- Mock `fetch`/`axios` for `github` and the blogs metadata.
- `CI=true npm test -- --watchAll=false` and `npm run build:site` must both pass.

## Engine contract (binding for implementation)

All engine modules are pure: no React, no DOM, and no `window` access except `fetch` inside the `github` command.

```js
// src/terminal/data.js
export const fallbackBlogs;                 // about.blogs normalized to the Blog shape
export function normalizeBlogs(json);       // posts.json array -> Blog[] (same mapping as Blogs.jsx)
export function buildData({ about, projects, blogs }); // -> Data
// Blog    = { slug, title, path, dateLabel, readTime, description, external }
// Project = constants project + { slug }   (slug = kebab-case of title)
// Data    = { about, projects: Project[], blogs: Blog[], resumeUrl, sections: ['hero','about','projects','blogs','contact'] }
//   resumeUrl = `${process.env.PUBLIC_URL || ''}/Milind_Nair.pdf`

// src/terminal/engine.js
export function createSession();            // -> { history: [], cwd: '~' }
export function promptFor(cwd);             // -> 'milind@portfolio:~/projects$'
export async function run(input, session, data);
//   -> { output: Line[], effects: Effect[], session }   (new session object; input appended to history if non-empty)
//   run does NOT echo the input line; the UI renders the echo with promptFor(session.cwd before run).
export function navigateHistory(history, index, direction); // direction 'up'|'down'; index null = not browsing
//   -> { index, value }   ('down' past newest -> { index: null, value: '' })

// src/terminal/completion.js
export function complete(input, session, data); // -> { value, candidates }
//   unique match: value = completed input (trailing space after a command / file; trailing '/' after a dir), candidates = []
//   ambiguous: value = longest common prefix applied, candidates = all matches
// src/terminal/filesystem.js: buildFs(data), resolvePath(cwd, path), listDir(fs, path), readFile(fs, path) (internal to engine, but exported for tests)
```

```js
// Line    = { segments: Segment[], delayMs?: number }   delayMs: UI waits this long before showing the line (sudo hire-me animation)
// Segment = { text: string, color?: 'muted'|'accent'|'path'|'dir'|'error'|'success', href?: string, bold?: boolean }
// Effect  = { type: 'scroll', target: sectionId }
//         | { type: 'open', url }                      // new tab; mailto: also via open
//         | { type: 'theme', value: 'dark'|'light'|'toggle' }
//         | { type: 'mode',  value: 'dev'|'recruiter'|'toggle' }
//         | { type: 'clear' }
//         | { type: 'close' }                          // close the overlay (goto emits scroll + close)
```
