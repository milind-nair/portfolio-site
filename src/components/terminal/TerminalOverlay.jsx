import * as React from 'react';
import { Dialog, Box, Chip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTerminal } from '../../context/TerminalContext';
import Terminal from './Terminal';

const CHIPS = ['help', 'projects', 'blogs', 'contact', 'sudo hire-me'];

const TerminalOverlay = () => {
  const { overlayOpen, closeOverlay, submit, busy } = useTerminal();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const [maximized, setMaximized] = React.useState(false);

  return (
    <Dialog
      open={overlayOpen}
      onClose={closeOverlay}
      fullScreen={xs}
      fullWidth
      maxWidth={false}
      aria-label="Terminal"
      sx={{
        '& .MuiDialog-container': { alignItems: 'flex-start' },
        '& .MuiBackdrop-root': { bgcolor: 'rgba(0,0,0,0.6)' },
      }}
      PaperProps={{
        sx: {
          bgcolor: '#0d1117',
          backgroundImage: 'none',
          width: '100%',
          maxWidth: xs ? 'none' : maximized ? 'calc(100vw - 64px)' : 900,
          height: xs ? '100%' : maximized ? 'calc(100vh - 64px)' : '60vh',
          mt: xs ? 0 : 4,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <Terminal
          variant="overlay"
          autoFocus
          onClose={closeOverlay}
          maximized={maximized}
          onToggleMaximize={() => setMaximized((m) => !m)}
        />
      </Box>
      {xs && (
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', p: 1, bgcolor: '#161b22', flexShrink: 0 }}>
          {CHIPS.map((c) => (
            <Chip
              key={c}
              label={c}
              onClick={() => submit(c)}
              disabled={busy}
              size="small"
              sx={{ color: '#e6edf3', borderColor: 'rgba(255,255,255,0.3)', fontFamily: 'inherit' }}
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Dialog>
  );
};

export default TerminalOverlay;
