import type {
  AriaLabelingProps,
  CollectionBase,
  DOMProps,
  FocusableDOMProps,
  FocusableProps,
  HelpTextProps,
  InputBase,
  Selection,
  TextInputBase,
  Validation,
} from '@react-types/shared';
import type {
  Key as DataKey,
  SlotProps,
  RenderProps,
  RACValidation,
} from 'react-aria-components';

export type MultipleSelection = {
  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: boolean;
  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: 'all' | Iterable<DataKey>;
  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: 'all' | Iterable<DataKey>;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: Selection) => void;
  /** The currently disabled keys in the collection (controlled). */
  disabledKeys?: Iterable<DataKey>;
};

// ? select multiple
// ?? props
export type SelectMultipleRenderProps = {
  /**
   * Whether the select is focused, either via a mouse or keyboard.
   * @selector [data-focused]
   */
  isFocused: boolean;
  /**
   * Whether the select is keyboard focused.
   * @selector [data-focus-visible]
   */
  isFocusVisible: boolean;
  /**
   * Whether the select is disabled.
   * @selector [data-disabled]
   */
  isDisabled: boolean;
  /**
   * Whether the select is currently open.
   * @selector [data-open]
   */
  isOpen: boolean;
  /**
   * Whether the select is invalid.
   * @selector [data-invalid]
   */
  isInvalid: boolean;
  /**
   * Whether the select is required.
   * @selector [data-required]
   */
  isRequired: boolean;
};

export type SelectMultipleBaseProps<T> = CollectionBase<T> &
  MultipleSelection &
  InputBase &
  TextInputBase &
  HelpTextProps &
  FocusableProps &
  Validation<Iterable<DataKey> | null> & {
    /**
     * Describes the type of autocomplete functionality the input should provide if any. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).
     */
    autoComplete?: string;
    /**
     * The name of the input, used when submitting an HTML form.
     */
    name?: string;
    /** Sets the open state of the menu. */
    isOpen?: boolean;
    /** Sets the default open state of the menu. */
    defaultOpen?: boolean;
    /** Method that is called when the open state of the menu changes. */
    onOpenChange?: (isOpen: boolean) => void;
  };

export type AriaSelectMultipleProps<T> = SelectMultipleBaseProps<T> &
  DOMProps &
  AriaLabelingProps &
  FocusableDOMProps;

export type SelectMultipleProps<T> = Omit<
  AriaSelectMultipleProps<T>,
  | 'children'
  | 'label'
  | 'description'
  | 'errorMessage'
  | 'validationState'
  | 'validationBehavior'
  | 'items'
> &
  RACValidation &
  RenderProps<SelectMultipleRenderProps> &
  SlotProps;
