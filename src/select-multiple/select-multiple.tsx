import { filterDOMProps, useResizeObserver } from '@react-aria/utils';
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { useFocusRing } from 'react-aria';
import type { forwardRefType } from 'react-aria-components';
import {
  ButtonContext,
  CollectionDocumentContext,
  FieldErrorContext,
  FormContext,
  Hidden,
  ListBoxContext,
  ListStateContext,
  OverlayTriggerStateContext,
  PopoverContext,
  Provider,
  removeDataAttributes,
  TextContext,
  useCollectionDocument,
  useContextProps,
  useRenderProps,
  useSlottedContext,
} from 'react-aria-components';

import { SelectMultipleContext, SelectMultipleStateContext } from './contexts';
import { useSelectMultiple, useSelectMultipleState } from './hooks';
import type { SelectMultipleProps } from './types';
import { SelectMultipleValueContext } from './value';

export type Props<T> = SelectMultipleProps<T>;

const SelectMultiple = <T extends object>(
  props: Props<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  [props, ref] = useContextProps(props, ref, SelectMultipleContext);
  const { validationBehavior: formValidationBehavior } =
    useSlottedContext(FormContext) || {};
  const validationBehavior =
    props.validationBehavior ?? formValidationBehavior ?? 'native';
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [buttonWidth, setButtonWidth] = useState<string | null>(null);

  const onResize = useCallback(() => {
    if (buttonRef.current) {
      setButtonWidth(`${buttonRef.current.offsetWidth}px`);
    }
  }, [buttonRef]);

  useResizeObserver({
    ref: buttonRef,
    onResize: onResize,
  });

  const { isFocusVisible, focusProps } = useFocusRing({ within: true });
  const { collection, document } = useCollectionDocument();
  const state = useSelectMultipleState({
    ...props,
    collection,
    children: undefined,
    validationBehavior,
  });

  const {
    triggerProps,
    valueProps,
    descriptionProps,
    errorMessageProps,
    menuProps,
    ...validation
  } = useSelectMultiple(
    {
      ...removeDataAttributes(props),
      ...props,
      validationBehavior,
    },
    state,
    buttonRef
  );

  const renderPropsState = useMemo(
    () => ({
      isOpen: state.isOpen,
      isFocused: state.isFocused,
      isFocusVisible,
      isDisabled: props.isDisabled || false,
      isInvalid: validation.isInvalid || false,
      isRequired: props.isRequired || false,
    }),
    [
      state.isOpen,
      state.isFocused,
      isFocusVisible,
      props.isDisabled,
      validation.isInvalid,
      props.isRequired,
    ]
  );

  const renderProps = useRenderProps({
    ...props,
    defaultClassName: 'react-aria-SelectMultiple',
    values: renderPropsState,
  });

  const DOMProps = filterDOMProps(props);

  delete DOMProps.id;

  return (
    <>
      <Hidden>
        <Provider
          values={[
            [SelectMultipleContext, props],
            [SelectMultipleStateContext, state],
            [CollectionDocumentContext, document],
          ]}
        >
          {renderProps.children}
        </Provider>
      </Hidden>

      <Provider
        values={[
          [SelectMultipleContext, props],
          [SelectMultipleStateContext, state],
          [SelectMultipleValueContext, valueProps],
          [
            ButtonContext,
            { ...triggerProps, ref: buttonRef, isPressed: state.isOpen },
          ],
          [OverlayTriggerStateContext, state],
          [
            PopoverContext,
            {
              trigger: 'SelectMultiple',
              triggerRef: buttonRef,
              placement: 'bottom start',
              style: { '--trigger-width': buttonWidth } as React.CSSProperties,
            },
          ],
          [ListBoxContext, menuProps],
          [ListStateContext, state],
          [
            TextContext,
            {
              slots: {
                description: descriptionProps,
                errorMessage: errorMessageProps,
              },
            },
          ],
          [FieldErrorContext, validation],
        ]}
      >
        <div
          {...DOMProps}
          {...renderProps}
          {...focusProps}
          ref={ref}
          slot={props.slot || undefined}
          data-focused={state.isFocused || undefined}
          data-focus-visible={isFocusVisible || undefined}
          data-open={state.isOpen || undefined}
          data-invalid={validation.isInvalid || undefined}
          data-disabled={props.isDisabled || undefined}
          data-required={props.isRequired || undefined}
        />
      </Provider>
    </>
  );
};

const _SelectMultiple = (forwardRef as forwardRefType)(SelectMultiple);

export { _SelectMultiple as SelectMultiple };
