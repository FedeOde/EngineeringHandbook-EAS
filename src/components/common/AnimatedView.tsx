/**
 * Animated View component for smooth transitions
 */

import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { animationDuration } from '../../theme/animations';

type AnimationType = 'fade' | 'slideUp' | 'slideDown' | 'scale';

interface AnimatedViewProps {
  children: React.ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  animation = 'fade',
  duration = animationDuration.normal,
  delay = 0,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, duration, delay]);

  const getAnimatedStyle = (): any => {
    switch (animation) {
      case 'fade':
        return {
          opacity: animatedValue,
        };
      case 'slideUp':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      case 'slideDown':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        };
      case 'scale':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
      default:
        return { opacity: animatedValue };
    }
  };

  return (
    <Animated.View style={[getAnimatedStyle(), style]}>
      {children}
    </Animated.View>
  );
};
