import type { ListState } from '@react-stately/list';
import { useListState as useRSListState } from '@react-stately/list';
import { useControlledState } from '@react-stately/utils';
import type { CollectionStateBase, Node } from '@react-types/shared';
import { useMemo } from 'react';
import type { Key as DataKey } from 'react-aria-components';

import type { MultipleSelection } from '../types';

export type SelectMultipleListStateHookProps<T> = CollectionStateBase<T> &
  Omit<MultipleSelection, 'disallowEmptySelection'>;

export type SelectMultipleListState<T> = ListState<T> & {
  /** The key for the currently selected items. */
  readonly selectedKeys: Iterable<DataKey> | null;
  /** Sets the selected keys. */
  setSelectedKeys(keys: Iterable<DataKey> | null): void;
  /** The value of the currently selected item. */
  readonly selectedItems: Iterable<Node<T>> | null;
};

export const useSelectMultipleListState = <T extends object>(
  props: SelectMultipleListStateHookProps<T>
): SelectMultipleListState<T> => {
  const [selectedKeys, setSelectedKeys] = useControlledState(
    props.selectedKeys,
    props.defaultSelectedKeys ?? null,
    props.onSelectionChange
  );

  const { collection, selectionManager, disabledKeys } = useRSListState({
    ...props,
    selectionMode: 'multiple',
    disallowEmptySelection: false,
    allowDuplicateSelectionEvents: true,
    selectedKeys: selectedKeys ?? undefined,
    onSelectionChange: (keys) => {
      const value = keys === 'all' ? new Set(collection.getKeys()) : keys;

      props.onSelectionChange?.(value);
      setSelectedKeys(keys);
    },
  });

  const selectedItems = useMemo(() => {
    const hasSelections =
      selectedKeys !== null &&
      (selectedKeys === 'all' || Array.from(selectedKeys).length > 0);

    return hasSelections
      ? (Array.from(selectedKeys, (key) => collection.getItem(key)) as Iterable<
          Node<T>
        >)
      : null;
  }, [selectedKeys, collection]);

  return {
    collection,
    selectionManager,
    selectedKeys,
    selectedItems,
    disabledKeys,
    setSelectedKeys,
  };
};
