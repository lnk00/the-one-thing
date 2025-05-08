import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { useRef, type ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';

export type ButtonType = 'next' | 'back';
export type ButtonIconSide = 'left' | 'right';
export type ButtonSize = 'normal' | 'big';

export default function Button({
  onPress,
  children,
  icon,
  iconSide = 'left',
  disabled = false,
  visuallyDisabled = false,
  fullWidth = false,
  rounded = false,
  size = 'normal',
}: {
  onPress: () => void;
  children?: ReactNode;
  icon?: ReactNode;
  iconSide?: ButtonIconSide;
  disabled?: boolean;
  visuallyDisabled?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  size?: ButtonSize;
}) {
  const scale = useSharedValue(1);
  const pressStartTime = useRef<number>(0);
  const MIN_PRESS_DURATION = 150;

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePress = async () => {
    if (disabled) return;

    const pressDuration = Date.now() - pressStartTime.current;

    if (pressDuration < MIN_PRESS_DURATION) {
      const delayNeeded = MIN_PRESS_DURATION - pressDuration;
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, delayNeeded);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    scale.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withSpring(1, {
        damping: 8,
        stiffness: 150,
        mass: 0.5,
        overshootClamping: false,
      }),
    );

    onPress();
  };

  return (
    <View style={!fullWidth && { flexDirection: 'row' }}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => {
          if (disabled) return;
          pressStartTime.current = Date.now();
          triggerHaptic();
          scale.value = withTiming(0.95, { duration: 100 });
        }}
        onPressOut={() => {
          if (disabled) return;
          scale.value = withTiming(1, { duration: 150 });
        }}
      >
        <Animated.View
          style={[
            styles.container,
            animatedButtonStyle,
            rounded && styles.rounded,
            disabled && visuallyDisabled && styles.disabled,
            size === 'big' && styles.big,
          ]}
        >
          <View style={styles.content}>
            {icon && iconSide === 'left' && icon}
            {children && <Text style={styles.buttonText}>{children}</Text>}
            {icon && iconSide === 'right' && icon}
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rounded: {
    paddingHorizontal: 12,
  },
  big: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  disabled: {
    opacity: 0.1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
