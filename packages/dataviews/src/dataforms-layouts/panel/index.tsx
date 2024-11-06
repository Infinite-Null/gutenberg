/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
	__experimentalSpacer as Spacer,
	Dropdown,
	Button,
	BaseControl,
} from '@wordpress/components';
import { sprintf, __, _x } from '@wordpress/i18n';
import { useState, useMemo, useContext } from '@wordpress/element';
import { closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { FormField, NormalizedField, SimpleFormField } from '../../types';
import DataFormContext from '../../components/dataform-context';
import { DataFormLayout } from '../data-form-layout';
import { isCombinedField } from '../is-combined-field';

interface FormFieldProps< Item > {
	data: Item;
	field: FormField;
	onChange: ( value: any ) => void;
	defaultLayout?: string;
}

function DropdownHeader( {
	title,
	onClose,
}: {
	title?: string;
	onClose: () => void;
} ) {
	return (
		<VStack
			className="dataforms-layouts-panel__dropdown-header"
			spacing={ 4 }
		>
			<HStack alignment="center">
				{ title && (
					<Heading level={ 2 } size={ 13 }>
						{ title }
					</Heading>
				) }
				<Spacer />
				{ onClose && (
					<Button
						label={ __( 'Close' ) }
						icon={ closeSmall }
						onClick={ onClose }
						size="small"
					/>
				) }
			</HStack>
		</VStack>
	);
}

function PanelDropdown< Item >( {
	fieldDefinition,
	popoverAnchor,
	data,
	onChange,
	field,
}: {
	fieldDefinition: NormalizedField< Item >;
	popoverAnchor: HTMLElement | null;
} & FormFieldProps< Item > ) {
	const fieldLabel = isCombinedField( field )
		? field.label
		: fieldDefinition?.label;
	const childrenFields = useMemo( () => {
		if ( isCombinedField( field ) ) {
			return field.children.map( ( child ) => {
				if ( typeof child === 'string' ) {
					return {
						field: child,
					};
				}
				return child;
			} );
		}
		// If not explicit children return the field id itself.
		return [ { field: field.field } ];
	}, [ field ] );

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ( {
			// Anchor the popover to the middle of the entire row so that it doesn't
			// move around when the label changes.
			anchor: popoverAnchor,
			placement: 'left-start',
			offset: 36,
			shift: true,
		} ),
		[ popoverAnchor ]
	);

	return (
		<Dropdown
			contentClassName="dataforms-layouts-panel__field-dropdown"
			popoverProps={ popoverProps }
			focusOnMount
			toggleProps={ {
				size: 'compact',
				variant: 'tertiary',
				tooltipPosition: 'middle left',
			} }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					className="dataforms-layouts-panel__field-control"
					size="compact"
					variant="tertiary"
					aria-expanded={ isOpen }
					aria-label={ sprintf(
						// translators: %s: Field name.
						_x( 'Edit %s', 'field' ),
						fieldLabel
					) }
					onClick={ onToggle }
				>
					<fieldDefinition.render item={ data } />
				</Button>
			) }
			renderContent={ ( { onClose } ) => (
				<>
					<DropdownHeader title={ fieldLabel } onClose={ onClose } />
					<DataFormLayout
						data={ data }
						fields={ childrenFields }
						onChange={ onChange }
					>
						{ ( FieldLayout, nestedField ) => (
							<FieldLayout
								key={
									isCombinedField( nestedField )
										? nestedField.id
										: nestedField.field
								}
								data={ data }
								field={ nestedField }
								onChange={ onChange }
								hideLabelFromVision={
									childrenFields.length < 2
								}
							/>
						) }
					</DataFormLayout>
				</>
			) }
		/>
	);
}

export default function FormPanelField< Item >( {
	data,
	field,
	onChange,
	defaultLayout,
}: FormFieldProps< Item > ) {
	const { fields } = useContext( DataFormContext );
	const fieldDefinition = fields.find( ( fieldDef ) => {
		// Default to the first child if it is a combined field.
		if ( isCombinedField( field ) ) {
			const children = field.children.filter(
				( child ): child is string | SimpleFormField =>
					typeof child === 'string' || ! isCombinedField( child )
			);
			const firstChildFieldId =
				typeof children[ 0 ] === 'string'
					? children[ 0 ]
					: children[ 0 ].field;
			return fieldDef.id === firstChildFieldId;
		}
		return fieldDef.id === field.field;
	} );
	const labelPosition = field.labelPosition ?? 'side';

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ popoverAnchor, setPopoverAnchor ] = useState< HTMLElement | null >(
		null
	);

	if ( ! fieldDefinition ) {
		return null;
	}

	const fieldLabel = isCombinedField( field )
		? field.label
		: fieldDefinition?.label;

	if ( labelPosition === 'top' ) {
		return (
			<BaseControl __nextHasNoMarginBottom>
				<BaseControl.VisualLabel>
					{ fieldLabel }
				</BaseControl.VisualLabel>
				<div>
					<PanelDropdown
						field={ field }
						popoverAnchor={ popoverAnchor }
						fieldDefinition={ fieldDefinition }
						data={ data }
						onChange={ onChange }
						defaultLayout={ defaultLayout }
					/>
				</div>
			</BaseControl>
		);
	}

	// Defaults to label position side.
	return (
		<HStack
			ref={ setPopoverAnchor }
			className="dataforms-layouts-panel__field"
		>
			<div className="dataforms-layouts-panel__field-label">
				{ fieldLabel }
			</div>
			<div>
				<PanelDropdown
					field={ field }
					popoverAnchor={ popoverAnchor }
					fieldDefinition={ fieldDefinition }
					data={ data }
					onChange={ onChange }
					defaultLayout={ defaultLayout }
				/>
			</div>
		</HStack>
	);
}
