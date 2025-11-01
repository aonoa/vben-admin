// @jsxImportSource react
import { createElement, useCallback, useMemo, useState } from 'react';

// Minimal React demo component to validate veaury integration
export default function FlowGram() {
  const [count, setCount] = useState(0);
  const inc = useCallback(() => setCount((c: number) => c + 1), []);
  const dec = useCallback(() => setCount((c: number) => c - 1), []);
  const parity = useMemo(() => (count % 2 === 0 ? 'even' : 'odd'), [count]);

  return createElement(
    'div',
    { style: { padding: 16 } },
    createElement('h2', { style: { margin: '8px 0' } }, 'FlowGram (React via Veaury)'),
    createElement(
      'p',
      { style: { margin: '8px 0' } },
      'Counter: ',
      String(count),
      ' (',
      parity,
      ')',
    ),
    createElement(
      'div',
      { style: { display: 'flex', gap: 8 } },
      createElement('button', { onClick: inc }, 'Increase'),
      createElement('button', { onClick: dec }, 'Decrease'),
    ),
    createElement(
      'p',
      { style: { marginTop: 12, color: '#888' } },
      'This is a placeholder. Replace with a real flow editor or graph component later.',
    ),
  );
}
