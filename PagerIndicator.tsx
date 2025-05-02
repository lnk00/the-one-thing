import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

export default function PagerIndicator({
  scrollX,
  totalIndex,
}: {
  scrollX: SharedValue<number>;
  totalIndex: number;
}) {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  return (
    <View style={styles.paginationContainer}>
      {Array.from(Array(totalIndex)).map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const pagePosition = index * SCREEN_WIDTH;
          const distance = Math.abs(scrollX.value - pagePosition);
          const progress = Math.max(0, 1 - distance / SCREEN_WIDTH);
          const width = 20 + progress * 40;
          const opacity = 0.2 + progress * 0.5;

          return {
            width,
            opacity,
          };
        });

        return (
          <Animated.View
            key={index.toString()}
            style={[styles.paginationDot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    height: 8,
    width: 20,
    borderRadius: 4,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
});
