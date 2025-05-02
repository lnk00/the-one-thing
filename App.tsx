import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import PagerIndicator from './PagerIndicator';
import PagerButton from './PagerButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGES = ['Page one', 'Page two', 'Page three', 'Page four'];

export default function Root() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <App />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const PageComponent = ({
  page,
  index,
  scrollX,
}: { page: string; index: number; scrollX: SharedValue<number> }) => {
  const insets = useSafeAreaInsets();

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
    <View style={[styles.pageContainer, { paddingTop: insets.top + 24 }]}>
      <Animated.Text style={[styles.pageText, animatedTextStyle]}>
        This app is designed to help you focus on what truly matters, inspired
        by the principles of "The One Thing."
      </Animated.Text>
      <Animated.Text style={[styles.pageText, animatedTextStyle]}>
        Here, you'll discover how to clarify your biggest goals and break them
        down into actionable steps, so you can make meaningful progress every
        day.
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

  const handleNextPress = () => {
    if (currentIndex < PAGES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }
  };

  const handleBackPress = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });

      setCurrentIndex(prevIndex);
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
        scrollEnabled={false}
      />
      <View style={styles.bottomControlsContainer}>
        <PagerIndicator scrollX={scrollX} totalIndex={PAGES.length} />
        <View style={styles.buttonsContainer}>
          <PagerButton
            type="back"
            onPress={handleBackPress}
            disabled={currentIndex === 0}
          />
          <PagerButton
            type="next"
            onPress={handleNextPress}
            disabled={currentIndex === PAGES.length - 1}
          />
        </View>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    gap: 24,
  },
  pageText: {
    fontSize: 32,
    fontWeight: '700',
  },
  bottomControlsContainer: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 50,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
