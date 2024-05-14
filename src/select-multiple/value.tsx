import { filterDOMProps } from '@react-aria/utils';
import { createContext, forwardRef, useContext } from 'react';
import type { ContextValue } from 'react-aria-components';
import type { forwardRefType, RenderProps } from 'react-aria-components';
import { useContextProps, useSlottedContext } from 'react-aria-components';

import { SelectMultipleContext, SelectMultipleStateContext } from './contexts';

export type Ref = HTMLDivElement;

export type Props = Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof RenderProps<unknown>
>;

export const SelectMultipleValueContext =
  createContext<ContextValue<Props, HTMLDivElement>>(null);

const RenderFn = (props: Props, ref: React.ForwardedRef<Ref>) => {
  [props, ref] = useContextProps(props, ref, SelectMultipleValueContext);
  const state = useContext(SelectMultipleStateContext);
  const mainContext = useSlottedContext(SelectMultipleContext);
  const DOMProps = filterDOMProps(props);

  const shouldRenderPlaceholder =
    state?.selectedItems === undefined || state.selectedItems === null;

  return (
    <div
      ref={ref}
      {...DOMProps}
      data-placeholder={shouldRenderPlaceholder || undefined}
      data-slot="placeholder"
    >
      {shouldRenderPlaceholder
        ? mainContext?.placeholder ?? 'Select item(s)'
        : Array.from(state.selectedItems).map((item) => (
            <span key={item.key} data-slot="selected-item">
              {item.rendered}
            </span>
          ))}
    </div>
  );
};

const Component = (forwardRef as forwardRefType)(RenderFn);

export { Component as SelectMultipleValue };
