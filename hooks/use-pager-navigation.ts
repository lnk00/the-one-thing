import { useRef } from 'react';
import { Keyboard } from 'react-native';
import type Animated from 'react-native-reanimated';
import { useAtom, useAtomValue } from 'jotai';
import { currentPageIndexAtom, PAGES } from '../state/pager-state';
import { onboardingLifeInputAtom } from '../state/onboarding-state';

export function usePagerNavigation() {
  const flatListRef = useRef<Animated.FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useAtom(currentPageIndexAtom);
  const lifeInputValue = useAtomValue(onboardingLifeInputAtom);

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

  const isNextButtonDisabled = () => {
    if (currentIndex === PAGES.length - 1) {
      return true;
    }

    if (PAGES[currentIndex] === 'PAGE_LIFE' && lifeInputValue.length === 0) {
      return true;
    }

    return false;
  };

  const isBackButtonDisabled = () => {
    return currentIndex === 0;
  };

  return {
    flatListRef,
    currentIndex,
    handleNextPress,
    handleBackPress,
    isNextButtonDisabled,
    isBackButtonDisabled,
  };
}
