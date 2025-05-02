import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
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
import LottieView from 'lottie-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PAGES = [
  'Page one',
  'Page two',
  'Page three',
  'Page four',
  'Page five',
  'Page six',
];

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
  scrollY,
}: { page: string; index: number; scrollY: SharedValue<number> }) => {
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
      <Animated.Text style={[styles.pageText, animatedTextStyle]}>
        This app is designed to help you{' '}
        <Text style={styles.boldText}>focus </Text>
        on what truly matters.
      </Animated.Text>
      <Animated.Text style={[styles.pageText, animatedTextStyle]}>
        Inspired by the principles of{' '}
        <Text style={styles.boldText}>The One Thing.</Text>
      </Animated.Text>
      <Animated.Text style={[styles.pageText, animatedTextStyle]}>
        We’ll guide you to identify your{' '}
        <Text style={styles.boldText}>long-term </Text>
        vision and turn it into practical daily{' '}
        <Text style={styles.boldText}>actions.</Text>
      </Animated.Text>
      <View style={{ flex: 2 }} />
    </View>
  );
};

function App() {
  const scrollY = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const newIndex = Math.round(event.contentOffset.y / SCREEN_HEIGHT);
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
          <PageComponent page={item} index={index} scrollY={scrollY} />
        )}
        keyExtractor={(_, index) => index.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        scrollEnabled={true}
      />
      <View style={styles.bottomControlsContainer}>
        <PagerIndicator scrollX={scrollY} totalIndex={PAGES.length} />
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
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    gap: 24,
  },
  pageText: {
    fontSize: 32,
    fontWeight: '600',
  },
  boldText: {
    fontSize: 32,
    fontWeight: '900', // Maximum boldness
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
