import { useCollator } from '@react-aria/i18n';
import { useField } from '@react-aria/label';
import { AriaListBoxOptions } from '@react-aria/listbox';
import { useMenuTrigger } from '@react-aria/menu';
import { ListKeyboardDelegate, useTypeSelect } from '@react-aria/selection';
import { chain, filterDOMProps, mergeProps, useId } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import type {
  DOMAttributes,
  FocusableElement,
  KeyboardDelegate,
  ValidationResult,
} from '@react-types/shared';
import { FocusEvent, RefObject, useCallback, useMemo } from 'react';
import { Key as DataKey } from 'react-aria-components';

import type { AriaSelectMultipleProps } from '../types';
import { SelectMultipleState } from './use-select-multiple-state';

export type AriaSelectMultipleOptions<T> = Omit<
  AriaSelectMultipleProps<T>,
  'children'
> & {
  /**
   * An optional keyboard delegate implementation for type to select,
   * to override the default.
   */
  keyboardDelegate?: KeyboardDelegate;
};

export type SelectMultipleAria<T> = ValidationResult & {
  /** Props for the popup trigger element. */
  triggerProps: AriaButtonProps;

  /** Props for the element representing the selected value. */
  valueProps: DOMAttributes;

  /** Props for the popup. */
  menuProps: AriaListBoxOptions<T>;

  /** Props for the select's description element, if any. */
  descriptionProps: DOMAttributes;

  /** Props for the select's error message element, if any. */
  errorMessageProps: DOMAttributes;
};

export const useSelectMultiple = <T>(
  { keyboardDelegate, ...props }: AriaSelectMultipleOptions<T>,
  {
    collection,
    disabledKeys,
    selectionManager,

    isOpen,
    setOpen,
    open,
    close,
    toggle,

    displayValidation,
    commitValidation,

    focusStrategy,
    isFocused,
    setFocused,
  }: SelectMultipleState<T>,
  triggerRef: RefObject<FocusableElement>
): SelectMultipleAria<T> => {
  const collator = useCollator({ usage: 'search', sensitivity: 'base' });
  const delegate = useMemo(
    () =>
      keyboardDelegate ||
      new ListKeyboardDelegate(
        collection,
        disabledKeys,
        null as never,
        collator
      ),
    [keyboardDelegate, collection, disabledKeys, collator]
  );

  const { menuTriggerProps, menuProps } = useMenuTrigger<T>(
    { type: 'listbox', isDisabled: props.isDisabled },
    { isOpen, setOpen, open, close, toggle, focusStrategy: 'first' },
    triggerRef
  );

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (selectionManager.selectionMode === 'single') {
        switch (event.key) {
          case 'ArrowLeft': {
            event.preventDefault();

            const key =
              selectionManager.selectedKeys.size > 0
                ? delegate.getKeyAbove?.(
                    selectionManager.selectedKeys.values().next()
                      .value as DataKey
                  )
                : delegate.getFirstKey?.();

            if (key) {
              selectionManager.setSelectedKeys([key]);
            }
            break;
          }

          case 'ArrowRight': {
            event.preventDefault();

            const key =
              selectionManager.selectedKeys.size > 0
                ? delegate.getKeyBelow?.(
                    selectionManager.selectedKeys.values().next()
                      .value as DataKey
                  )
                : delegate.getFirstKey?.();

            if (key) {
              selectionManager.setSelectedKeys([key]);
            }
            break;
          }
        }
      }
    },
    [delegate, selectionManager]
  );

  const { typeSelectProps } = useTypeSelect({
    keyboardDelegate: delegate,
    selectionManager,
    onTypeSelect(key) {
      selectionManager.setSelectedKeys([key]);
      commitValidation();
    },
  });

  typeSelectProps.onKeyDown = typeSelectProps.onKeyDownCapture;
  delete typeSelectProps.onKeyDownCapture;

  const { fieldProps, descriptionProps, errorMessageProps } = useField({
    id: props.id,
    labelElementType: 'div',
    errorMessage: props.errorMessage || displayValidation.validationErrors,
    description: props.description,
    validate: props.validate,
    validationBehavior: props.validationBehavior,
    isInvalid: displayValidation.isInvalid,
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
    'aria-details': props['aria-details'],
    'aria-describedby': props['aria-describedby'],
  });

  typeSelectProps.onKeyDown = typeSelectProps.onKeyDownCapture;
  delete typeSelectProps.onKeyDownCapture;

  const valueId = useId();
  const domProps = filterDOMProps(props, { labelable: true });
  const triggerProps = mergeProps(
    typeSelectProps,
    menuTriggerProps,
    fieldProps
  );

  return {
    ...displayValidation,
    triggerProps: mergeProps(domProps, {
      ...triggerProps,
      isDisabled: props.isDisabled,
      onKeyDown: chain(triggerProps.onKeyDown, keyDownHandler, props.onKeyDown),
      onKeyUp: props.onKeyUp,
      'aria-labelledby': [
        valueId,
        triggerProps['aria-labelledby'],
        triggerProps['aria-label'] && !triggerProps['aria-labelledby']
          ? triggerProps.id
          : null,
      ]
        .filter(Boolean)
        .join(' '),
      onFocus(event: FocusEvent) {
        if (isFocused) {
          return;
        }

        props.onFocus?.(event);
        props.onFocusChange?.(true);
        setFocused(true);
      },
      onBlur(event: FocusEvent) {
        if (isOpen) {
          return;
        }

        props.onBlur?.(event);
        props.onFocusChange?.(false);
        setFocused(false);
      },
    }),
    valueProps: {
      id: valueId,
    },
    menuProps: {
      ...menuProps,
      autoFocus: focusStrategy || true,
      shouldSelectOnPressUp: true,
      shouldFocusOnHover: true,
      disallowEmptySelection: false,
      linkBehavior: 'selection',
      onBlur: (event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) {
          return;
        }

        props.onBlur?.(event);
        props.onFocusChange?.(false);
        setFocused(false);
      },
      'aria-labelledby': [
        fieldProps['aria-labelledby'],
        triggerProps['aria-label'] && !fieldProps['aria-labelledby']
          ? triggerProps.id
          : null,
      ]
        .filter(Boolean)
        .join(' '),
    },
    descriptionProps,
    errorMessageProps,
  };
};
