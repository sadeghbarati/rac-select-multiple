import { createContext } from 'react';

import type { SelectMultipleState } from '../hooks';

export const SelectMultipleStateContext =
  createContext<SelectMultipleState<unknown> | null>(null);
