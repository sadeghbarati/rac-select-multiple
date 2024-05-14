import { createContext } from 'react';
import type { ContextValue } from 'react-aria-components';

import type { SelectMultipleProps } from '../types';

export const SelectMultipleContext =
  createContext<ContextValue<SelectMultipleProps<any>, HTMLDivElement>>(null);
