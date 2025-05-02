import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  runOnJS,
  type SharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useRef, useState } from 'react';
import PaginationIndicator from './PaginationIndicator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGES = ['Page one', 'Page two', 'Page three', 'Page four'];

export default function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

const NextButton = ({
  onPress,
  currentIndex,
  totalPages,
}: {
  onPress: () => void;
  currentIndex: number;
  totalPages: number;
}) => {
  // Hide button on last page
  const isLastPage = currentIndex === totalPages - 1;

  if (isLastPage) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.nextButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.nextButtonText}>Next</Text>
    </TouchableOpacity>
  );
};

const PageComponent = ({
  page,
  index,
  scrollX,
}: { page: string; index: number; scrollX: SharedValue<number> }) => {
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

  // Function to handle next button press
  const handleNextPress = () => {
    if (currentIndex < PAGES.length - 1) {
      const nextIndex = currentIndex + 1;
      // Animate scroll to next page
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      // Update current index
      setCurrentIndex(nextIndex);
    }
  };

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
      <View style={styles.bottomControlsContainer}>
        <PaginationIndicator scrollX={scrollX} totalIndex={PAGES.length} />
        <NextButton
          onPress={handleNextPress}
          currentIndex={currentIndex}
          totalPages={PAGES.length}
        />
      </View>
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
  bottomControlsContainer: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 44,
    height: 50,
  },
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
