import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useRef, useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGES = ['Page one', 'Page two', 'Page three', 'Page four'];

export default function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

const Pagination = ({
  scrollX,
  currentIndex,
}: {
  scrollX: Animated.SharedValue<number>;
  currentIndex: number;
}) => {
  return (
    <View style={styles.paginationContainer}>
      {PAGES.map((_, index) => {
        const inputRange = [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ];

        const animatedDotStyle = useAnimatedStyle(() => {
          const width = interpolate(scrollX.value, inputRange, [20, 40, 20]);

          const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);

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
};

const PageComponent = ({
  page,
  index,
  scrollX,
}: { page: string; index: number; scrollX: Animated.SharedValue<number> }) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const animatedTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollX.value, inputRange, [100, 0, -100]);

    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0]);

    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8]);

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.pageContainer]}>
      <Animated.Text style={[styles.pageText, animatedTextStyle]}>
        {page}
      </Animated.Text>
    </View>
  );
};

function App() {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const newIndex = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      runOnJS(setCurrentIndex)(newIndex);
    },
  });

  return (
    <View style={[styles.container]}>
      <StatusBar style="auto" />
      <Animated.FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={({ item, index }) => (
          <PageComponent page={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <Pagination scrollX={scrollX} currentIndex={currentIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 64,
    left: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    height: 8,
    width: 20,
    borderRadius: 4,
    backgroundColor: '#aaa',
    marginHorizontal: 4,
  },
});
