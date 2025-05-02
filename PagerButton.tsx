import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

export default function PagerButton({
  onPress,
}: {
  onPress: () => void;
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
        pressStartTime.current = Date.now();

        triggerHaptic();

        scale.value = withTiming(0.95, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
    >
      <Animated.View style={[styles.nextButton, animatedButtonStyle]}>
        <Text style={styles.nextButtonText}>Next</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
