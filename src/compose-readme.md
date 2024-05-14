```typescript
<SelectMultiple>
	{({ isInvalid }) => (
		<>
			<Button
				type="button"
				autoFocus={props.autoFocus}
				data-slot="control"
				data-variant={variant}
				data-loading={isLoading || undefined}
				data-readonly={isReadOnly || undefined}
				data-invalid={isInvalid || undefined}
			>
				<SelectMultipleValue ref={forwardedRef} />
			</Button>

			{errorMessage && <FieldError>{errorMessage}</FieldError>}
			{description && <Text>{description}</Text>}

			<Popover>
				<ListBox
					shouldFocusWrap={shouldFocusWrap}
					renderEmptyState={renderEmptyState}
					items={items}
					data-slot="list"
				>
					{children}
				</RACListBox>
			</Popover>
		</>
	)}
</SelectMultiple>
```
