# Theme System Documentation

## Overview

The Engineering Pocket Helper app uses a comprehensive theming system that provides:
- Consistent colors, spacing, typography, and shadows
- Light and dark mode support
- Responsive layout utilities
- Reusable styled components
- Animation utilities

## Usage

### Using the Theme Hook

```typescript
import { useTheme } from '../theme/ThemeContext';

const MyComponent = () => {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello</Text>
    </View>
  );
};
```

### Theme Tokens

#### Colors
```typescript
theme.colors.primary          // Primary brand color
theme.colors.background       // Screen background
theme.colors.surface          // Card/surface background
theme.colors.text             // Primary text color
theme.colors.textSecondary    // Secondary text color
theme.colors.border           // Border color
theme.colors.success          // Success state
theme.colors.error            // Error state
theme.colors.warning          // Warning state
theme.colors.info             // Info state
```

#### Spacing
```typescript
theme.spacing.xs    // 4px
theme.spacing.sm    // 8px
theme.spacing.md    // 12px
theme.spacing.base  // 16px
theme.spacing.lg    // 20px
theme.spacing.xl    // 24px
theme.spacing.xxl   // 32px
```

#### Typography
```typescript
theme.typography.h1          // Large heading
theme.typography.h2          // Medium heading
theme.typography.h3          // Small heading
theme.typography.body        // Body text
theme.typography.caption     // Small text
theme.typography.button      // Button text
```

#### Shadows
```typescript
theme.shadows.sm    // Small shadow
theme.shadows.md    // Medium shadow
theme.shadows.lg    // Large shadow
theme.shadows.xl    // Extra large shadow
```

#### Border Radius
```typescript
theme.borderRadius.sm     // 4px
theme.borderRadius.md     // 8px
theme.borderRadius.lg     // 12px
theme.borderRadius.xl     // 16px
theme.borderRadius.round  // Fully rounded
```

## Common Components

### Button
```typescript
import { Button } from '../components/common';

<Button
  title="Click Me"
  onPress={handlePress}
  variant="primary"  // primary | secondary | outline | ghost | danger
  size="medium"      // small | medium | large
  disabled={false}
  loading={false}
  fullWidth={false}
/>
```

### Card
```typescript
import { Card } from '../components/common';

<Card onPress={handlePress} elevated={true}>
  <Text>Card content</Text>
</Card>
```

### Input
```typescript
import { Input } from '../components/common';

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  placeholder="Enter email"
/>
```

### Selector
```typescript
import { Selector } from '../components/common';

<Selector
  label="Choose option"
  value={selectedValue}
  onPress={() => setShowPicker(true)}
  placeholder="Select..."
/>
```

### PickerModal
```typescript
import { PickerModal } from '../components/common';

<PickerModal
  visible={showPicker}
  onClose={() => setShowPicker(false)}
  data={options}
  onSelect={handleSelect}
  getLabel={(item) => item.name}
  getKey={(item) => item.id}
  title="Select Option"
/>
```

### AnimatedView
```typescript
import { AnimatedView } from '../components/common';

<AnimatedView
  animation="slideUp"  // fade | slideUp | slideDown | scale
  duration={250}
  delay={0}
>
  <Text>Animated content</Text>
</AnimatedView>
```

## Responsive Utilities

```typescript
import { isSmallDevice, minTouchTarget, scale } from '../theme/responsive';

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchTarget,  // Ensures accessibility
    padding: scale(16),         // Scales with screen size
  },
});
```

## Dark Mode

Dark mode is automatically supported. The theme switches based on:
1. User preference (light/dark/auto)
2. System preference (when set to auto)

To change theme mode:
```typescript
const { setThemeMode } = useTheme();

// Set to light mode
await setThemeMode('light');

// Set to dark mode
await setThemeMode('dark');

// Follow system preference
await setThemeMode('auto');
```

## Accessibility

The theme system includes accessibility features:
- Minimum touch target sizes (44x44 on iOS, 48x48 on Android)
- High contrast colors
- Proper text scaling support
- Screen reader compatible components

## Best Practices

1. **Always use theme tokens** instead of hardcoded values
   ```typescript
   // ❌ Bad
   backgroundColor: '#007AFF'
   
   // ✅ Good
   backgroundColor: theme.colors.primary
   ```

2. **Use common components** for consistency
   ```typescript
   // ❌ Bad
   <TouchableOpacity style={customButtonStyle}>
     <Text>Click</Text>
   </TouchableOpacity>
   
   // ✅ Good
   <Button title="Click" onPress={handlePress} />
   ```

3. **Respect minimum touch targets** for accessibility
   ```typescript
   import { minTouchTarget } from '../theme/responsive';
   
   const styles = StyleSheet.create({
     touchable: {
       minHeight: minTouchTarget,
       minWidth: minTouchTarget,
     },
   });
   ```

4. **Use animations sparingly** for better performance
   ```typescript
   // Use for important UI transitions
   <AnimatedView animation="slideUp">
     <ImportantContent />
   </AnimatedView>
   ```

5. **Test in both light and dark modes** to ensure proper contrast
