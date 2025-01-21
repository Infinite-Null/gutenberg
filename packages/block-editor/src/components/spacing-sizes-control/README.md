# Spacing Sizes Control

The SpacingSizesControl component provides a user interface for controlling spacing values in blocks. It supports single, axial, and separated input controls for different spacing configurations.

## Description

The SpacingSizesControl component is a flexible control that allows users to modify spacing values for different sides of a block. It supports three viewing modes:

1. Single: Control one side at a time
2. Axial: Control horizontal and vertical sides together
3. Custom: Control each side separately

![Spacing Sizes Control](https://i.postimg.cc/3RkzzfL6/Screenshot-2025-01-10-at-8-07-55-AM.png)

## Usage

```js
import {
	InspectorControls,
	__experimentalSpacingSizesControl as SpacingSizesControl,
} from '@wordpress/block-editor';
import { View } from '@wordpress/primitives';
import { useCustomUnits } from '@wordpress/components';

const DimensionInput = ( { label, onChange, value = '' } ) => {
	const availableUnits = [ 'px', 'em', 'rem', 'vw', 'vh' ];
	const units = useCustomUnits( {
		availableUnits,
		defaultValues: { px: 100, em: 10, rem: 10, vw: 10, vh: 25 },
	} );

	const handleOnChange = ( { top, right, bottom, left } ) => {
		onChange( { top, right, bottom, left } );
	};

	return (
		<View className="tools-panel-item-spacing">
			<SpacingSizesControl
				values={ {
					top: '0px',
					right: '0px',
					bottom: '0px',
					left: '0px',
				} }
				onChange={ handleOnChange }
				label={ label }
				sides={ [ 'all' ] }
				units={ units }
				allowReset={ false }
				splitOnAxis={ false }
				showSideInLabel={ false }
			/>
		</View>
	);
};
```

## Props

### `inputProps`

-   Type: `Object`
-   Required: No
-   Description: Additional props to pass to the input controls.

### `label`

-   Type: `String`
-   Required: Yes
-   Description: Label for the control (e.g., "Height").

### `minimumCustomValue`

-   Type: `Number`
-   Default: 0
-   Description: Minimum value allowed for custom input.

### `onChange`

-   Type: `Function`
-   Required: Yes
-   Description: Callback function called when spacing values change. Receives an object containing the updated values.

### `onMouseOut`

-   Type: `Function`
-   Required: No
-   Description: Callback function called when mouse leaves the control.

### `onMouseOver`

-   Type: `Function`
-   Required: No
-   Description: Callback function called when mouse enters the control.

### `showSideInLabel`

-   Type: `Boolean`
-   Default: true
-   Description: Whether to show the side (top, right, etc.) in the control label.

### `sides`

-   Type: `Array`
-   Default: ALL_SIDES (top, right, bottom, left)
-   Description: Array of sides that can be controlled.

### `useSelect`

-   Type: `Boolean`
-   Required: No
-   Description: Whether to use a select control for predefined values.

### `values`

-   Type: `Object`
-   Required: No
-   Description: Object containing the current spacing values for each side.
