import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedKeyboard,
  useAnimatedStyle,
  KeyboardState,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { usePagerNavigation } from '../../hooks/use-pager-navigation.hook';
import PagerIntro from './pager-intro.component';
import PagerLife from './pager-life.component';
import PagerIndicators from './pager-indicators.component';
import PagerControlls from './pager-controlls.component';
import type { PageType } from '../../../../state/pager/types';

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
  const keyboard = useAnimatedKeyboard();
  const {
    flatListRef,
    handleNextPress,
    handleBackPress,
    isNextButtonDisabled,
    isBackButtonDisabled,
  } = usePagerNavigation(PAGES);

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
  });

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
        getItemLayout={(_, index) => ({
          length: Dimensions.get('window').height,
          offset: Dimensions.get('window').height * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          console.warn('Failed to scroll to index', info);
        }}
      />
      <Animated.View
        style={[styles.bottomControlsContainer, animatedKeyboardStyles]}
      >
        <BlurView intensity={10} tint="extraLight" style={styles.blurView}>
          <PagerIndicators scrollX={scrollY} totalIndex={PAGES.length} />
          <View style={styles.buttonsContainer}>
            <PagerControlls
              onBackPress={handleBackPress}
              onNextPress={handleNextPress}
              backDisabled={isBackButtonDisabled()}
              nextDisabled={isNextButtonDisabled()}
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
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
