import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import Button from '../button';

export type ButtonType = 'next' | 'back';

export default function PagerControlls({
  onNextPress,
  onBackPress,
  backDisabled = false,
  nextDisabled = false,
}: {
  onNextPress: () => void;
  onBackPress: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
}) {
  const opacity = useSharedValue(backDisabled ? 0 : 1);
  const translateX = useSharedValue(backDisabled ? -20 : 0);
  const ANIMATION_DURATION = 300;

  useEffect(() => {
    if (backDisabled) {
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
  }, [backDisabled, opacity, translateX]);

  const animatedBackButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      pointerEvents: opacity.value === 0 ? 'none' : 'auto',
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedBackButtonStyle}>
        <Button
          onPress={onBackPress}
          disabled={backDisabled}
          rounded
          icon={
            <AntDesign name="arrowleft" size={20} color={Colors.background} />
          }
        />
      </Animated.View>

      <Button onPress={onNextPress} disabled={nextDisabled}>
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
});
