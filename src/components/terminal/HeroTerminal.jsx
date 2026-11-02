import * as React from 'react';
import { Box } from '@mui/material';
import { useTerminal } from '../../context/TerminalContext';
import { createSession, promptFor, run } from '../../terminal/engine';
import Terminal from './Terminal';

const TYPE_MS = 40;
const HINT = "Type 'help' to explore, or press ` to open me anywhere.";

const HeroTerminal = () => {
  const { appendLines, registerHero, getIntroPlayed, markIntroPlayed, getData } = useTerminal();
  const [typed, setTyped] = React.useState(null);
  const inputRef = React.useRef(null);
  const boxRef = React.useRef(null);

  React.useEffect(() => {
    registerHero(false, null);
    const focus = () => inputRef.current && inputRef.current.focus();
    const target = boxRef.current;
    let observer;
    if (target && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => registerHero(entry.isIntersecting, focus));
      }, { threshold: 0.5 });
      observer.observe(target);
    }
    return () => {
      if (observer) observer.disconnect();
      registerHero(false, null);
    };
  }, [registerHero]);

  React.useEffect(() => {
    if (getIntroPlayed()) return undefined;
    let cancelled = false;
    const timers = [];
    const reduce = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prompt = promptFor('~');

    const finish = async () => {
      const result = await run('whoami', createSession(), getData());
      if (cancelled) return;
      setTyped(null);
      appendLines([
        { kind: 'input', prompt, segments: [{ text: 'whoami' }] },
        ...result.output.map((o) => ({ kind: 'output', segments: o.segments })),
        { kind: 'output', segments: [{ text: HINT, color: 'muted' }] },
      ]);
      markIntroPlayed();
    };

    if (reduce) {
      finish();
    } else {
      const word = 'whoami';
      setTyped({ prompt, text: '' });
      for (let i = 1; i <= word.length; i += 1) {
        timers.push(setTimeout(setTyped, i * TYPE_MS, { prompt, text: word.slice(0, i) }));
      }
      timers.push(setTimeout(finish, (word.length + 1) * TYPE_MS));
    }
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      setTyped(null);
    };
  }, [appendLines, getIntroPlayed, markIntroPlayed, getData]);

  return (
    // Fill the hero: 80vh minus its padding and the button row below.
    <Box ref={boxRef} sx={{ height: { xs: 360, sm: 'calc(80vh - 140px)' }, minHeight: 360, mb: 4 }}>
      <Terminal variant="hero" inputRef={inputRef} pendingLine={typed} />
    </Box>
  );
};

export default HeroTerminal;
