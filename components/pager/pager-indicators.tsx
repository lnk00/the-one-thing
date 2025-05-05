import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

export default function PagerIndicators({
  scrollX,
  totalIndex,
}: {
  scrollX: SharedValue<number>;
  totalIndex: number;
}) {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  return (
    <View style={styles.paginationContainer}>
      {Array.from(Array(totalIndex)).map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const pagePosition = index * SCREEN_HEIGHT;
          const distance = Math.abs(scrollX.value - pagePosition);
          const progress = Math.max(0, 1 - distance / SCREEN_HEIGHT);
          const width = 10 + progress * 20;
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
    width: 10,
    borderRadius: 4,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
});
