import React, { createContext, useContext } from 'react';
import { createSession, promptFor, run, navigateHistory } from '../terminal/engine';
import { complete as completeInput } from '../terminal/completion';
import { buildData, normalizeBlogs } from '../terminal/data';
import { useMode } from './ModeContext';

const TerminalContext = createContext();

const MAX_LINES = 500;

const isEditable = (el) => {
  if (!el || !el.tagName) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || el.isContentEditable === true;
};

export const TerminalProvider = ({ onTheme, children }) => {
  const { toggleMode, setMode } = useMode();
  const [lines, setLines] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [overlayOpen, setOverlayOpen] = React.useState(false);
  const [data, setData] = React.useState(() => buildData({}));
  const [cwd, setCwd] = React.useState('~');

  const sessionRef = React.useRef(createSession());
  const dataRef = React.useRef(data);
  const idRef = React.useRef(0);
  const historyIndexRef = React.useRef(null);
  const introPlayedRef = React.useRef(false);
  const heroRef = React.useRef({ visible: false, focus: null });
  const overlayOpenRef = React.useRef(false);
  const busyRef = React.useRef(false);
  const handlersRef = React.useRef({});
  handlersRef.current = { onTheme, toggleMode, setMode };

  React.useEffect(() => {
    dataRef.current = data;
  }, [data]);

  React.useEffect(() => {
    let cancelled = false;
    fetch('/blogs/posts.json', { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(buildData({ blogs: normalizeBlogs(json) }));
      })
      .catch(() => {
        if (!cancelled) setData(buildData({}));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const appendLines = React.useCallback((items) => {
    setLines((prev) => {
      const next = prev.concat(
        items.map((item) => {
          idRef.current += 1;
          return { ...item, id: idRef.current };
        })
      );
      return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
    });
  }, []);

  const closeOverlay = React.useCallback(() => {
    overlayOpenRef.current = false;
    setOverlayOpen(false);
  }, []);

  const openOverlay = React.useCallback(() => {
    if (heroRef.current.visible && heroRef.current.focus) {
      heroRef.current.focus();
      return;
    }
    overlayOpenRef.current = true;
    setOverlayOpen(true);
  }, []);

  const toggleOverlay = React.useCallback(() => {
    if (overlayOpenRef.current) closeOverlay();
    else openOverlay();
  }, [openOverlay, closeOverlay]);

  const registerHero = React.useCallback((visible, focus) => {
    heroRef.current = { visible, focus };
  }, []);

  const applyEffect = React.useCallback(
    (effect) => {
      const { onTheme: themeHandler, toggleMode: toggle, setMode: set } = handlersRef.current;
      switch (effect.type) {
        case 'scroll':
          closeOverlay();
          document.getElementById(effect.target)?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'open':
          if (effect.url.startsWith('mailto:')) window.location.href = effect.url;
          else window.open(effect.url, '_blank', 'noopener,noreferrer');
          break;
        case 'theme':
          if (themeHandler) themeHandler(effect.value);
          break;
        case 'mode':
          if (effect.value === 'toggle') toggle();
          else set(effect.value);
          break;
        case 'clear':
          setLines([]);
          break;
        case 'close':
          closeOverlay();
          break;
        default:
          break;
      }
    },
    [closeOverlay]
  );

  const submit = React.useCallback(
    async (input) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      historyIndexRef.current = null;
      const before = sessionRef.current;
      appendLines([{ kind: 'input', prompt: promptFor(before.cwd), segments: [{ text: input }] }]);
      try {
        const result = await run(input, before, dataRef.current);
        sessionRef.current = result.session;
        setCwd(result.session.cwd);
        for (const out of result.output) {
          if (out.delayMs) {
            await new Promise((resolve) => setTimeout(resolve, out.delayMs));
          }
          appendLines([{ kind: 'output', segments: out.segments }]);
        }
        result.effects.forEach(applyEffect);
      } catch (e) {
        appendLines([{ kind: 'output', segments: [{ text: 'error: command failed', color: 'error' }] }]);
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [appendLines, applyEffect]
  );

  const browseHistory = React.useCallback((direction) => {
    const res = navigateHistory(sessionRef.current.history, historyIndexRef.current, direction);
    historyIndexRef.current = res.index;
    return res.value;
  }, []);

  const resetHistoryBrowse = React.useCallback(() => {
    historyIndexRef.current = null;
  }, []);

  const complete = React.useCallback(
    (input) => completeInput(input, sessionRef.current, dataRef.current),
    []
  );

  const clear = React.useCallback(() => setLines([]), []);

  const getIntroPlayed = React.useCallback(() => introPlayedRef.current, []);
  const markIntroPlayed = React.useCallback(() => {
    introPlayedRef.current = true;
  }, []);

  const getData = React.useCallback(() => dataRef.current, []);

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== '`' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditable(e.target)) return;
      e.preventDefault();
      toggleOverlay();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleOverlay]);

  const value = React.useMemo(
    () => ({
      lines,
      busy,
      cwd,
      data,
      overlayOpen,
      openOverlay,
      closeOverlay,
      toggleOverlay,
      submit,
      appendLines,
      clear,
      complete,
      browseHistory,
      resetHistoryBrowse,
      registerHero,
      getIntroPlayed,
      markIntroPlayed,
      getData,
    }),
    [
      lines, busy, cwd, data, overlayOpen, openOverlay, closeOverlay, toggleOverlay, submit,
      appendLines, clear, complete, browseHistory, resetHistoryBrowse, registerHero,
      getIntroPlayed, markIntroPlayed, getData,
    ]
  );

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
};

export const useTerminal = () => useContext(TerminalContext);
