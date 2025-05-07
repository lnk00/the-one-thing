import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedKeyboard,
  useAnimatedStyle,
  KeyboardState,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import PagerIntro from './pager-intro';
import PagerLife from './pager-life';
import PagerIndicators from './pager-indicators';
import PagerControlls from './pager-controlls';
import { PAGES } from '../../state/pager-state';
import { usePagerNavigation } from '../../hooks/use-pager-navigation';

export default function Pager() {
  const scrollY = useSharedValue(0);
  const keyboard = useAnimatedKeyboard();
  const {
    flatListRef,
    handleNextPress,
    handleBackPress,
    isNextButtonDisabled,
    isBackButtonDisabled,
  } = usePagerNavigation();

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
      />
      <Animated.View
        style={[styles.bottomControlsContainer, animatedKeyboardStyles]}
      >
        <BlurView intensity={10} style={styles.blurView}>
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
