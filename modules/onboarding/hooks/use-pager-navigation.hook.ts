import { useRef } from 'react';
import { Keyboard } from 'react-native';
import type Animated from 'react-native-reanimated';
import { useAtom, useAtomValue } from 'jotai';
import {
  currentPageIndexAtom,
  onboardingLifeInputAtom,
  type PageType,
} from '../../../store';
import { useRouter } from 'expo-router';

export function usePagerNavigation(pages: PageType[]) {
  const flatListRef = useRef<Animated.FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useAtom(currentPageIndexAtom);
  const lifeInputValue = useAtomValue(onboardingLifeInputAtom);
  const router = useRouter();

  const handleNextPress = () => {
    const isKeyboardOpen = Keyboard.isVisible();
    Keyboard.dismiss();

    if (pages[currentIndex] === 'PAGE_LIFE') {
      router.navigate('protected/life-goals-results');
    } else {
      setTimeout(
        () => {
          if (currentIndex < pages.length - 1) {
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
    }
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
    if (currentIndex === pages.length - 1) {
      return true;
    }

    if (pages[currentIndex] === 'PAGE_LIFE' && lifeInputValue.length === 0) {
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
