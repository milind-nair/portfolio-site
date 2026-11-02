import * as React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useTerminal } from '../../context/TerminalContext';
import { promptFor } from '../../terminal/engine';

const COLORS = {
  muted: '#8b949e',
  accent: '#90caf9',
  path: '#f48fb1',
  dir: '#90caf9',
  error: '#ff7b72',
  success: '#7ee787',
};
const BG = '#0d1117';
const FG = '#e6edf3';

const renderSegment = (seg, i) => {
  const style = {
    color: seg.color ? COLORS[seg.color] : undefined,
    fontWeight: seg.bold ? 700 : undefined,
  };
  if (seg.href) {
    const external = /^https?:/i.test(seg.href);
    return (
      <a
        key={i}
        href={seg.href}
        style={{ ...style, color: style.color || COLORS.accent, textDecoration: 'underline' }}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {seg.text}
      </a>
    );
  }
  return (
    <span key={i} style={style}>
      {seg.text}
    </span>
  );
};

const Prompt = ({ prompt }) => {
  const m = /^([^:]+):(.*)\$$/.exec(prompt || '');
  if (!m) return <span style={{ color: COLORS.accent }}>{prompt} </span>;
  return (
    <span style={{ marginRight: '0.6em', whiteSpace: 'pre' }}>
      <span style={{ color: COLORS.accent }}>{m[1]}</span>
      <span style={{ color: COLORS.muted }}>:</span>
      <span style={{ color: COLORS.path }}>{m[2]}</span>
      <span style={{ color: COLORS.muted }}>$</span>
    </span>
  );
};

const Terminal = ({ variant = 'overlay', onClose, autoFocus, inputRef, maximized, onToggleMaximize, pendingLine }) => {
  const { lines, busy, cwd, submit, appendLines, clear, complete, browseHistory, resetHistoryBrowse } = useTerminal();
  const [value, setValue] = React.useState('');
  const [caret, setCaret] = React.useState(0);
  const localRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const focusedRef = React.useRef(false);
  const ref = inputRef || localRef;
  const overlay = variant === 'overlay';

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, pendingLine]);

  React.useEffect(() => {
    if (!busy && focusedRef.current && ref.current) ref.current.focus();
  }, [busy, ref]);

  const syncCaret = (el) => setCaret(el.selectionStart ?? el.value.length);

  const setLine = (next) => {
    setValue(next);
    setCaret(next.length);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = value;
      setLine('');
      submit(input);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      setLine(browseHistory(e.key === 'ArrowUp' ? 'up' : 'down'));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const res = complete(value);
      setLine(res.value);
      if (res.candidates && res.candidates.length) {
        appendLines([{ kind: 'output', segments: [{ text: res.candidates.join('  '), color: 'muted' }] }]);
      }
    } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      clear();
    } else if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      appendLines([{ kind: 'input', prompt: promptFor(cwd), segments: [{ text: `${value}^C` }] }]);
      resetHistoryBrowse();
      setLine('');
    } else if (e.key === '`' && overlay && value === '' && onClose) {
      e.preventDefault();
      onClose();
    }
  };

  const before = value.slice(0, caret);
  const atChar = value.charAt(caret) || ' ';
  const after = value.slice(caret + 1);

  const dot = (bg, label, handler) => (
    <Box
      component="span"
      role={handler ? 'button' : undefined}
      aria-label={handler ? label : undefined}
      tabIndex={handler ? 0 : undefined}
      onClick={(e) => {
        e.stopPropagation();
        if (handler) handler();
      }}
      onKeyDown={(e) => {
        if (handler && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handler();
        }
      }}
      sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: bg, cursor: handler ? 'pointer' : 'default', display: 'inline-block' }}
    />
  );

  return (
    <Box
      onClick={() => ref.current && ref.current.focus()}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: BG,
        color: FG,
        fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: { xs: 13, sm: 14 },
        borderRadius: overlay ? 0 : 2,
        overflow: 'hidden',
        border: overlay ? 'none' : '1px solid rgba(255,255,255,0.12)',
        textAlign: 'left',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, bgcolor: '#161b22', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {dot('#ff5f56', 'Close terminal', overlay ? onClose : undefined)}
          {dot('#ffbd2e')}
          {dot('#27c93f', 'Toggle maximize', overlay ? onToggleMaximize : undefined)}
        </Box>
        <Box sx={{ flexGrow: 1, textAlign: 'center', color: COLORS.muted, fontSize: '0.85em', mr: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {`milind@portfolio: ${cwd}`}
        </Box>
      </Box>
      <Box
        ref={scrollRef}
        role="log"
        aria-live="polite"
        data-maximized={maximized ? 'true' : undefined}
        sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5, lineHeight: 1.5, cursor: 'text' }}
      >
        {lines.map((l) => (
          <Box key={l.id} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '1.5em' }}>
            {l.kind === 'input' && <Prompt prompt={l.prompt} />}
            {l.segments.map(renderSegment)}
          </Box>
        ))}
        {pendingLine && (
          <Box sx={{ whiteSpace: 'pre-wrap' }}>
            <Prompt prompt={pendingLine.prompt} />
            {pendingLine.text}
          </Box>
        )}
        {!pendingLine && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Prompt prompt={promptFor(cwd)} />
            <Box sx={{ position: 'relative', flexGrow: 1, minWidth: 0 }}>
              <Box component="span" aria-hidden="true" sx={{ whiteSpace: 'pre', display: 'inline-block', minHeight: '1.5em' }}>
                {before}
                <Box
                  component="span"
                  sx={{
                    bgcolor: busy ? 'transparent' : FG,
                    color: BG,
                    '@keyframes termBlink': { '50%': { opacity: 0 } },
                    animation: 'termBlink 1s steps(1) infinite',
                    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                  }}
                >
                  {atChar}
                </Box>
                {after}
              </Box>
              <Box
                component="input"
                ref={ref}
                type="text"
                aria-label="Terminal input"
                autoFocus={autoFocus}
                disabled={busy}
                value={value}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                onChange={(e) => {
                  resetHistoryBrowse();
                  setValue(e.target.value);
                  syncCaret(e.target);
                }}
                onSelect={(e) => syncCaret(e.target)}
                onKeyUp={(e) => syncCaret(e.target)}
                onClick={(e) => syncCaret(e.target)}
                onKeyDown={onKeyDown}
                onFocus={() => { focusedRef.current = true; }}
                onBlur={() => { if (!busy) focusedRef.current = false; }}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  p: 0,
                  m: 0,
                  border: 'none',
                  outline: 'none',
                  bgcolor: 'transparent',
                  color: 'transparent',
                  caretColor: 'transparent',
                  font: 'inherit',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

Terminal.propTypes = {
  variant: PropTypes.oneOf(['overlay', 'hero']),
  onClose: PropTypes.func,
  autoFocus: PropTypes.bool,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  maximized: PropTypes.bool,
  onToggleMaximize: PropTypes.func,
  pendingLine: PropTypes.shape({ prompt: PropTypes.string, text: PropTypes.string }),
};

export default Terminal;
