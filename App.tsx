import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  runOnJS,
  type SharedValue,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import PaginationIndicator from './PaginationIndicator';

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

const NextButton = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  // Animation values
  const scale = useSharedValue(1);
  // Track press timestamp to calculate press duration
  const pressStartTime = useRef<number>(0);
  const MIN_PRESS_DURATION = 150; // Minimum time between haptics in ms

  // Animated styles for the button container
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Trigger haptic feedback
  const triggerHaptic = () => {
    // Use impact feedback - medium intensity feels good for button presses
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Handle button release with bounce animation
  const handlePress = async () => {
    const pressDuration = Date.now() - pressStartTime.current;

    // If press was very quick, add a delay before second haptic
    // This prevents the haptics from blending together
    if (pressDuration < MIN_PRESS_DURATION) {
      const delayNeeded = MIN_PRESS_DURATION - pressDuration;
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, delayNeeded);
    } else {
      // If press was long enough, trigger haptic immediately
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Sequence of animations:
    // 1. Quick scale up (from current scale -> 1.1)
    // 2. Bouncy scale down to normal (1.1 -> 1.0)
    scale.value = withSequence(
      // Quick scale up
      withTiming(1.1, { duration: 100 }),
      // Bouncy scale down with spring physics
      withSpring(1, {
        damping: 8, // Lower damping = more bounce
        stiffness: 150, // Higher stiffness = faster bounce
        mass: 0.5, // Lower mass = quicker movement
        overshootClamping: false, // Allow overshooting for bounce effect
      }),
    );

    // Call the original onPress handler
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => {
        // Record press start time
        pressStartTime.current = Date.now();

        // Trigger haptic feedback on press down
        triggerHaptic();

        // When pressed down, scale down slightly to 0.95
        scale.value = withTiming(0.95, { duration: 100 });
      }}
      onPressOut={() => {
        // If press is cancelled (not resulting in onPress),
        // animate back to normal size
        scale.value = withTiming(1, { duration: 150 });
      }}
    >
      <Animated.View style={[styles.nextButton, animatedButtonStyle]}>
        <Text style={styles.nextButtonText}>Next</Text>
      </Animated.View>
    </Pressable>
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
        <NextButton onPress={handleNextPress} />
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
