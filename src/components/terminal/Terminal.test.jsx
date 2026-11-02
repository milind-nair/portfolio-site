import React from 'react';
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../../App';

const press = (el, key, opts = {}) => fireEvent.keyDown(el, { key, ...opts });

const openTerminal = async () => {
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  await act(async () => {});
  fireEvent.keyDown(document.body, { key: '`' });
  const dialog = await screen.findByRole('dialog');
  return { dialog, input: within(dialog).getByLabelText('Terminal input') };
};

const runCmd = (input, text) => {
  fireEvent.change(input, { target: { value: text } });
  press(input, 'Enter');
};

beforeEach(() => {
  window.localStorage.clear();
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView = jest.fn();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

test('backtick opens the terminal dialog', async () => {
  render(<App />);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await openTerminal();
});

test('help prints output', async () => {
  render(<App />);
  const { dialog, input } = await openTerminal();
  runCmd(input, 'help');
  expect(await within(dialog).findByText(/Site control/)).toBeInTheDocument();
});

test('goto projects scrolls and closes the dialog', async () => {
  render(<App />);
  const { input } = await openTerminal();
  runCmd(input, 'goto projects');
  await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});

test('ArrowUp recalls the last command', async () => {
  render(<App />);
  const { dialog, input } = await openTerminal();
  runCmd(input, 'help');
  await within(dialog).findByText(/Site control/);
  await waitFor(() => expect(input).not.toBeDisabled());
  press(input, 'ArrowUp');
  expect(input).toHaveValue('help');
});

test('Tab completes or lists candidates for a partial command', async () => {
  render(<App />);
  const { input } = await openTerminal();
  fireEvent.change(input, { target: { value: 'proj' } });
  press(input, 'Tab');
  expect(input.value.startsWith('proj')).toBe(true);
  expect(input.value.length).toBeGreaterThan(3);
});
