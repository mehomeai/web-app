import { useEffect, useState } from 'react';

const errorBoundaryTestKey = 'me-error-boundary-test-thrown';

export function ErrorBoundaryTestScreen() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [recovered, setRecovered] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(errorBoundaryTestKey) === 'true') {
      setRecovered(true);
      return;
    }

    window.sessionStorage.setItem(errorBoundaryTestKey, 'true');
    setShouldThrow(true);
  }, []);

  if (shouldThrow) {
    throw new Error('Controlled error boundary test');
  }

  return recovered ? (
    <p data-testid="error-boundary-recovered">The page recovered.</p>
  ) : (
    <p>Preparing the controlled test.</p>
  );
}
