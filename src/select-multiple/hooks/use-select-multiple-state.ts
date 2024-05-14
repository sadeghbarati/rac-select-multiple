import type { FormValidationState } from '@react-stately/form'
import { useFormValidationState } from '@react-stately/form'
import type { OverlayTriggerState } from '@react-stately/overlays'
import { useOverlayTriggerState } from '@react-stately/overlays'
import type { CollectionStateBase, FocusStrategy } from '@react-types/shared'
import { useState } from 'react'

import type { SelectMultipleProps } from '../types'
import {
	type SelectMultipleListState,
	useSelectMultipleListState,
} from './use-select-multiple-list-state'

export type SelectMultipleStateHookProps<T> =
	& CollectionStateBase<T>
	& Omit<SelectMultipleProps<T>, 'children'>

export type SelectMultipleState<T> =
	& SelectMultipleListState<T>
	& Omit<OverlayTriggerState, 'open' | 'toggle'>
	& FormValidationState
	& {
		/** Whether the select is currently focused. */
		readonly isFocused: boolean
		/** Sets whether the select is focused. */
		setFocused(isFocused: boolean): void
		/** Controls which item will be auto focused when the menu opens. */
		readonly focusStrategy: FocusStrategy | null
		/** Opens the menu. */
		open(focusStrategy?: FocusStrategy | null): void
		/** Toggles the menu. */
		toggle(focusStrategy?: FocusStrategy | null): void
	}

export const useSelectMultipleState = <T extends object>(
	props: SelectMultipleStateHookProps<T>,
): SelectMultipleState<T> => {
	const triggerState = useOverlayTriggerState(props)
	const [focusStrategy, setFocusStrategy] = useState<FocusStrategy | null>(null)
	const listState = useSelectMultipleListState({
		...props,
		onSelectionChange: (keys) => {
			props.onSelectionChange?.(keys)
			validationState.commitValidation()
		},
	})

	const validationState = useFormValidationState({
		...props,
		value: listState.selectedKeys,
	})

	const [isFocused, setFocused] = useState(false)

	return {
		...listState,
		...triggerState,
		...validationState,
		focusStrategy,
		open(focusStrategy = null) {
			setFocusStrategy(focusStrategy)
			triggerState.open()
		},
		toggle(focusStrategy = null) {
			setFocusStrategy(focusStrategy)
			triggerState.toggle()
		},
		isFocused,
		setFocused,
	}
}
