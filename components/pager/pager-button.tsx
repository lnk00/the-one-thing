import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export type ButtonType = 'next' | 'back';

export default function PagerButton({
  onPress,
  type = 'next',
  disabled = false,
}: {
  onPress: () => void;
  type?: ButtonType;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(type === 'back' ? (disabled ? 0 : 1) : 1);
  const translateX = useSharedValue(type === 'back' ? (disabled ? -20 : 0) : 0);
  const pressStartTime = useRef<number>(0);
  const MIN_PRESS_DURATION = 150;
  const ANIMATION_DURATION = 300;

  useEffect(() => {
    if (type === 'back') {
      if (disabled) {
        translateX.value = withTiming(-20, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
        });
        opacity.value = withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        opacity.value = withTiming(1, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
        });
        translateX.value = withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
        });
      }
    }
  }, [disabled, type, opacity, translateX]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: type === 'back' ? translateX.value : 0 },
      ],
      opacity: type === 'back' ? opacity.value : disabled ? 0.5 : 1,
      ...(type === 'back' && {
        pointerEvents: opacity.value === 0 ? 'none' : 'auto',
      }),
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
          type === 'next' ? styles.buttonNext : styles.buttonBack,
          animatedButtonStyle,
        ]}
      >
        {type === 'next' ? (
          <Text style={styles.buttonText}>Next</Text>
        ) : (
          <AntDesign name="arrowleft" size={20} color={Colors.background} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonNext: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBack: {
    backgroundColor: Colors.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
