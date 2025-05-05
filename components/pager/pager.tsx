import { StyleSheet, View, Dimensions, Keyboard } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  KeyboardState,
} from 'react-native-reanimated';
import { useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import PagerIntro from './pager-intro';
import PagerLife from './pager-life';
import PagerIndicators from './pager-indicators';
import PagerButton from './pager-button';

type PageType =
  | 'PAGE_INTRO'
  | 'PAGE_LIFE'
  | 'PAGE_YEARS'
  | 'PAGE_YEAR'
  | 'PAGE_MONTH'
  | 'PAGE_WEEK'
  | 'PAGE_DAY';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PAGES: Array<PageType> = [
  'PAGE_INTRO',
  'PAGE_LIFE',
  'PAGE_YEARS',
  'PAGE_YEAR',
  'PAGE_MONTH',
  'PAGE_WEEK',
  'PAGE_DAY',
];

export default function Pager() {
  const scrollY = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const keyboard = useAnimatedKeyboard();

  const animatedKeyboardStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          keyboard.state.value === KeyboardState.OPENING ||
          keyboard.state.value === KeyboardState.OPEN
            ? -keyboard.height.value + 50
            : -keyboard.height.value,
      },
    ],
  }));

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
    const isKeyboardOpen = Keyboard.isVisible();
    Keyboard.dismiss();
    setTimeout(
      () => {
        if (currentIndex < PAGES.length - 1) {
          const nextIndex = currentIndex + 1;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });

          setCurrentIndex(nextIndex);
        }
      },
      isKeyboardOpen ? 300 : 0,
    );
  };

  const handleBackPress = () => {
    const isKeyboardOpen = Keyboard.isVisible();
    Keyboard.dismiss();

    setTimeout(
      () => {
        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          flatListRef.current?.scrollToIndex({
            index: prevIndex,
            animated: true,
          });

          setCurrentIndex(prevIndex);
        }
      },
      isKeyboardOpen ? 300 : 0,
    );
  };

  return (
    <View style={[styles.container]}>
      <Animated.FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={({ item, index }) => {
          if (item === 'PAGE_INTRO') {
            return <PagerIntro index={index} scrollY={scrollY} />;
          }

          return <PagerLife index={index} scrollY={scrollY} />;
        }}
        keyExtractor={(_, index) => index.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        scrollEnabled={false}
      />
      <Animated.View
        style={[styles.bottomControlsContainer, animatedKeyboardStyles]}
      >
        <BlurView intensity={10} style={styles.blurView}>
          <PagerIndicators scrollX={scrollY} totalIndex={PAGES.length} />
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
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 64,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
