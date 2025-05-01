import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useSharedValue,
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

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Animated.View
        style={styles.titleContainer}
        entering={FadeInDown.duration(500).easing(Easing.elastic(1.5))}
      >
        <Text style={styles.title}>The One Thing</Text>
        <View style={styles.titleCover} />
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
  },
  titleCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ff0000',
    height: '100%',
    width: '50%',
  },
});
