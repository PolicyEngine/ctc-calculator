'use client';

import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import CTCCalculator from '@/components/CTCCalculator';

export default function HomePage() {
  return (
    <MantineProvider theme={theme}>
      <CTCCalculator />
    </MantineProvider>
  );
}
