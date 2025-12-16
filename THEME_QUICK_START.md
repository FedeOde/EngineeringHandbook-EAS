# Theme System Quick Start Guide

## Getting Started

### 1. Import the Theme Hook

```typescript
import { useTheme } from './theme/ThemeContext';
```

### 2. Use Theme in Your Component

```typescript
const MyScreen = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello World</Text>
    </View>
  );
};
```

## Common Patterns

### Themed Styles

```typescript
const MyComponent = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.base,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.md,
    },
    text: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content</Text>
    </View>
  );
};
```

### Using Common Components

```typescript
import { Button, Card, Input, Selector } from './components/common';

// Button
<Button
  title="Save"
  onPress={handleSave}
  variant="primary"
  size="medium"
/>

// Card
<Card elevated onPress={handlePress}>
  <Text>Card content</Text>
</Card>

// Input
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  error={emailError}
/>

// Selector
<Selector
  label="Choose option"
  value={selectedValue}
  onPress={() => setShowPicker(true)}
  placeholder="Select..."
/>
```

### Animations

```typescript
import { AnimatedView } from './components/common';

// Fade in
<AnimatedView animation="fade">
  <Text>Fades in</Text>
</AnimatedView>

// Slide up with delay
<AnimatedView animation="slideUp" delay={100}>
  <Text>Slides up after 100ms</Text>
</AnimatedView>

// Staggered list animations
{items.map((item, index) => (
  <AnimatedView key={item.id} animation="slideUp" delay={index * 50}>
    <ItemCard item={item} />
  </AnimatedView>
))}
```

### Responsive Layouts

```typescript
import { isSmallDevice, minTouchTarget, scale } from './theme/responsive';

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchTarget,  // Ensures 44x44 on iOS, 48x48 on Android
    padding: scale(16),         // Scales with screen size
  },
  container: {
    padding: isSmallDevice ? 12 : 20,  // Conditional spacing
  },
});
```

## Theme Tokens Reference

### Colors
```typescript
theme.colors.primary          // #007AFF (light) / #0A84FF (dark)
theme.colors.background       // #F5F5F5 (light) / #000000 (dark)
theme.colors.surface          // #FFFFFF (light) / #1C1C1E (dark)
theme.colors.text             // #000000 (light) / #FFFFFF (dark)
theme.colors.textSecondary    // #666666 (light) / #AEAEB2 (dark)
theme.colors.border           // #E5E5E5 (light) / #38383A (dark)
theme.colors.success          // Green
theme.colors.error            // Red
theme.colors.warning          // Yellow
theme.colors.info             // Blue
```

### Spacing
```typescript
theme.spacing.xs    // 4px
theme.spacing.sm    // 8px
theme.spacing.md    // 12px
theme.spacing.base  // 16px
theme.spacing.lg    // 20px
theme.spacing.xl    // 24px
theme.spacing.xxl   // 32px
```

### Typography
```typescript
theme.typography.h1       // 32px bold
theme.typography.h2       // 28px bold
theme.typography.h3       // 24px bold
theme.typography.body     // 16px regular
theme.typography.caption  // 12px regular
theme.typography.button   // 16px semibold
```

### Shadows
```typescript
theme.shadows.sm   // Subtle shadow
theme.shadows.md   // Medium shadow
theme.shadows.lg   // Large shadow
theme.shadows.xl   // Extra large shadow
```

### Border Radius
```typescript
theme.borderRadius.sm     // 4px
theme.borderRadius.md     // 8px
theme.borderRadius.lg     // 12px
theme.borderRadius.xl     // 16px
theme.borderRadius.round  // Fully rounded
```

## Changing Theme

```typescript
const { themeMode, setThemeMode } = useTheme();

// Set to light mode
await setThemeMode('light');

// Set to dark mode
await setThemeMode('dark');

// Follow system preference
await setThemeMode('auto');
```

## Best Practices

1. ✅ Always use theme tokens instead of hardcoded values
2. ✅ Use common components for consistency
3. ✅ Respect minimum touch targets (minTouchTarget)
4. ✅ Test in both light and dark modes
5. ✅ Use animations sparingly for performance
6. ❌ Don't hardcode colors or spacing
7. ❌ Don't create custom buttons/inputs without good reason
8. ❌ Don't ignore accessibility guidelines

## Migration Guide

### Before (Hardcoded)
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    color: '#000000',
  },
});
```

### After (Themed)
```typescript
const MyComponent = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.base,
      borderRadius: theme.borderRadius.lg,
    },
    text: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
  });
  
  return <View style={styles.container}>...</View>;
};
```

## Need Help?

- See `src/theme/README.md` for detailed documentation
- Check `UI_POLISH_IMPLEMENTATION.md` for implementation details
- Look at `HomeScreen.tsx` and `SettingsScreen.tsx` for examples
