import { StyleSheet, View, Dimensions, Text, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PagerIntro({
  index,
  scrollY,
}: { index: number; scrollY: SharedValue<number> }) {
  const insets = useSafeAreaInsets();

  const inputRange = [
    (index - 1) * SCREEN_HEIGHT,
    index * SCREEN_HEIGHT,
    (index + 1) * SCREEN_HEIGHT,
  ];

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, inputRange, [0, 1, 0]);

    const scale = interpolate(scrollY.value, inputRange, [0.6, 1, 0.6]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.pageContainer, { paddingTop: insets.top + 24 }]}>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 2 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    gap: 24,
  },
  pageText: {
    fontSize: 34,
    fontWeight: '600',
    color: Colors.text,
  },
  boldText: {
    fontWeight: '900',
  },
});
