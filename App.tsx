import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { type DimensionValue, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeInUp,
} from 'react-native-reanimated';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

function App() {
  const insets = useSafeAreaInsets();
  const coverWidth = useSharedValue<DimensionValue>('100%');

  useEffect(() => {
    coverWidth.value = withDelay(
      400,
      withTiming('0%', {
        duration: 1000,
        easing: Easing.out(Easing.bezierFn(0.88, 0.03, 0.25, 0.95)),
      }),
    );
  }, [coverWidth]);

  const coverStyle = useAnimatedStyle(() => ({
    height: coverWidth.value,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Animated.View
        style={styles.titleContainer}
        entering={FadeInUp.duration(1000).easing(
          Easing.out(Easing.bezierFn(0.88, 0.03, 0.25, 0.95)),
        )}
      >
        <Text style={styles.title}>The One Thing</Text>
        <Animated.View style={[styles.titleCover, coverStyle]} />
      </Animated.View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  titleContainer: {
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginLeft: 10,
  },
  titleCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000000',
    height: '100%',
    width: '75%',
  },
});
