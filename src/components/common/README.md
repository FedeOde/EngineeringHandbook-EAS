# Common Components Library

This directory contains reusable, themed components that provide consistent styling and behavior across the application.

## Components

### Button

A versatile button component with multiple variants and sizes.

**Props:**
- `title` (string, required): Button text
- `onPress` (() => void, required): Press handler
- `variant` ('primary' | 'secondary' | 'outline' | 'ghost' | 'danger'): Visual style
- `size` ('small' | 'medium' | 'large'): Button size
- `disabled` (boolean): Disabled state
- `loading` (boolean): Shows loading indicator
- `fullWidth` (boolean): Expands to full width
- `style` (ViewStyle): Additional styles
- `textStyle` (TextStyle): Additional text styles

**Example:**
```typescript
<Button
  title="Save Changes"
  onPress={handleSave}
  variant="primary"
  size="medium"
  loading={isSaving}
/>
```

**Variants:**
- `primary`: Solid primary color background
- `secondary`: Light background with border
- `outline`: Transparent with colored border
- `ghost`: Transparent with colored text
- `danger`: Red background for destructive actions

---

### Card

A container component with consistent styling and optional elevation.

**Props:**
- `children` (ReactNode, required): Card content
- `style` (ViewStyle): Additional styles
- `onPress` (() => void): Makes card pressable
- `elevated` (boolean): Adds shadow elevation

**Example:**
```typescript
<Card elevated onPress={handleCardPress}>
  <Text>Card content goes here</Text>
</Card>
```

---

### Input

A themed text input with label and error support.

**Props:**
- All TextInput props
- `label` (string): Input label
- `error` (string): Error message to display
- `containerStyle` (ViewStyle): Container styles

**Example:**
```typescript
<Input
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  error={emailError}
  keyboardType="email-address"
/>
```

---

### Selector

A dropdown/picker trigger component with consistent styling.

**Props:**
- `label` (string): Selector label
- `value` (string, required): Current value
- `placeholder` (string): Placeholder text
- `onPress` (() => void, required): Press handler
- `error` (string): Error message
- `containerStyle` (ViewStyle): Container styles

**Example:**
```typescript
<Selector
  label="Country"
  value={selectedCountry}
  placeholder="Select a country"
  onPress={() => setShowPicker(true)}
  error={countryError}
/>
```

---

### PickerModal

A bottom sheet modal for selecting from a list of options.

**Props:**
- `visible` (boolean, required): Modal visibility
- `onClose` (() => void, required): Close handler
- `data` (T[], required): Array of options
- `onSelect` ((item: T) => void, required): Selection handler
- `getLabel` ((item: T) => string, required): Get display label
- `getKey` ((item: T) => string, required): Get unique key
- `title` (string): Modal title

**Example:**
```typescript
<PickerModal
  visible={showPicker}
  onClose={() => setShowPicker(false)}
  data={countries}
  onSelect={handleCountrySelect}
  getLabel={(country) => country.name}
  getKey={(country) => country.code}
  title="Select Country"
/>
```

---

### AnimatedView

A wrapper component that animates its children on mount.

**Props:**
- `children` (ReactNode, required): Content to animate
- `animation` ('fade' | 'slideUp' | 'slideDown' | 'scale'): Animation type
- `duration` (number): Animation duration in ms (default: 250)
- `delay` (number): Delay before animation starts (default: 0)
- `style` (ViewStyle): Additional styles

**Example:**
```typescript
// Simple fade in
<AnimatedView animation="fade">
  <Text>This fades in</Text>
</AnimatedView>

// Slide up with delay
<AnimatedView animation="slideUp" delay={100}>
  <Card>Content</Card>
</AnimatedView>

// Staggered list animations
{items.map((item, index) => (
  <AnimatedView
    key={item.id}
    animation="slideUp"
    delay={index * 50}
  >
    <ItemCard item={item} />
  </AnimatedView>
))}
```

**Animation Types:**
- `fade`: Opacity 0 to 1
- `slideUp`: Slides up from below with fade
- `slideDown`: Slides down from above with fade
- `scale`: Scales from 0.8 to 1 with fade

---

## Usage Guidelines

### When to Use Common Components

✅ **Use common components when:**
- Building standard UI elements (buttons, inputs, cards)
- You need consistent styling across screens
- You want automatic theme support
- You need accessibility features built-in

❌ **Don't use common components when:**
- You need highly specialized behavior
- The component doesn't fit your use case
- You're building a one-off custom UI element

### Customization

All components accept `style` props for customization:

```typescript
<Button
  title="Custom Button"
  onPress={handlePress}
  style={{ marginTop: 20 }}
  textStyle={{ fontSize: 18 }}
/>
```

However, prefer using theme tokens over custom styles:

```typescript
// ✅ Good
const { theme } = useTheme();
<Button
  style={{ marginTop: theme.spacing.lg }}
/>

// ❌ Avoid
<Button
  style={{ marginTop: 20 }}
/>
```

### Composition

Components can be composed together:

```typescript
<Card elevated>
  <Input
    label="Name"
    value={name}
    onChangeText={setName}
  />
  <Button
    title="Submit"
    onPress={handleSubmit}
    style={{ marginTop: theme.spacing.base }}
  />
</Card>
```

### Accessibility

All components include accessibility features:
- Minimum touch target sizes
- Proper contrast ratios
- Screen reader support
- Keyboard navigation (where applicable)

### Performance

- AnimatedView uses native driver for smooth animations
- Components are optimized for re-renders
- Use React.memo() for list items when needed

## Adding New Components

When adding new common components:

1. Create the component file in this directory
2. Use the `useTheme()` hook for styling
3. Accept standard React Native props
4. Include TypeScript types
5. Add JSDoc comments
6. Export from `index.ts`
7. Document in this README
8. Test in both light and dark modes

**Template:**
```typescript
/**
 * Description of component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface MyComponentProps {
  // Props here
}

export const MyComponent: React.FC<MyComponentProps> = ({
  // Destructure props
}) => {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      {/* Component content */}
    </View>
  );
};
```

## Testing

Test components with:
- Different theme modes (light/dark)
- Various screen sizes
- Different prop combinations
- Edge cases (empty states, errors, etc.)

## Future Components

Potential additions:
- Switch/Toggle
- Checkbox
- Radio Button
- Slider
- Badge
- Chip
- Avatar
- Divider
- Progress Bar
- Skeleton Loader
- Bottom Sheet
- Dialog/Alert
- Tabs
- Accordion
